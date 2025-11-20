# @hi-ui/cascader

## 4.5.2

### Patch Changes

- [#3415](https://github.com/XiaoMi/hiui/pull/3415) [`e7a09db`](https://github.com/XiaoMi/hiui/commit/e7a09db7f75022fee82a254a74a2ec17c6b03638) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(cascader): 修复在异步加载数据下,首次打开弹窗没有定位到已选节点位置的问题 (#3414)

## 4.5.1

### Patch Changes

- [#3407](https://github.com/XiaoMi/hiui/pull/3407) [`4a1444965`](https://github.com/XiaoMi/hiui/commit/4a1444965bdeeeb12333e43a05caa2e76d74eb47) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(cascader): 体验优化：每次打开菜单时自动定位到已选节点 (#3406)

- Updated dependencies [[`b2de718e9`](https://github.com/XiaoMi/hiui/commit/b2de718e9fd12dbe8fa1d762c6924696c19bc924)]:
  - @hi-ui/core@4.0.11

## 4.5.0

### Minor Changes

- [#3231](https://github.com/XiaoMi/hiui/pull/3231) [`bbba46153`](https://github.com/XiaoMi/hiui/commit/bbba4615313cd0618deff633bebc657e7f34ec94) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(cascader): onChange 回调中增加选中项对象参数返回 (#3230)

### Patch Changes

- Updated dependencies [[`dc1311a91`](https://github.com/XiaoMi/hiui/commit/dc1311a917518bc5debef755a9fcd4e33fb58790)]:
  - @hi-ui/use-search-mode@4.2.1

## 4.4.1

### Patch Changes

- [#3196](https://github.com/XiaoMi/hiui/pull/3196) [`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0) Thanks [@KEH3](https://github.com/KEH3)! - fix(popper): ref 中增加更新位置方法解决上游组件弹窗被遮挡问题 (#3195)

- Updated dependencies [[`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0)]:
  - @hi-ui/picker@4.1.8
  - @hi-ui/popper@4.1.7

## 4.4.0

### Minor Changes

- [#3172](https://github.com/XiaoMi/hiui/pull/3172) [`a883d8e19`](https://github.com/XiaoMi/hiui/commit/a883d8e197446ef0e7cefcc5cc44d21ed1d0807f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(mock-input): 增加 onClear 参数 (#3171)

### Patch Changes

- Updated dependencies [[`7bf0630`](https://github.com/XiaoMi/hiui/commit/7bf063053a73923af41c33370c31371325206276), [`a883d8e19`](https://github.com/XiaoMi/hiui/commit/a883d8e197446ef0e7cefcc5cc44d21ed1d0807f)]:
  - @hi-ui/highlighter@4.1.2
  - @hi-ui/input@4.4.0

## 4.3.2

### Patch Changes

- [#3137](https://github.com/XiaoMi/hiui/pull/3137) [`5d2e1424a`](https://github.com/XiaoMi/hiui/commit/5d2e1424ac6f67c4dbdf6d99c6715bd380419288) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(cascader): useSelect 增加 value 参数以支持选中项的初始化状态 (#3135)

## 4.3.1

### Patch Changes

- [#2994](https://github.com/XiaoMi/hiui/pull/2994) [`4d6b26507`](https://github.com/XiaoMi/hiui/commit/4d6b26507479030686d5da65e1bec8b353b80bfa) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 keyword 设置后数据没有过滤的问题

## 4.3.0

### Minor Changes

- [#2921](https://github.com/XiaoMi/hiui/pull/2921) [`c6d9225c5`](https://github.com/XiaoMi/hiui/commit/c6d9225c5f09484344159e31af93f7ae147566bb) Thanks [@yang-x20](https://github.com/yang-x20)! - feat: 新增自定义触发器

- [#2824](https://github.com/XiaoMi/hiui/pull/2824) [`912c60b7b`](https://github.com/XiaoMi/hiui/commit/912c60b7b0f19a8386ec1de30fe6440e3963f288) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 支持前置后置内容

## 4.2.0

### Minor Changes

- [#2805](https://github.com/XiaoMi/hiui/pull/2805) [`9146d5ef2`](https://github.com/XiaoMi/hiui/commit/9146d5ef207201a6ff8f42fb3ca66e7929335c1a) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add closeOnSelect api

## 4.1.6

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/highlighter@4.0.9
  - @hi-ui/input@4.1.1
  - @hi-ui/picker@4.1.6
  - @hi-ui/popper@4.1.5
  - @hi-ui/spinner@4.0.9
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.1.5

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-check-state@4.0.4
  - @hi-ui/use-data-source@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-search-mode@4.1.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/highlighter@4.0.8
  - @hi-ui/input@4.0.13
  - @hi-ui/picker@4.1.4
  - @hi-ui/popper@4.1.3
  - @hi-ui/spinner@4.0.8
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/tree-utils@4.1.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.4

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-check-state@4.0.3
  - @hi-ui/use-data-source@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-search-mode@4.1.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/highlighter@4.0.7
  - @hi-ui/input@4.0.12
  - @hi-ui/picker@4.1.3
  - @hi-ui/popper@4.1.2
  - @hi-ui/spinner@4.0.7
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/tree-utils@4.1.3
  - @hi-ui/type-assertion@4.0.3

## 4.1.3

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-check-state@4.0.2
  - @hi-ui/use-data-source@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-search-mode@4.1.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/highlighter@4.0.6
  - @hi-ui/input@4.0.11
  - @hi-ui/picker@4.1.2
  - @hi-ui/popper@4.1.1
  - @hi-ui/spinner@4.0.6
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/tree-utils@4.1.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.2

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

- Updated dependencies [[`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315)]:
  - @hi-ui/input@4.0.10

## 4.1.1

### Patch Changes

- [#2612](https://github.com/XiaoMi/hiui/pull/2612) [`832360b54`](https://github.com/XiaoMi/hiui/commit/832360b54231983148858b12707087c6b6fbac87) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修改下拉菜单高度为 32px

## 4.1.0

### Minor Changes

- [#2601](https://github.com/XiaoMi/hiui/pull/2601) [`80cc037a1`](https://github.com/XiaoMi/hiui/commit/80cc037a15381a5f3466a7ea79565e10f05ca129) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api

- [#2605](https://github.com/XiaoMi/hiui/pull/2605) [`90ea1ea81`](https://github.com/XiaoMi/hiui/commit/90ea1ea810573f730ebbc4c48272dd6181099933) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 renderExtraFooter 和 dropdownColumnRender api
