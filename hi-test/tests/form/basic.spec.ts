import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/data-input-form--basic')

  await expect(page).toHaveTitle(/Basic/)

  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByRole('textbox')
    .first()
    .fill('123')

  await expect(
    page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('max is 100')
  ).toBeVisible()

  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByRole('textbox')
    .nth(1)
    .clear()

  // 测试是否弹出警告 testInput2 is required
  await expect(
    page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByText('testInput2 is required')
  ).toBeVisible()
})
