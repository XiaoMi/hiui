import { test, expect } from '@playwright/test'

test('validate', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/data-input-form--validate')

  // const input1 = await page
  //   .frameLocator('iframe[title="storybook-preview-iframe"]')
  //   .getByRole('textbox')
  //   .first()
  //   .boundingBox()

  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByRole('button', { name: '提交' })
    .click()

  await expect(
    page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('请输入名称')
  ).toBeVisible()

  await expect(
    page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('必须是正数')
  ).toBeVisible()

  await expect(
    page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('请选择门店')
  ).toBeVisible()

  await expect(
    page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('请选择区域')
  ).toBeVisible()

  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByRole('button', { name: '清除校验信息' })
    .click()
})
