# 项目真实商品图片目录

把后续 `hiui-design` 生成页面要复用的真实商品图放在这里。

当前 skill 只下发图片接线骨架；归档里不包含任何内置图片文件。

接入步骤：

1. 将真实图片文件放入当前目录
2. 在 `../project-product-images.ts` 中 import 这些图片
3. 更新 `projectProductImageMap`
4. 页面数据层继续只传 `imageType` / `imageKey`

在真实图片接入完成前：

- 业务页不允许回退到临时插画
- 业务页不允许回退到内联 `data:image`
- 当前页面如果缺少真实图片，会自动隐藏图片区

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

## 默认状态

- 目录骨架存在，但允许暂时没有任何真实图片文件
- 页面命中图片位时，应优先复用项目真实图片；如果当前没有真实图片，则隐藏图片区，而不是回退到包内示意图、临时插画或内联图片
