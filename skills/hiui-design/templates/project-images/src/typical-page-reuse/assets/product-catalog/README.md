# 项目真实商品图片目录

把后续 `hiui-design` 生成页面要复用的真实商品图放在这里。

接入步骤：

1. 将真实图片文件放入当前目录
2. 在 `../project-product-images.ts` 中 import 这些图片
3. 更新 `projectProductImageMap`
4. 页面数据层继续只传 `imageType` / `imageKey`

在真实图片接入完成前：

- 业务页不允许回退到临时插画
- 业务页不允许回退到内联 `data:image`
- 当前页面如果缺少真实图片，会自动不显示图片区

## 推荐文件名

按下面的文件名直接落图，后续接线最快：

- `phone.png`
- `phone-family.png`
- `phone-premium.png`
- `tablet.png`
- `watch.png`
- `earbuds.png`
- `speaker.png`
- `projector.png`
- `camera.png`
- `smart-band.png`
- `power-bank.png`
- `scooter.png`
- `laptop.png`
- `tv.png`
- `refrigerator.png`
- `robot-vacuum.png`
- `router.png`
- `range-hood.png`
- `smart-display.png`
- `smart-lock.png`
- `air-conditioner.png`
- `washer.png`
- `water-purifier.png`

## 当前这批图片建议优先放入

基于你已经提供的图片，当前最优先的是：

- `phone-family.png`
- `phone-premium.png`
- `phone.png`
- `earbuds.png`
- `laptop.png`
- `tablet.png`
- `tv.png`
- `refrigerator.png`
- `air-conditioner.png`
- `washer.png`
- `water-purifier.png`
- `robot-vacuum.png`
- `range-hood.png`
- `smart-lock.png`
- `router.png`
- `smart-display.png`
