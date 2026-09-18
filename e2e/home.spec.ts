import { test, expect } from "@playwright/test";

test.describe("Landing de UPMINA", () => {
  test("carga la home y muestra el header con navegación", async ({ page }) => {
    await page.goto("/");

    // El logo/link "UPMINA" del header debe estar visible
    await expect(page.getByRole("link", { name: "UPMINA", exact: true })).toBeVisible();

    // El hero de HomePage.tsx también dice "UPMINA" (como <h1>), pero es un
    // elemento distinto al link del header, así que lo distinguimos por rol.
    await expect(page.getByRole("heading", { name: "UPMINA" })).toBeVisible();

    // Al menos un link de navegación de sección debe estar presente
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Twitch" }),
    ).toBeVisible();
  });

  test("el footer muestra el aviso legal de fan site no oficial", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/proyecto no oficial creado por fans/i)).toBeVisible();
  });
});
