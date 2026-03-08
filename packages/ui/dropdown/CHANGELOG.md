# @hi-ui/dropdown

## 5.0.0-experimental.1

### Minor Changes

- 59cef699f: feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- eb17c4697: style: 修复 UI/样式问题 (5.0)
- Updated dependencies [7f204c892]
- Updated dependencies [eb17c4697]
- Updated dependencies [eb17c4697]
- Updated dependencies [c407744fe]
- Updated dependencies [59cef699f]
  - @hi-ui/icons@5.0.0-experimental.1
  - @hi-ui/core@5.0.0-experimental.1
  - @hi-ui/button@5.0.0-experimental.1
  - @hi-ui/popper@5.0.0-experimental.1
  - @hi-ui/use-merge-semantic@5.0.0-experimental.0

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)
- 277c5033a: style(dropdown): 下拉框带边框&圆角改为 6px&size 改为只有 md 尺寸 (5.0)

### Minor Changes

- d7b42d456: feat(dropdown): update onClick callback to include item data (5.0)

### Patch Changes

- 8c0ee78f0: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- f4fc0ef30: style: 修改样式问题 (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 95abba983: fix: 修改 UI 问题 (5.0)
- e2d184e74: style: 修改 UI 问题 (5.0)
- 0b9ea115d: style(dropdown): 增加下拉菜单的最大高度和垂直溢出处理 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- 3f24a97c3: chore(dropdown): 点击选项时阻止 click 事件冒泡 (5.0)
- Updated dependencies [1e226cd66]
- Updated dependencies [eea29eade]
- Updated dependencies [1662753e0]
- Updated dependencies [122d1d859]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [be5a59325]
- Updated dependencies [71fc15e5c]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [277c5033a]
- Updated dependencies [95abba983]
- Updated dependencies [8a92ec660]
- Updated dependencies [1429eced2]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [4006b2c8c]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [0a8cc07a7]
- Updated dependencies [7f3abee55]
- Updated dependencies [58ad82e94]
- Updated dependencies [a0f0c9d6b]
- Updated dependencies [f2be367e9]
- Updated dependencies [1972fd16a]
- Updated dependencies [99801c2d1]
- Updated dependencies [86910f5e2]
  - @hi-ui/popper@5.0.0-experimental.0
  - @hi-ui/button@5.0.0-experimental.0
  - @hi-ui/icons@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/use-latest@5.0.0-experimental.0
  - @hi-ui/use-timeout@5.0.0-experimental.0
  - @hi-ui/use-toggle@5.0.0-experimental.0
  - @hi-ui/use-unmount-effect@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/dom-utils@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0
  - @hi-ui/react-utils@5.0.0-experimental.0
  - @hi-ui/type-assertion@5.0.0-experimental.0

## 4.2.2

### Patch Changes

- [#3031](https://github.com/XiaoMi/hiui/pull/3031) [`c93f20d42`](https://github.com/XiaoMi/hiui/commit/c93f20d42096e38c10a99e1e333f3a9d9c00cdbe) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(dropdown): 修复父节点设置 disabled 后依然可以点击的问题 (#3030)

## 4.2.1

### Patch Changes

- [#2934](https://github.com/XiaoMi/hiui/pull/2934) [`cafc0a56b`](https://github.com/XiaoMi/hiui/commit/cafc0a56b2630ab145fceeea4838b7914bbd8da1) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - fix: 修复 overlay={{className: 'xx'}} 不生效问题

## 4.2.0

### Minor Changes

- [#2889](https://github.com/XiaoMi/hiui/pull/2889) [`dce209cd0`](https://github.com/XiaoMi/hiui/commit/dce209cd0ec0ac7ba405373923eb656d75842085) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 支持配置字段别名

## 4.1.5

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/button@4.0.10
  - @hi-ui/popper@4.1.5
  - @hi-ui/classname@4.0.5

## 4.1.4

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-timeout@4.0.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-unmount-effect@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/button@4.0.9
  - @hi-ui/popper@4.1.3
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/react-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.3

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-timeout@4.0.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-unmount-effect@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/button@4.0.8
  - @hi-ui/popper@4.1.2
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/react-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.1.2

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-timeout@4.0.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-unmount-effect@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/button@4.0.7
  - @hi-ui/popper@4.1.1
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/react-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.1

### Patch Changes

- [#2612](https://github.com/XiaoMi/hiui/pull/2612) [`832360b54`](https://github.com/XiaoMi/hiui/commit/832360b54231983148858b12707087c6b6fbac87) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修改下拉菜单高度为 32px

## 4.1.0

### Minor Changes

- [#2592](https://github.com/XiaoMi/hiui/pull/2592) [`4a903b331`](https://github.com/XiaoMi/hiui/commit/4a903b33146db140a2c8edd6951385ad9a6fcdde) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api

## 4.0.6

### Patch Changes

- [#2491](https://github.com/XiaoMi/hiui/pull/2491) [`80262b227`](https://github.com/XiaoMi/hiui/commit/80262b227cbab0799007fd931c93c2848204b48c) Thanks [@safga](https://github.com/safga)! - fix: 增加 dataItem 设置 disable 后样式
