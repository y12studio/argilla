import { Page } from "@playwright/test";

export type Role = "admin" | "owner" | "annotator";

export const loginUserAndWaitFor = async (
  page: Page,
  waitForURL: string,
  role: Role = "admin"
) => {
  // Mock the /api/v1/oauth2/providers endpoint
  await page.route("**/api/v1/oauth2/providers", async (route) => {
    await route.fulfill({
      json: [], // Or any other appropriate mock response
    });
  });

  await page.route("**/api/v1/me", async (route) => {
    await route.fulfill({
      json: {
        username: "FAKE_USER",
        first_name: "FAKE",
        full_name: "FAKE_USER",
        role,
        workspaces: ["WORKSPACE 1"],
      },
    });
  });

  // Mock the /api/v1/token endpoint
  await page.route("**/api/v1/token", async (route) => {
    await route.fulfill({
      json: {
        access_token: "FAKE_TOKEN",
        token_type: "bearer",
      },
    });
  });

  await page.goto("/sign-in");

  await page.locator('input[name="Username"]').fill("damian");

  await page.locator('input[name="Password"]').fill("12345678");

  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(`**/${waitForURL}`);
};
