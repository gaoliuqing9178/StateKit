import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".mts", ".cts", ".vue"]);
const ignoredDirectories = new Set([
  ".agent",
  ".git",
  ".vite",
  "blob-report",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);

const scopes = [
  {
    name: "shared",
    packageName: "@statekit-vue/shared",
    sourceRoot: "packages/shared/src",
  },
  {
    name: "vue",
    packageName: "@statekit-vue/vue",
    sourceRoot: "packages/vue/src",
  },
  {
    name: "react",
    packageName: "@statekit-vue/react",
    sourceRoot: "packages/react/src",
  },
  {
    name: "docs",
    packageName: "@statekit/docs",
    sourceRoot: "apps/docs/src",
  },
  {
    name: "example",
    packageName: "@statekit/example-vite-vue-admin",
    sourceRoot: "examples/vite-vue-admin/src",
  },
].map((scope) => ({
  ...scope,
  absoluteSourceRoot: path.resolve(repoRoot, scope.sourceRoot),
}));

const manifestFiles = [
  "packages/shared/package.json",
  "packages/vue/package.json",
  "packages/react/package.json",
  "apps/docs/package.json",
  "examples/vite-vue-admin/package.json",
];

const importPatterns = [
  /(?:^|[\r\n;])\s*import\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g,
  /(?:^|[\r\n;])\s*export\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
];

const violations = [];
const seenViolations = new Set();
let checkedFiles = 0;
let checkedImports = 0;
let checkedManifests = 0;

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function relativeToRepo(absolutePath) {
  return toPosix(path.relative(repoRoot, absolutePath));
}

function isInside(childPath, parentPath) {
  const relativePath = path.relative(parentPath, childPath);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function isRelativeImport(specifier) {
  return specifier.startsWith("./") || specifier.startsWith("../");
}

function isPackageImport(specifier, packageName) {
  return specifier === packageName || specifier.startsWith(`${packageName}/`);
}

function isPublicVueImport(specifier) {
  return specifier === "@statekit-vue/vue" || specifier === "@statekit-vue/vue/styles.css";
}

function isPublicReactImport(specifier) {
  return specifier === "@statekit-vue/react" || specifier === "@statekit-vue/react/styles.css";
}

function isDirectWorkspacePath(specifier) {
  const normalized = specifier.replace(/\\/g, "/");
  return (
    normalized.startsWith("packages/") ||
    normalized.startsWith("apps/") ||
    normalized.startsWith("examples/")
  );
}

function addViolation({ file, importSpecifier, dependency, group, rule, message, fix }) {
  const key = [
    file,
    importSpecifier ?? "",
    dependency ?? "",
    group ?? "",
    rule,
  ].join("|");

  if (seenViolations.has(key)) {
    return;
  }

  seenViolations.add(key);
  violations.push({
    file,
    importSpecifier,
    dependency,
    group,
    rule,
    message,
    fix,
  });
}

async function collectSourceFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...await collectSourceFiles(absolutePath));
      }
      continue;
    }

    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function extractImportSpecifiers(source) {
  const specifiers = [];

  for (const pattern of importPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      specifiers.push(match[1]);
    }
  }

  return specifiers;
}

function checkGenericImportRules(scope, absoluteFile, specifier) {
  const file = relativeToRepo(absoluteFile);

  if (isRelativeImport(specifier)) {
    const resolvedImport = path.resolve(path.dirname(absoluteFile), specifier);
    if (!isInside(resolvedImport, scope.absoluteSourceRoot)) {
      addViolation({
        file,
        importSpecifier: specifier,
        rule: "relative-import-stays-in-scope",
        message: `${scope.sourceRoot} must not reach outside its own source tree with relative imports.`,
        fix: "Use the public workspace package entry, or move shared facts into the allowed lower layer.",
      });
    }
  }

  if (isDirectWorkspacePath(specifier)) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "no-direct-workspace-source-path",
      message: "Source files must not import workspace folders by raw repo paths.",
      fix: "Use a public package entry such as @statekit-vue/shared or @statekit-vue/vue.",
    });
  }

  if (specifier.startsWith("@statekit-vue/shared/")) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "no-shared-deep-imports",
      message: "Deep shared imports bypass the published @statekit-vue/shared entry.",
      fix: "Export the needed type or metadata from packages/shared/src/index.ts and import @statekit-vue/shared.",
    });
  }

  if (specifier.startsWith("@statekit-vue/vue/") && !isPublicVueImport(specifier)) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "no-vue-deep-imports",
      message: "Deep Vue package imports bypass the published @statekit-vue/vue entry.",
      fix: "Export the needed API from packages/vue/src/index.ts, or use @statekit-vue/vue/styles.css for styles.",
    });
  }

  if (specifier.startsWith("@statekit-vue/react/") && !isPublicReactImport(specifier)) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "no-react-deep-imports",
      message: "Deep React package imports bypass the published @statekit-vue/react entry.",
      fix: "Export the needed API from packages/react/src/index.ts, or use @statekit-vue/react/styles.css for styles.",
    });
  }
}

