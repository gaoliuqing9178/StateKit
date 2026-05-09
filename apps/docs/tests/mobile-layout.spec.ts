import { expect, type Page, test } from "@playwright/test";

const mobileViewport = { width: 390, height: 844 };

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const documentWidth = document.documentElement.scrollWidth;
        return documentWidth <= window.innerWidth + 1;
      }),
    )
    .toBe(true);
}

test.describe("Mobile layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport);
  });

  test("keeps the home shell and primary navigation usable on phone width", async ({
    page,
  }) => {
    await page.goto("/");

    const primaryNav = page.getByRole("navigation", { name: "Primary" });

    await expectNoHorizontalOverflow(page);
    await expect(primaryNav).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Recipes" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Examples" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Install" })).toBeVisible();

    await page.getByTestId("home-open-installation").click();

    await expect(page).toHaveURL(/\/docs\/installation$/);
    await expect(page.getByTestId("installation-step-01")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("stacks the onboarding hero media and action groups on phone width", async ({
    page,
  }) => {
    await page.goto("/examples/onboarding-activation");

    const demo = page.getByTestId("page-onboarding-state-demo");
    const content = demo.locator(".sk-shell__content");
    const media = demo.locator(".sk-shell__media");
    const actionGroup = demo.locator(".sk-onboarding-actions__group");
    const mediaRail = demo.locator(".sk-onboarding-media__rail");
    const mediaCanvas = demo.locator(".sk-onboarding-media__canvas");

    await expectNoHorizontalOverflow(page);
    await expect(content).toBeVisible();
    await expect(media).toBeVisible();
    await expect(actionGroup).toHaveCSS("flex-direction", "column");

    const contentBox = await content.boundingBox();
    const mediaBox = await media.boundingBox();
    const railBox = await mediaRail.boundingBox();
    const canvasBox = await mediaCanvas.boundingBox();

    expect(contentBox).not.toBeNull();
    expect(mediaBox).not.toBeNull();
    expect(railBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();
    expect(mediaBox!.y).toBeGreaterThanOrEqual(
      contentBox!.y + contentBox!.height - 1,
    );
    expect(mediaBox!.x).toBeGreaterThanOrEqual(0);
    expect(mediaBox!.x + mediaBox!.width).toBeLessThanOrEqual(
      mobileViewport.width + 1,
    );
    expect(canvasBox!.y).toBeGreaterThanOrEqual(railBox!.y + railBox!.height - 1);
    expect(canvasBox!.x).toBeGreaterThanOrEqual(0);
    expect(canvasBox!.x + canvasBox!.width).toBeLessThanOrEqual(
      mobileViewport.width + 1,
    );
  });

  test("collapses recipe detail grids to a single column on phone width", async ({
    page,
  }) => {
    await page.goto("/recipes/onboarding-workspace-state");

    const detailPreview = page.getByTestId("recipe-detail-preview");
    const metadata = page.getByTestId("recipe-detail-metadata");
    const livePreview = page.getByTestId("recipe-detail-live-preview");

    await expectNoHorizontalOverflow(page);
    await expect(detailPreview).toBeVisible();
    await expect(metadata).toBeVisible();
    await expect(livePreview.getByTestId("onboarding-slot-media-example")).toBeVisible();
    await expect(livePreview.getByTestId("onboarding-slot-actions-example")).toBeVisible();
    await expect(page.locator(".detail-info-grid")).toHaveCSS(
      "grid-template-columns",
      /^(?!.* ).+/,
    );
    await expect(page.locator(".detail-doc-grid").first()).toHaveCSS(
      "grid-template-columns",
      /^(?!.* ).+/,
    );
  });
});
