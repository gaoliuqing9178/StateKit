import { expect, type Page, test } from "@playwright/test";

async function expectOnboardingStatValuesInsideCards(page: Page) {
  const statCards = page
    .getByTestId("onboarding-slot-media-example")
    .locator(".sk-onboarding-media__stat");

  const count = await statCards.count();

  for (let index = 0; index < count; index += 1) {
    const card = statCards.nth(index);
    const value = card.locator("strong");
    const cardBox = await card.boundingBox();
    const valueBox = await value.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(valueBox).not.toBeNull();
    expect(valueBox!.x + valueBox!.width).toBeLessThanOrEqual(
      cardBox!.x + cardBox!.width + 1,
    );
  }
}

test.describe("Recipes navigation", () => {
  test("opens a recipe detail from the recipes index", async ({ page }) => {
    await page.goto("/recipes");
    await page.getByTestId("recipe-link-page-error-state").click();

    await expect(page).toHaveURL(/\/recipes\/page-error-state$/);

    const preview = page.getByTestId("recipe-detail-preview");
    const livePreview = page.getByTestId("recipe-detail-live-preview");

    await expect(preview).toBeVisible();
    await expect(livePreview.locator(".sk-shell")).toHaveAttribute(
      "data-category",
      "error",
    );
    await expect(livePreview.locator(".sk-shell")).toHaveAttribute(
      "data-layout",
      "page",
    );
    await expect(page.getByTestId("recipe-detail-metadata")).toContainText(
      "page-error-state",
    );
    await expect(page.getByTestId("recipe-detail-metadata")).toContainText(
      "ErrorState",
    );
  });

  test("redirects legacy blocks routes to the recipe detail page", async ({ page }) => {
    await page.goto("/blocks/page-error-state");

    await expect(page).toHaveURL(/\/recipes\/page-error-state$/);
    await expect(page.getByTestId("recipe-detail-preview")).toBeVisible();
    await expect(
      page.getByTestId("recipe-detail-live-preview").locator(".sk-shell"),
    ).toHaveAttribute("data-category", "error");
  });

  test("opens the expanded onboarding activation recipes", async ({ page }) => {
    await page.goto("/recipes/onboarding-workspace-state");

    const workspacePreview = page.getByTestId("recipe-detail-live-preview");
    await expect(workspacePreview.locator(".sk-shell")).toHaveAttribute(
      "data-category",
      "onboarding",
    );
    await expect(
      workspacePreview.getByTestId("onboarding-slot-media-example"),
    ).toBeVisible();
    await expectOnboardingStatValuesInsideCards(page);

    await page.goto("/recipes");

    await page.getByTestId("recipe-link-onboarding-members-state").click();
    await expect(page).toHaveURL(/\/recipes\/onboarding-members-state$/);
    const membersPreview = page.getByTestId("recipe-detail-live-preview");
    await expect(membersPreview.locator(".sk-shell")).toHaveAttribute(
      "data-category",
      "onboarding",
    );
    await expect(
      membersPreview.getByTestId("onboarding-slot-media-example"),
    ).toBeVisible();
    await expect(
      membersPreview.getByTestId("onboarding-slot-actions-example"),
    ).toBeVisible();
    await expectOnboardingStatValuesInsideCards(page);
    await expect(page.getByTestId("onboarding-slot-code-example")).toContainText(
      "<template #media>",
    );
    await expect(page.getByTestId("onboarding-slot-code-example")).toContainText(
      "<template #actions>",
    );
    await expect(page.getByTestId("recipe-detail-metadata")).toContainText(
      "OnboardingState",
    );

    await page.goto("/recipes");
    await page.getByTestId("recipe-link-onboarding-integration-state").click();
    await expect(page).toHaveURL(/\/recipes\/onboarding-integration-state$/);
    const integrationPreview = page.getByTestId("recipe-detail-live-preview");
    await expect(integrationPreview.locator(".sk-shell")).toHaveAttribute(
      "data-category",
      "onboarding",
    );
    await expect(
      integrationPreview.getByTestId("onboarding-slot-media-example"),
    ).toBeVisible();
    await expect(
      integrationPreview.getByTestId("onboarding-slot-actions-example"),
    ).toBeVisible();
    await expect(page.getByTestId("recipe-detail-metadata")).toContainText(
      "OnboardingState",
    );
  });
});
