# @hi-ui/modal

## 5.0.0

### Major Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`0b34e1c15`](https://github.com/XiaoMi/hiui/commit/0b34e1c15bbf98c9e44f6d249366bb2a97cad218) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(modal): 支持根据滚动位置来控制头尾部边框的显示 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`feab0390b`](https://github.com/XiaoMi/hiui/commit/feab0390b5758c855b8036013e976ecd510e7e46) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(modal): add styles and classNames api (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`7f08a4e4f`](https://github.com/XiaoMi/hiui/commit/7f08a4e4fa47e44c242fb441d2747a5ab22f3954) Thanks [@zyprepare](https://github.com/zyprepare)! - chore(modal&toast): 使用 react-compat 提供的 React 渲染方法 (5.0)

- [#3502](https://github.com/XiaoMi/hiui/pull/3502) [`59cef699f`](https://github.com/XiaoMi/hiui/commit/59cef699f96f56d4f68fae7f9dadb960c487b5de) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`1e226cd66`](https://github.com/XiaoMi/hiui/commit/1e226cd66413cea8eb1e63b1cb83c1bfbf5f0a41) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 修改 react-compat 依赖管理方式 & 更新 react-transition-group 依赖 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`9218c3b18`](https://github.com/XiaoMi/hiui/commit/9218c3b185893cfc7ec1390f3eea895f2fb834d2) Thanks [@zyprepare](https://github.com/zyprepare)! - chore(modal): confirm 方法中的 onConfirm reject 时不关闭弹窗 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`8c0ee78f0`](https://github.com/XiaoMi/hiui/commit/8c0ee78f013dcd9ced94cef13a69933e039621aa) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`9b34d99bc`](https://github.com/XiaoMi/hiui/commit/9b34d99bc2aa8b78b9e3281e08afc086ac4afea1) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 5.0 UI 问题 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`79ea480f3`](https://github.com/XiaoMi/hiui/commit/79ea480f33bb8f692dda1e6252a9d2a75c3ac30d) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(global-context): 增加 size api 全局配置 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`e2b5c3628`](https://github.com/XiaoMi/hiui/commit/e2b5c362825e41b76488d6d697ccc4fa0e54d043) Thanks [@zyprepare](https://github.com/zyprepare)! - chore(modal): ModalApiProps 暴露更多 Modal 组件参数 (5.0)

- [#3508](https://github.com/XiaoMi/hiui/pull/3508) [`ec647a5ee`](https://github.com/XiaoMi/hiui/commit/ec647a5eed37085e3214da263bf63f3dfd3bb8f2) Thanks [@lanzhi-lee](https://github.com/lanzhi-lee)! - 调整 useModalContext 的返回值,与静态 Api 保持一致

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`2e56529f7`](https://github.com/XiaoMi/hiui/commit/2e56529f7ea8c74e2fac8b6061628d4fd0d862ac) Thanks [@zyprepare](https://github.com/zyprepare)! - styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`95abba983`](https://github.com/XiaoMi/hiui/commit/95abba98391a31c3cd79704fa0a63f64f437601f) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修改 UI 问题 (5.0)

- [#3504](https://github.com/XiaoMi/hiui/pull/3504) [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe) Thanks [@zyprepare](https://github.com/zyprepare)! - style: 修复 UI/样式问题 (5.0)

- [#3505](https://github.com/XiaoMi/hiui/pull/3505) [`25f3cb496`](https://github.com/XiaoMi/hiui/commit/25f3cb49643e53aab440993974aa9e9de96ccaa3) Thanks [@lanzhi-lee](https://github.com/lanzhi-lee)! - Modal 新增 useModal 函数,用以解决静态 api 调用时,内容元素无法获取上下文的问题

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`3e31bb724`](https://github.com/XiaoMi/hiui/commit/3e31bb724f0cd000ef5395deec99753c17aa31fd) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(modal): 样式修改 (5.0)

- Updated dependencies [[`eea29eade`](https://github.com/XiaoMi/hiui/commit/eea29eade364317198270daa62d7454279f9068a), [`7f204c892`](https://github.com/XiaoMi/hiui/commit/7f204c892156ea8a4fb95d218db9d59c8c4e0c49), [`122d1d859`](https://github.com/XiaoMi/hiui/commit/122d1d859bb92379fbe109fe9a5581259e6bb9a1), [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`8c0ee78f0`](https://github.com/XiaoMi/hiui/commit/8c0ee78f013dcd9ced94cef13a69933e039621aa), [`9b34d99bc`](https://github.com/XiaoMi/hiui/commit/9b34d99bc2aa8b78b9e3281e08afc086ac4afea1), [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39), [`fd4c20bbd`](https://github.com/XiaoMi/hiui/commit/fd4c20bbd30e18bc4c1a2eb078acaa4790f7b2eb), [`79ea480f3`](https://github.com/XiaoMi/hiui/commit/79ea480f33bb8f692dda1e6252a9d2a75c3ac30d), [`2e56529f7`](https://github.com/XiaoMi/hiui/commit/2e56529f7ea8c74e2fac8b6061628d4fd0d862ac), [`3a7186e4b`](https://github.com/XiaoMi/hiui/commit/3a7186e4b4e7ce351c3856f3e1ba574b9f6df22f), [`8a92ec660`](https://github.com/XiaoMi/hiui/commit/8a92ec660d7622768574dfe2e799b24d14e052a7), [`1429eced2`](https://github.com/XiaoMi/hiui/commit/1429eced2c79d22b6973229af3860b5dc48ad4a9), [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`e3dea9be5`](https://github.com/XiaoMi/hiui/commit/e3dea9be5e62d1e83147f787654a3576983572fa), [`25f3cb496`](https://github.com/XiaoMi/hiui/commit/25f3cb49643e53aab440993974aa9e9de96ccaa3), [`976ec929d`](https://github.com/XiaoMi/hiui/commit/976ec929da088830d4d4bfa5438aa679676f71ca), [`f1ab51725`](https://github.com/XiaoMi/hiui/commit/f1ab517258599ee2dfad183e4a8c7b855ef409c1), [`7f08a4e4f`](https://github.com/XiaoMi/hiui/commit/7f08a4e4fa47e44c242fb441d2747a5ab22f3954), [`c407744fe`](https://github.com/XiaoMi/hiui/commit/c407744fea78d93da66b73eed0b62d18e5b3a011), [`d91a8bb0f`](https://github.com/XiaoMi/hiui/commit/d91a8bb0f887fa886215aa596852eef3c2ce8519), [`4006b2c8c`](https://github.com/XiaoMi/hiui/commit/4006b2c8cabba5ec553b69a17e4bf3fb53fe9180), [`e42e2badf`](https://github.com/XiaoMi/hiui/commit/e42e2badfd099ced93eaf8414513d7a49d1e66c0), [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193), [`58ad82e94`](https://github.com/XiaoMi/hiui/commit/58ad82e9441e76bf6090e6a0f4e36a04342c25f0), [`95d930354`](https://github.com/XiaoMi/hiui/commit/95d930354a1ab4291e98a9abccb9525d6c210795), [`99801c2d1`](https://github.com/XiaoMi/hiui/commit/99801c2d12628c194657579eccd09a86aedea22b)]:
  - @hi-ui/button@5.0.0
  - @hi-ui/icons@5.0.0
  - @hi-ui/core@5.0.0
  - @hi-ui/use-id@5.0.0
  - @hi-ui/use-latest@5.0.0
  - @hi-ui/use-merge-refs@5.0.0
  - @hi-ui/use-scroll-lock@5.0.0
  - @hi-ui/use-toggle@5.0.0
  - @hi-ui/icon-button@5.0.0
  - @hi-ui/portal@5.0.0
  - @hi-ui/classname@5.0.0
  - @hi-ui/container@5.0.0
  - @hi-ui/dom-utils@5.0.0
  - @hi-ui/env@5.0.0
  - @hi-ui/func-utils@5.0.0
  - @hi-ui/react-utils@5.0.0
  - @hi-ui/type-assertion@5.0.0
  - @hi-ui/use-merge-semantic@5.0.0
  - @hi-ui/react-compat@5.0.0
  - @hi-ui/use-patch-element@5.0.0

## 4.4.2

### Patch Changes

- [#3344](https://github.com/XiaoMi/hiui/pull/3344) [`59d9dbafb`](https://github.com/XiaoMi/hiui/commit/59d9dbafb64c8a1d2954a5f2efa280696e0960be) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(modal): 增加 onConfirm 错误处理逻辑 (#3343)

## 4.4.1

### Patch Changes

- [#3118](https://github.com/XiaoMi/hiui/pull/3118) [`6d3bcc266`](https://github.com/XiaoMi/hiui/commit/6d3bcc266d2a8ca1eea4d4a40247709eb3016246) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(modal): 优化 Modal 组件的关闭按钮样式，增加自动边距设置 (#3116)

## 4.4.0

### Minor Changes

- [#3101](https://github.com/XiaoMi/hiui/pull/3101) [`8bba9316b`](https://github.com/XiaoMi/hiui/commit/8bba9316baa01df2192bfd4ed5d3c7b3c93c0b87) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(modal): 以 api 方式调用时支持异步关闭弹窗 (#3012)

## 4.3.0

### Minor Changes

- [#3068](https://github.com/XiaoMi/hiui/pull/3068) [`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(portal-context): Provider 增加 portal 参数，支持配置全局 container (#3060)

### Patch Changes

- Updated dependencies [[`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770)]:
  - @hi-ui/core@4.0.9

## 4.2.0

### Minor Changes

- [#2849](https://github.com/XiaoMi/hiui/pull/2849) [`85307a41b`](https://github.com/XiaoMi/hiui/commit/85307a41bfbb573310f1f4747b979aea5e91474d) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 新增自定义 zIndex 功能

## 4.1.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/button@4.0.10
  - @hi-ui/icon-button@4.0.9
  - @hi-ui/portal@4.0.8
  - @hi-ui/classname@4.0.5
  - @hi-ui/container@4.1.1

## 4.1.0

### Minor Changes

- [#2722](https://github.com/XiaoMi/hiui/pull/2722) [`a25261a88`](https://github.com/XiaoMi/hiui/commit/a25261a884f9b3470924c29564b3c4758ebab6cf) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: api 增加 close 方法和 key 参数

## 4.0.15

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-id@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-merge-refs@4.0.4
  - @hi-ui/use-scroll-lock@4.0.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/button@4.0.9
  - @hi-ui/icon-button@4.0.8
  - @hi-ui/portal@4.0.7
  - @hi-ui/classname@4.0.4
  - @hi-ui/container@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/react-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.0.14

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-id@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-merge-refs@4.0.3
  - @hi-ui/use-scroll-lock@4.0.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/button@4.0.8
  - @hi-ui/icon-button@4.0.7
  - @hi-ui/portal@4.0.6
  - @hi-ui/classname@4.0.3
  - @hi-ui/container@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/react-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.0.13

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-id@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-merge-refs@4.0.2
  - @hi-ui/use-scroll-lock@4.0.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/button@4.0.7
  - @hi-ui/icon-button@4.0.6
  - @hi-ui/portal@4.0.5
  - @hi-ui/classname@4.0.2
  - @hi-ui/container@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/react-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.0.12

### Patch Changes

- [#2669](https://github.com/XiaoMi/hiui/pull/2669) [`d8e7308f5`](https://github.com/XiaoMi/hiui/commit/d8e7308f5ab898795a284141d618a1253d218d9d) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 补充 api 调用中的参数类型声明

## 4.0.11

### Patch Changes

- [#2564](https://github.com/XiaoMi/hiui/pull/2564) [`eda80aaf9`](https://github.com/XiaoMi/hiui/commit/eda80aaf97bb536ff91321e36deccb3c195eb310) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复键盘操作中按钮失焦问题

## 4.0.10

### Patch Changes

- [#2411](https://github.com/XiaoMi/hiui/pull/2411) [`f7d1257ad`](https://github.com/XiaoMi/hiui/commit/f7d1257ad2006fd40cabb2d16f1fde77677f3117) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复问题: 设置 height 为表达式时,组件中会有 max-height 限制导致无效

- Updated dependencies [[`f7d1257ad`](https://github.com/XiaoMi/hiui/commit/f7d1257ad2006fd40cabb2d16f1fde77677f3117)]:
  - @hi-ui/icons@4.0.6

## 4.0.9

### Patch Changes

- [#2376](https://github.com/XiaoMi/hiui/pull/2376) [`783172359`](https://github.com/XiaoMi/hiui/commit/78317235998b09e080961e25104d84dcea943a28) Thanks [@zyprepare](https://github.com/zyprepare)! - onClose 设置后，点击关闭按钮没有触发回调

## 4.0.8

### Patch Changes

- [#2365](https://github.com/XiaoMi/hiui/pull/2365) [`93ba5824b`](https://github.com/XiaoMi/hiui/commit/93ba5824b325d305fbbfd228888651806a337e33) Thanks [@zyprepare](https://github.com/zyprepare)! - 体验问题: 鼠标选中内容滑动到外部，松开后模态框会关闭
