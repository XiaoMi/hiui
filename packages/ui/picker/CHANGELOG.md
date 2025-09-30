# @hi-ui/picker

## 5.0.0-alpha.0

### Major Changes

- 1b05b44a4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 77ed66eac: <br>
  - feat(picker): 下拉选择类组件增加 xs 尺寸 (5.0)
  - feat(input): 输入框组件增加 xs 尺寸 (5.0)
- 6eac4b78b: feat: 输入框和选择器组件增加 borderless 形态 (5.0)
- 4fb586f6f: feat(picker&popper): 增加 styles 和 classNames 属性以支持自定义样式 & Picker 增加 gutterGap api (5.0)
- df25ec39b: feat(select): 增加 creatableInSearch、createTitle 参数，支持在搜索无结果时可创建选项 (5.0)

### Patch Changes

- abebb5eed: styles: 修改样式问题 (5.0)
- 5de7a848b: fix: 修复 5.0 UI 问题 (5.0)
- 0cd15438e: style: 修改样式问题 (5.0)
- 67960d871: style: 修改样式问题 (5.0)
- 8116f0304: fix: 修改 UI 问题 (5.0)
- 85bb84874: style: 下拉框间距改为 4px (5.0)
- 36bb992d3: style: 修改 UI 问题 (5.0)
- 61d132802: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 9f2ee08cf: <br>
  - style(tag-input): 间距调整 (5.0)
  - style(select): 选择类组件选项圆角改为 4px (5.0)
  - style(picker): 搜索框样式调整 (5.0)
- Updated dependencies [7bda04e64]
- Updated dependencies [77ed66eac]
- Updated dependencies [ddd2acc79]
- Updated dependencies [5de7a848b]
- Updated dependencies [1b05b44a4]
- Updated dependencies [0cd15438e]
- Updated dependencies [eb69f0baa]
- Updated dependencies [a01771e8d]
- Updated dependencies [de7f92b26]
- Updated dependencies [8116f0304]
- Updated dependencies [77ed66eac]
- Updated dependencies [632dbda3a]
- Updated dependencies [1b51c1bbe]
- Updated dependencies [61d132802]
- Updated dependencies [6ebf40f96]
- Updated dependencies [6eac4b78b]
- Updated dependencies [bcd3d08dd]
- Updated dependencies [4fb586f6f]
- Updated dependencies [c125e4c48]
- Updated dependencies [b7ad460d8]
  - @hi-ui/input@5.0.0-alpha.0
  - @hi-ui/core@5.0.0-alpha.0
  - @hi-ui/use-latest@5.0.0-alpha.0
  - @hi-ui/use-toggle@5.0.0-alpha.0
  - @hi-ui/use-uncontrolled-state@5.0.0-alpha.0
  - @hi-ui/icons@5.0.0-alpha.0
  - @hi-ui/loading@5.0.0-alpha.0
  - @hi-ui/popper@5.0.0-alpha.0
  - @hi-ui/classname@5.0.0-alpha.0
  - @hi-ui/dom-utils@5.0.0-alpha.0
  - @hi-ui/env@5.0.0-alpha.0
  - @hi-ui/type-assertion@5.0.0-alpha.0

## 4.1.8

### Patch Changes

- [#3196](https://github.com/XiaoMi/hiui/pull/3196) [`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0) Thanks [@KEH3](https://github.com/KEH3)! - fix(popper): ref 中增加更新位置方法解决上游组件弹窗被遮挡问题 (#3195)

- Updated dependencies [[`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0)]:
  - @hi-ui/popper@4.1.7

## 4.1.7

### Patch Changes

- [#3068](https://github.com/XiaoMi/hiui/pull/3068) [`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(picker): 对外暴露 resetSearch 方法

- Updated dependencies [[`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770)]:
  - @hi-ui/core@4.0.9
  - @hi-ui/loading@4.3.0

## 4.1.6

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/input@4.1.1
  - @hi-ui/loading@4.2.1
  - @hi-ui/popper@4.1.5
  - @hi-ui/classname@4.0.5

## 4.1.5

### Patch Changes

- [#2682](https://github.com/XiaoMi/hiui/pull/2682) [`41765fbed`](https://github.com/XiaoMi/hiui/commit/41765fbed0b3b9c8a574a0d7358b2d3f876162c5) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 下拉框盒模型设置为 content-box

- Updated dependencies [[`ba6e0265d`](https://github.com/XiaoMi/hiui/commit/ba6e0265da07964423d3a684dd068dcf50865dbc)]:
  - @hi-ui/popper@4.1.4

## 4.1.4

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/input@4.0.13
  - @hi-ui/loading@4.1.3
  - @hi-ui/popper@4.1.3
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.3

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/input@4.0.12
  - @hi-ui/loading@4.1.2
  - @hi-ui/popper@4.1.2
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/type-assertion@4.0.3

## 4.1.2

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/input@4.0.11
  - @hi-ui/loading@4.1.1
  - @hi-ui/popper@4.1.1
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.1

### Patch Changes

- [#2567](https://github.com/XiaoMi/hiui/pull/2567) [`bd5940eba`](https://github.com/XiaoMi/hiui/commit/bd5940eba7d7a80aa676f37bb804ea27544864d2) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 支持回车选中值

- Updated dependencies [[`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912)]:
  - @hi-ui/popper@4.0.5

## 4.1.0

### Minor Changes

- [#2542](https://github.com/XiaoMi/hiui/pull/2542) [`4b40f173a`](https://github.com/XiaoMi/hiui/commit/4b40f173a3c6125958392185c48756a07b1adb2f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 keyword API
