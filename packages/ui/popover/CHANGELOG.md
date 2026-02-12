# @hi-ui/popover

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 542076e55: feat(popover): 暴露 update 方法，支持调用刷新校准弹窗位置 (5.0)
- f2be367e9: feat(popper): 增加 PopperOverlayProps 的新事件处理属性 onEnter, onEntered, onExit (5.0)

### Patch Changes

- 1e226cd66: chore: 修改 react-compat 依赖管理方式 & 更新 react-transition-group 依赖 (5.0)
- 1662753e0: style: fix ui bug (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- d021b4fa6: feat: add onOpen callback trigger on visibility change (5.0)
- 6f4b13151: perf(popover): 优化通过方法调用组件时的渲染和打开方式 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- 86910f5e2: style: 修改 UI (5.0)
- Updated dependencies [1e226cd66]
- Updated dependencies [1662753e0]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [be5a59325]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [277c5033a]
- Updated dependencies [95abba983]
- Updated dependencies [e3dea9be5]
- Updated dependencies [f1ab51725]
- Updated dependencies [7f08a4e4f]
- Updated dependencies [33da3144e]
- Updated dependencies [58ad82e94]
- Updated dependencies [a0f0c9d6b]
- Updated dependencies [f2be367e9]
- Updated dependencies [1972fd16a]
- Updated dependencies [86910f5e2]
  - @hi-ui/popper@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/use-id@5.0.0-experimental.0
  - @hi-ui/use-latest@5.0.0-experimental.0
  - @hi-ui/use-timeout@5.0.0-experimental.0
  - @hi-ui/use-toggle@5.0.0-experimental.0
  - @hi-ui/use-unmount-effect@5.0.0-experimental.0
  - @hi-ui/array-utils@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/dom-utils@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0
  - @hi-ui/react-utils@5.0.0-experimental.0
  - @hi-ui/type-assertion@5.0.0-experimental.0
  - @hi-ui/react-compat@5.0.0-experimental.0

## 4.2.0

### Minor Changes

- [#3206](https://github.com/XiaoMi/hiui/pull/3206) [`a4e208e55`](https://github.com/XiaoMi/hiui/commit/a4e208e556945c322607644dd648d8f30914e639) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(popover): add popperClassName api (#3205)

### Patch Changes

- Updated dependencies [[`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0)]:
  - @hi-ui/popper@4.1.7

## 4.1.2

### Patch Changes

- [#3125](https://github.com/XiaoMi/hiui/pull/3125) [`74e236866`](https://github.com/XiaoMi/hiui/commit/74e236866fe8fc0c248e3e656d5a73dbe283e4e3) Thanks [@zyprepare](https://github.com/zyprepare)! - chore(popover): 暴露 modifiers 参数 (#3123)

- Updated dependencies [[`b97a8f8`](https://github.com/XiaoMi/hiui/commit/b97a8f81664b023237791769e0fd62b90956fc90)]:
  - @hi-ui/popper@4.1.6

## 4.1.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/popper@4.1.5
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.1.0

### Minor Changes

- [#2684](https://github.com/XiaoMi/hiui/pull/2684) [`ba6e0265d`](https://github.com/XiaoMi/hiui/commit/ba6e0265da07964423d3a684dd068dcf50865dbc) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 1.增加 showTitleDivider api,设置后会是另外一种更紧凑的具有分割线的标题布局;2.增加以 API 的方式调用组件的能力

### Patch Changes

- Updated dependencies [[`ba6e0265d`](https://github.com/XiaoMi/hiui/commit/ba6e0265da07964423d3a684dd068dcf50865dbc)]:
  - @hi-ui/popper@4.1.4

## 4.0.8

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-id@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-timeout@4.0.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-unmount-effect@4.0.4
  - @hi-ui/popper@4.1.3
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/react-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.0.7

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-id@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-timeout@4.0.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-unmount-effect@4.0.3
  - @hi-ui/popper@4.1.2
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/react-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.0.6

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-id@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-timeout@4.0.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-unmount-effect@4.0.2
  - @hi-ui/popper@4.1.1
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/react-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.0.5

更新版本为 4.0.5