function checkSharedImportRules(absoluteFile, specifier) {
  const file = relativeToRepo(absoluteFile);

  if (
    specifier === "vue" ||
    specifier.startsWith("vue/") ||
    specifier === "vue-router" ||
    specifier.startsWith("vue-router/") ||
    specifier.startsWith("@vue/")
  ) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "shared-is-framework-neutral",
      message: "packages/shared is the framework-neutral metadata and type layer.",
      fix: "Move Vue-specific code into packages/vue and keep packages/shared limited to serializable metadata/types.",
    });
  }

  if (
    isPackageImport(specifier, "@statekit-vue/vue") ||
    isPackageImport(specifier, "@statekit-vue/react") ||
    isPackageImport(specifier, "@statekit/docs") ||
    isPackageImport(specifier, "@statekit/example-vite-vue-admin")
  ) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "shared-has-no-upper-layer-imports",
      message: "packages/shared must not depend on Vue components, docs, or examples.",
      fix: "Move the dependency upward, or expose framework-neutral data from packages/shared instead.",
    });
  }
}

function checkVueImportRules(absoluteFile, specifier) {
  const file = relativeToRepo(absoluteFile);

  if (
    isPackageImport(specifier, "@statekit-vue/react") ||
    isPackageImport(specifier, "@statekit/docs") ||
    isPackageImport(specifier, "@statekit/example-vite-vue-admin")
  ) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "vue-does-not-depend-on-apps",
      message: "packages/vue is the reusable Vue package and must not depend on docs or examples.",
      fix: "Keep app-only stories in apps/docs or examples/vite-vue-admin.",
    });
  }
}

function checkReactImportRules(absoluteFile, specifier) {
  const file = relativeToRepo(absoluteFile);

  if (
    isPackageImport(specifier, "@statekit-vue/vue") ||
    isPackageImport(specifier, "@statekit/docs") ||
    isPackageImport(specifier, "@statekit/example-vite-vue-admin")
  ) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "react-does-not-depend-on-vue-or-apps",
      message: "packages/react is the reusable React package and must not depend on Vue, docs, or examples.",
      fix: "Keep framework-specific code in its own adapter and share only framework-neutral data through @statekit-vue/shared.",
    });
  }
}

function checkDocsImportRules(absoluteFile, specifier) {
  const file = relativeToRepo(absoluteFile);

  if (isPackageImport(specifier, "@statekit/example-vite-vue-admin")) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "docs-does-not-depend-on-example",
      message: "apps/docs must not depend on the example app implementation.",
      fix: "Move shared docs facts into packages/shared or duplicate docs-only demo data inside apps/docs.",
    });
  }
}

function checkExampleImportRules(absoluteFile, specifier) {
  const file = relativeToRepo(absoluteFile);

  if (isPackageImport(specifier, "@statekit-vue/shared")) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "example-consumes-vue-public-api",
      message: "examples/vite-vue-admin should behave like a real consumer and only use the Vue package.",
      fix: "Import StateKit APIs through @statekit-vue/vue, or promote the needed API through that public package.",
    });
  }

  if (isPackageImport(specifier, "@statekit-vue/react")) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "example-consumes-vue-public-api",
      message: "examples/vite-vue-admin is the Vue example app and should only use the Vue package.",
      fix: "Keep React examples in a separate React consumer, or import StateKit APIs through @statekit-vue/vue here.",
    });
  }

  if (isPackageImport(specifier, "@statekit/docs")) {
    addViolation({
      file,
      importSpecifier: specifier,
      rule: "example-does-not-depend-on-docs",
      message: "examples/vite-vue-admin must not depend on docs-site implementation details.",
      fix: "Keep docs-only data in apps/docs or expose reusable product APIs from the package layer.",
    });
  }
}

function checkImport(scope, absoluteFile, specifier) {
  checkGenericImportRules(scope, absoluteFile, specifier);

  if (scope.name === "shared") {
    checkSharedImportRules(absoluteFile, specifier);
  }

  if (scope.name === "vue") {
    checkVueImportRules(absoluteFile, specifier);
  }

  if (scope.name === "react") {
    checkReactImportRules(absoluteFile, specifier);
  }

  if (scope.name === "docs") {
    checkDocsImportRules(absoluteFile, specifier);
  }

  if (scope.name === "example") {
    checkExampleImportRules(absoluteFile, specifier);
  }
}

