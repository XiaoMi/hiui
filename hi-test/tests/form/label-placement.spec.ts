import { test, expect } from '@playwright/test'

test('label placement', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/data-input-form--label-placement')

  const input1 = await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByRole('textbox')
    .first()
    .boundingBox()

  const label1 = await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByText('编码：')
    .first()
    .boundingBox()

  const dis = input1?.x && label1?.x ? input1.x - label1.x : 0
  expect(dis).toBeGreaterThan(0) // Assuming you want to check if the distance is greater than 0
})
