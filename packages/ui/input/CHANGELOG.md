# @hi-ui/input

## 5.0.0-canary.3

### Patch Changes

- b98def710: chore: 优化 Input 和 TagInput label 显示逻辑 (5.0)

## 5.0.0-canary.2

### Minor Changes

- 6c4bf35af: feat: 下拉选择类组件 appearance 参数增加 contained 类型 (5.0)

## 5.0.0-canary.1

### Patch Changes

- 3903bd4ff: fix: 修复 5.0 UI 问题 (5.0)

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 428716024: <br>
  - feat(picker): 下拉选择类组件增加 xs 尺寸 (5.0)
  - feat(input): 输入框组件增加 xs 尺寸 (5.0)

### Patch Changes

- Updated dependencies [225ebaa51]
- Updated dependencies [428716024]
  - @hi-ui/core@5.0.0-canary.0
  - @hi-ui/use-latest@5.0.0-canary.0
  - @hi-ui/use-merge-refs@5.0.0-canary.0
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.0
  - @hi-ui/icons@5.0.0-canary.0
  - @hi-ui/classname@5.0.0-canary.0
  - @hi-ui/dom-utils@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0
  - @hi-ui/func-utils@5.0.0-canary.0
  - @hi-ui/type-assertion@5.0.0-canary.0

## 4.3.0

### Minor Changes

- [#3092](https://github.com/XiaoMi/hiui/pull/3092) [`bf2179191`](https://github.com/XiaoMi/hiui/commit/bf21791917f96c0b33b6a74539650bc56aba1d99) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(input): add awaitCompositionEnd api (#3090)

## 4.2.1

### Patch Changes

- [#3024](https://github.com/XiaoMi/hiui/pull/3024) [`4baa3bda2`](https://github.com/XiaoMi/hiui/commit/4baa3bda267233c45d15717bc8765587901447b3) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(input): 修复 type="X" 时最后一位无法输入 X 的问题 (#3023)
  chore(input): type 类型中增加 number 类型

## 4.2.0

### Minor Changes

- [#2954](https://github.com/XiaoMi/hiui/pull/2954) [`8e4eedb`](https://github.com/XiaoMi/hiui/commit/8e4eedb1bb08ef07258adec3ebdb303fbb100311) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: MockInput 没有匹配到值时默认展示 value 值

## 4.1.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/classname@4.0.5

## 4.1.0

### Minor Changes

- [#2745](https://github.com/XiaoMi/hiui/pull/2745) [`a9b9c93fc`](https://github.com/XiaoMi/hiui/commit/a9b9c93fc3a3fea60d14052a5afeef9daf7efa1b) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add prefix api

## 4.0.13

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-merge-refs@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.0.12

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-merge-refs@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.0.11

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-merge-refs@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.0.10

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

## 4.0.9

### Patch Changes

- [#2484](https://github.com/XiaoMi/hiui/pull/2484) [`6980d058f`](https://github.com/XiaoMi/hiui/commit/6980d058f165b309695d10248d7511bd05bee457) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 样式优化

## 4.0.8

### Patch Changes

- [#2448](https://github.com/XiaoMi/hiui/pull/2448) [`573a26adf`](https://github.com/XiaoMi/hiui/commit/573a26adf945654f4301e38044131616982c7b2e) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: value 设置 null 时报错

## 4.0.7

### Patch Changes

- [#2440](https://github.com/XiaoMi/hiui/pull/2440) [`45f1ddd4d`](https://github.com/XiaoMi/hiui/commit/45f1ddd4de49c84f09b0074bcacdcb587a5d1535) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 输入框值格式化时光标跑到最后
