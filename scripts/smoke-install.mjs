import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = "npm";
const keepTemp = process.env.STATEKIT_SMOKE_KEEP_TEMP === "1";

function runCommand(command, args, options = {}) {
  const { cwd = repoRoot, capture = false } = options;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      shell: process.platform === "win32",
    });

    let stdout = "";
    let stderr = "";

    if (capture) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const message = capture
        ? stderr.trim() || stdout.trim() || `${command} ${args.join(" ")} failed`
        : `${command} ${args.join(" ")} failed with exit code ${code}`;
      reject(new Error(message));
    });
  });
}

async function packWorkspace(packageDir, outputDir) {
  const { stdout } = await runCommand(
    npmCommand,
    ["pack", "--json", "--pack-destination", outputDir],
    { cwd: packageDir, capture: true },
  );

  const result = JSON.parse(stdout.trim());
  if (!Array.isArray(result) || result.length === 0 || !result[0]?.filename) {
    throw new Error(`Unable to parse npm pack output for ${packageDir}`);
  }

  return path.join(outputDir, result[0].filename);
}

async function writeConsumerProject(projectDir, sharedTarball, vueTarball) {
  const srcDir = path.join(projectDir, "src");
  await mkdir(srcDir, { recursive: true });

  const consumerPackageJson = {
    name: "statekit-smoke-consumer",
    private: true,
    type: "module",
    scripts: {
      build: "vite build",
      typecheck: "vue-tsc --noEmit -p tsconfig.json",
    },
    dependencies: {
      "@statekit/shared": `file:${sharedTarball.replaceAll("\\", "/")}`,
      "@statekit/vue": `file:${vueTarball.replaceAll("\\", "/")}`,
      vue: "^3.4.0",
    },
    devDependencies: {
      "@vitejs/plugin-vue": "^5.0.0",
      typescript: "^5.0.0",
      vite: "^5.0.0",
      "vue-tsc": "^2.0.0",
    },
  };

  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      strict: true,
      resolveJsonModule: true,
      isolatedModules: true,
      esModuleInterop: true,
      skipLibCheck: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      types: ["vite/client"],
    },
    include: ["src/**/*.ts", "src/**/*.vue", "vite.config.ts"],
  };

  const appVue = `<script setup lang="ts">
import { EmptySearchState } from "@statekit/vue";
import { priorityStateBlockIds, stateBlockMetaList } from "@statekit/shared";

const description = \`Loaded \${stateBlockMetaList.length} packed blocks and \${priorityStateBlockIds.length} launch states from npm tarballs.\`;
const primaryAction = {
  label: "Clear filters",
  loading: true,
  loadingLabel: "Clearing filters...",
  onClick: () => {},
};
const secondaryAction = null;
</script>

<template>
  <main
    style="
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px;
      background: linear-gradient(180deg, #f7fafc, #edf3fb);
    "
  >
    <EmptySearchState
      title="Smoke test consumer"
      :description="description"
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
      layout="panel"
    />
  </main>
</template>
`;

  const mainTs = `import { createApp } from "vue";
import App from "./App.vue";
import "@statekit/vue/styles.css";

createApp(App).mount("#app");
`;

  const viteConfig = `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
`;

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>StateKit Smoke Consumer</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

  await Promise.all([
    writeFile(
      path.join(projectDir, "package.json"),
      `${JSON.stringify(consumerPackageJson, null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      path.join(projectDir, "tsconfig.json"),
      `${JSON.stringify(tsconfig, null, 2)}\n`,
      "utf8",
    ),
    writeFile(path.join(projectDir, "vite.config.ts"), viteConfig, "utf8"),
    writeFile(path.join(projectDir, "index.html"), indexHtml, "utf8"),
    writeFile(path.join(srcDir, "App.vue"), appVue, "utf8"),
    writeFile(path.join(srcDir, "main.ts"), mainTs, "utf8"),
  ]);
}

async function main() {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "statekit-smoke-"));
  const packsDir = path.join(tempRoot, "packs");
  const consumerDir = path.join(tempRoot, "consumer");

  console.log(`[smoke:install] temp root: ${tempRoot}`);

  try {
    await mkdir(packsDir, { recursive: true });

    const sharedTarball = await packWorkspace(path.join(repoRoot, "packages", "shared"), packsDir);
    const vueTarball = await packWorkspace(path.join(repoRoot, "packages", "vue"), packsDir);

    await writeConsumerProject(consumerDir, sharedTarball, vueTarball);

    await runCommand(npmCommand, ["install", "--no-fund", "--no-audit"], {
      cwd: consumerDir,
    });
    await runCommand(npmCommand, ["run", "typecheck"], { cwd: consumerDir });
    await runCommand(npmCommand, ["run", "build"], { cwd: consumerDir });

    console.log("[smoke:install] external consumer build passed");
  } finally {
    if (keepTemp) {
      console.log(`[smoke:install] kept temp directory: ${tempRoot}`);
    } else {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error("[smoke:install] failed");
  console.error(error);
  process.exitCode = 1;
});
