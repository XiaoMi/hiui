# @hi-ui/modal

## 5.0.0-rc.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 0b34e1c15: feat(modal): 支持根据滚动位置来控制头尾部边框的显示 (5.0)
- feab0390b: feat(modal): add styles and classNames api (5.0)
- 7f08a4e4f: chore(modal&toast): 使用 react-compat 提供的 React 渲染方法 (5.0)
- 59cef699f: feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- 1e226cd66: chore: 修改 react-compat 依赖管理方式 & 更新 react-transition-group 依赖 (5.0)
- 9218c3b18: chore(modal): confirm 方法中的 onConfirm reject 时不关闭弹窗 (5.0)
- 8c0ee78f0: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 9b34d99bc: fix: 修复 5.0 UI 问题 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- e2b5c3628: chore(modal): ModalApiProps 暴露更多 Modal 组件参数 (5.0)
- ec647a5ee: 调整 useModalContext 的返回值,与静态 Api 保持一致
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 95abba983: fix: 修改 UI 问题 (5.0)
- eb17c4697: style: 修复 UI/样式问题 (5.0)
- 25f3cb496: Modal 新增 useModal 函数,用以解决静态 api 调用时,内容元素无法获取上下文的问题
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 3e31bb724: fix(modal): 样式修改 (5.0)
- Updated dependencies [eea29eade]
- Updated dependencies [7f204c892]
- Updated dependencies [122d1d859]
- Updated dependencies [eb17c4697]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [3a7186e4b]
- Updated dependencies [8a92ec660]
- Updated dependencies [1429eced2]
- Updated dependencies [eb17c4697]
- Updated dependencies [e3dea9be5]
- Updated dependencies [25f3cb496]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [7f08a4e4f]
- Updated dependencies [c407744fe]
- Updated dependencies [d91a8bb0f]
- Updated dependencies [4006b2c8c]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [58ad82e94]
- Updated dependencies [95d930354]
- Updated dependencies [99801c2d1]
  - @hi-ui/button@5.0.0-rc.0
  - @hi-ui/icons@5.0.0-rc.0
  - @hi-ui/core@5.0.0-rc.0
  - @hi-ui/use-id@5.0.0-rc.0
  - @hi-ui/use-latest@5.0.0-rc.0
  - @hi-ui/use-merge-refs@5.0.0-rc.0
  - @hi-ui/use-scroll-lock@5.0.0-rc.0
  - @hi-ui/use-toggle@5.0.0-rc.0
  - @hi-ui/icon-button@5.0.0-rc.0
  - @hi-ui/portal@5.0.0-rc.0
  - @hi-ui/classname@5.0.0-rc.0
  - @hi-ui/container@5.0.0-rc.0
  - @hi-ui/dom-utils@5.0.0-rc.0
  - @hi-ui/env@5.0.0-rc.0
  - @hi-ui/func-utils@5.0.0-rc.0
  - @hi-ui/react-utils@5.0.0-rc.0
  - @hi-ui/type-assertion@5.0.0-rc.0
  - @hi-ui/use-merge-semantic@5.0.0-rc.0
  - @hi-ui/react-compat@5.0.0-rc.0
  - @hi-ui/use-patch-element@4.0.1-rc.0

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