function checkManifestDependency(manifestFile, manifestName, group, dependency) {
  if (manifestName === "@statekit-vue/shared") {
    if (
      dependency === "vue" ||
      dependency === "vue-router" ||
      dependency.startsWith("@vue/") ||
      dependency === "@statekit-vue/vue" ||
      dependency === "@statekit-vue/react" ||
      dependency === "@statekit/docs" ||
      dependency === "@statekit/example-vite-vue-admin"
    ) {
      addViolation({
        file: manifestFile,
        dependency,
        group,
        rule: "shared-manifest-stays-framework-neutral",
        message: "@statekit-vue/shared must not declare framework, component, docs, or example dependencies.",
        fix: "Keep framework packages in @statekit-vue/vue, apps/docs, or examples/vite-vue-admin.",
      });
    }
  }

  if (manifestName === "@statekit-vue/vue") {
    if (
      dependency === "@statekit-vue/react" ||
      dependency === "@statekit/docs" ||
      dependency === "@statekit/example-vite-vue-admin"
    ) {
      addViolation({
        file: manifestFile,
        dependency,
        group,
        rule: "vue-manifest-does-not-depend-on-apps",
        message: "@statekit-vue/vue must not declare React, docs, or example app dependencies.",
        fix: "Keep framework adapters independent and keep app dependencies in their own workspace package.json files.",
      });
    }
  }

  if (manifestName === "@statekit-vue/react") {
    if (
      dependency === "@statekit-vue/vue" ||
      dependency === "@statekit/docs" ||
      dependency === "@statekit/example-vite-vue-admin"
    ) {
      addViolation({
        file: manifestFile,
        dependency,
        group,
        rule: "react-manifest-does-not-depend-on-vue-or-apps",
        message: "@statekit-vue/react must not declare Vue, docs, or example app dependencies.",
        fix: "Keep framework adapters independent and share only @statekit-vue/shared.",
      });
    }
  }

  if (manifestName === "@statekit/docs") {
    if (dependency === "@statekit/example-vite-vue-admin") {
      addViolation({
        file: manifestFile,
        dependency,
        group,
        rule: "docs-manifest-does-not-depend-on-example",
        message: "@statekit/docs must not declare a dependency on the example app.",
        fix: "Keep example-only integration code in examples/vite-vue-admin.",
      });
    }
  }

  if (manifestName === "@statekit/example-vite-vue-admin") {
    if (
      dependency === "@statekit-vue/shared" ||
      dependency === "@statekit-vue/react" ||
      dependency === "@statekit/docs"
    ) {
      addViolation({
        file: manifestFile,
        dependency,
        group,
        rule: "example-manifest-uses-vue-public-api",
        message: "The example app should depend on @statekit-vue/vue as a real consumer.",
        fix: "Remove direct shared/docs dependencies and consume StateKit through @statekit-vue/vue.",
      });
    }
  }
}

async function checkSourceScopes() {
  for (const scope of scopes) {
    const files = await collectSourceFiles(scope.absoluteSourceRoot);

    for (const file of files) {
      checkedFiles += 1;
      const source = await readFile(file, "utf8");
      const specifiers = extractImportSpecifiers(source);

      for (const specifier of specifiers) {
        checkedImports += 1;
        checkImport(scope, file, specifier);
      }
    }
  }
}

async function checkManifests() {
  for (const manifestFile of manifestFiles) {
    const manifestPath = path.resolve(repoRoot, manifestFile);
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    checkedManifests += 1;

    for (const group of ["dependencies", "peerDependencies", "optionalDependencies", "devDependencies"]) {
      const dependencies = manifest[group] ?? {};

      for (const dependency of Object.keys(dependencies)) {
        checkManifestDependency(manifestFile, manifest.name, group, dependency);
      }
    }
  }
}

await checkSourceScopes();
await checkManifests();

if (violations.length > 0) {
  console.error("[StateKit] Boundary check failed.");

  violations.forEach((violation, index) => {
    console.error("");
    console.error(`${index + 1}. ${violation.file}`);
    if (violation.importSpecifier) {
      console.error(`   import: ${violation.importSpecifier}`);
    }
    if (violation.dependency) {
      console.error(`   ${violation.group}: ${violation.dependency}`);
    }
    console.error(`   rule: ${violation.rule}`);
    console.error(`   issue: ${violation.message}`);
    console.error(`   fix: ${violation.fix}`);
  });

  process.exitCode = 1;
} else {
  console.log(
    `[StateKit] Boundary check passed. Checked ${checkedFiles} files, ${checkedImports} imports, and ${checkedManifests} manifests.`,
  );
}
