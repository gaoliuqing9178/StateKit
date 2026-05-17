import { expect, type Locator, type Page, test } from "@playwright/test";

const visualViewport = { width: 1280, height: 900 };

const screenshotOptions = {
  animations: "disabled" as const,
  caret: "hide" as const,
  maxDiffPixelRatio: 0.002,
  scale: "css" as const,
  threshold: 0.08,
};

const deterministicRenderingStyle = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }

  html {
    scrollbar-gutter: stable;
  }
`;

const successShadowLineProbeStyle = `
  .sk-shell[data-category="success"] .sk-shell__media-frame {
    background: #ffffff !important;
    border-color: #d7deea !important;
    box-shadow: none !important;
  }
`;

type Rect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

async function openRecipeFigure(page: Page, slug: string) {
  await page.setViewportSize(visualViewport);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/recipes/${slug}`);
  await page.addStyleTag({ content: deterministicRenderingStyle });
  await page.evaluate(() => document.fonts.ready.then(() => true));

  const preview = page.getByTestId("recipe-detail-live-preview");
  const shell = preview.locator(".sk-shell");
  const frame = preview.locator(".sk-shell__media-frame");

  await expect(shell).toBeVisible();
  await expect(frame).toBeVisible();

  return { frame, preview };
}

async function getRect(locator: Locator): Promise<Rect> {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error("Expected locator to have a bounding box.");
  }

  return box;
}

function centerOf(rect: Rect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function expectWithin(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

async function expectCentered(child: Locator, parent: Locator) {
  const childCenter = centerOf(await getRect(child));
  const parentCenter = centerOf(await getRect(parent));

  expectWithin(childCenter.x, parentCenter.x);
  expectWithin(childCenter.y, parentCenter.y);
}

async function expectCenteredX(child: Locator, parent: Locator) {
  const childCenter = centerOf(await getRect(child));
  const parentCenter = centerOf(await getRect(parent));

  expectWithin(childCenter.x, parentCenter.x);
}

test.describe("Visual regression screenshots", () => {
  test("keeps the error cross centered in the figure", async ({ page }) => {
    const { frame, preview } = await openRecipeFigure(page, "page-error-state");
    const figure = preview.locator(".sk-figure--error");

    await expectCentered(figure.locator(".sk-figure__cross").first(), figure);
    await expectCentered(
      figure.locator(".sk-figure__cross.is-secondary"),
      figure,
    );
    await expect(frame).toHaveScreenshot(
      "error-cross-centered.png",
      screenshotOptions,
    );
  });

  test("keeps the permission lock centered in the figure", async ({ page }) => {
    const { frame, preview } = await openRecipeFigure(
      page,
      "no-permission-state",
    );
    const figure = preview.locator(".sk-figure--permission");
    const lockBody = figure.locator(".sk-figure__lock-body");
    const lockArch = figure.locator(".sk-figure__lock-arch");

    await expectCenteredX(lockBody, figure);
    await expectCenteredX(lockArch, figure);

    const bodyBox = await getRect(lockBody);
    const archBox = await getRect(lockArch);

    expect(archBox.y).toBeLessThan(bodyBox.y);
    expect(archBox.y + archBox.height).toBeGreaterThan(bodyBox.y - 1);
    await expect(frame).toHaveScreenshot(
      "permission-lock-centered.png",
      screenshotOptions,
    );
  });

  test("keeps success figures free of the old shadow line", async ({ page }) => {
    const { frame, preview } = await openRecipeFigure(page, "task-success-state");
    const figure = preview.locator(".sk-figure--success");

    await expect(figure.locator(".sk-figure__shadow-line")).toHaveCount(0);
    await expect(figure.locator(".sk-figure__badge")).toBeVisible();
    await expect(figure.locator(".sk-figure__check")).toHaveCount(2);
    await page.addStyleTag({ content: successShadowLineProbeStyle });
    await expect(frame).toHaveScreenshot(
      "success-without-shadow-line.png",
      {
        ...screenshotOptions,
        mask: [
          figure.locator(".sk-figure__badge"),
          figure.locator(".sk-figure__check"),
        ],
        maskColor: "#ffffff",
      },
    );
  });
});
