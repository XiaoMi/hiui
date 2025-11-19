# @hi-ui/counter

## 5.0.0-canary.5

### Patch Changes

- 1f9c6e335: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 22db9cf70: style: fix ui bug (5.0)
- Updated dependencies [1f9c6e335]
  - @hi-ui/core@5.0.0-canary.6

## 5.0.0-canary.4

### Minor Changes

- 922686dcc: feat(global-context): 增加 size api 全局配置 (5.0)

### Patch Changes

- 86877b241: style: 修改样式问题 (5.0)
- Updated dependencies [922686dcc]
  - @hi-ui/core@5.0.0-canary.5
  - @hi-ui/icons@5.0.0-canary.5

## 5.0.0-canary.3

### Patch Changes

- Updated dependencies [9106dca82]
  - @hi-ui/core@5.0.0-canary.3
  - @hi-ui/icons@5.0.0-canary.3

## 5.0.0-canary.2

### Patch Changes

- chore: rebase master (5.0)
- Updated dependencies
  - @hi-ui/core@5.0.0-canary.2
  - @hi-ui/use-latest@5.0.0-canary.2
  - @hi-ui/use-toggle@5.0.0-canary.2
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.2
  - @hi-ui/icons@5.0.0-canary.2
  - @hi-ui/classname@5.0.0-canary.2
  - @hi-ui/env@5.0.0-canary.2
  - @hi-ui/type-assertion@5.0.0-canary.2

## 5.0.0-canary.1

### Patch Changes

- 4b09e728b: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [4b09e728b]
  - @hi-ui/core@5.0.0-canary.1
  - @hi-ui/use-latest@5.0.0-canary.1
  - @hi-ui/use-toggle@5.0.0-canary.1
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.1
  - @hi-ui/icons@5.0.0-canary.1
  - @hi-ui/classname@5.0.0-canary.1
  - @hi-ui/env@5.0.0-canary.1
  - @hi-ui/type-assertion@5.0.0-canary.1

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- Updated dependencies [225ebaa51]
- Updated dependencies [428716024]
  - @hi-ui/core@5.0.0-canary.0
  - @hi-ui/use-latest@5.0.0-canary.0
  - @hi-ui/use-toggle@5.0.0-canary.0
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.0
  - @hi-ui/icons@5.0.0-canary.0
  - @hi-ui/classname@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0
  - @hi-ui/type-assertion@5.0.0-canary.0

## 4.1.9

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/classname@4.0.5

## 4.1.8

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.7

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/classname@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.1.6

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.5

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

## 4.1.4

### Patch Changes

- [#2538](https://github.com/XiaoMi/hiui/pull/2538) [`ec2c785cf`](https://github.com/XiaoMi/hiui/commit/ec2c785cf4cc3b87b901f1ea0a436c0e3b035a52) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 支持 placeholder

- Updated dependencies [[`3aa4b9465`](https://github.com/XiaoMi/hiui/commit/3aa4b9465bf1d9e1710a427b8c5dbfec2e8af281)]:
  - @hi-ui/icons@4.0.11

## 4.1.3

### Patch Changes

- [#2506](https://github.com/XiaoMi/hiui/pull/2506) [`acf21fe33`](https://github.com/XiaoMi/hiui/commit/acf21fe33446840efd729f344727870cf895663f) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 formatter 模式下,光标聚焦时值被清空问题

## 4.1.2

### Patch Changes

- [#2498](https://github.com/XiaoMi/hiui/pull/2498) [`7f542e88e`](https://github.com/XiaoMi/hiui/commit/7f542e88ef0f519093d3c356359404c1c557774d) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 formatter 场景下值为 null 和 0 时的异常问题

## 4.1.1

### Patch Changes

- [#2489](https://github.com/XiaoMi/hiui/pull/2489) [`19e230fb8`](https://github.com/XiaoMi/hiui/commit/19e230fb85803a651b3a5574ee551fc9712f00be) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 增加了对 null 值的处理,当值设置为 null 时输入框显示为空

## 4.1.0

### Minor Changes

- [#2469](https://github.com/XiaoMi/hiui/pull/2469) [`f94904da3`](https://github.com/XiaoMi/hiui/commit/f94904da38243a2ac00cb4b25e3128708770d5ab) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 formatter 和 parser api
