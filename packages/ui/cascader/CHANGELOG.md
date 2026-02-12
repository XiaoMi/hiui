# @hi-ui/cascader

## 5.0.0-experimental.1

### Patch Changes

- 8f23e9322: style: 表单类组件统一调整后缀颜色、placeholder 颜色 (5.0)
- 发布 hiui experimental 版本
- 8561492d5: fix(cascader): 在平铺搜索模式下，当设置了 changeOnSelect 则搜索结果中展示父节点 (5.0)
- Updated dependencies [8f23e9322]
- Updated dependencies [b27483796]
- Updated dependencies [900c6c2f0]
- Updated dependencies
  - @hi-ui/input@5.0.0-experimental.1
  - @hi-ui/picker@5.0.0-experimental.1

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- b9989e482: feat(picker): 增加 clearSearchOnClosed api 默认是 false (5.0)
- f1ab51725: <br>
  - feat(picker): 下拉选择类组件增加 xs 尺寸 (5.0)
  - feat(input): 输入框组件增加 xs 尺寸 (5.0)
- 3e1d3608f: feat(cascader): add onItemClick api (5.0)
- 6dca7795c: feat: 下拉选择组件增加 showIndicator 参数 & 修改 appearance 中的 unset 样式 (5.0)
- 77d969c2e: feat: 下拉选择类组件 appearance 参数增加 contained 类型 (5.0)
- 58ad82e94: feat: 输入框和选择器组件增加 borderless 形态 (5.0)

### Patch Changes

- 6fb223e3a: style: fix ui bug (5.0)
- 1662753e0: style: fix ui bug (5.0)
- cf89262c7: style(picker): 移除 picker 组件中的 \_\_text 样式定义 (5.0)
- 9b34d99bc: fix: 修复 5.0 UI 问题 (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- eb718e940: fix: 修改组件问题 (5.0)
- 95abba983: fix: 修改 UI 问题 (5.0)
- f3bf08f27: fix(cascader): 平铺搜索结果时不再展示不可点击的父节点 (5.0)
- de8d058dc: perf: 对下拉选择类组件的 customRender 的内容增加 memoization 以优化性能 (5.0)
- 5210770d9: feat(picker): add header api (5.0)
- 424700fc5: style(cascader&check-cascader): 调整下拉框样式，增加搜索框宽度设置 (5.0)
- 4b2596538: <br>
  - style(cascader&check-cascader): 增加 white-space: nowrap; 样式以防止文本换行 (5.0)
  - style(cascader&check-cascader): 调整搜索框默认宽度为 100px (5.0)
  - feat(check-cascader): 增加 flattedSearchResult 属性，用于控制搜索结果的展现形式 (5.0)
  - fix(cascader): 修复当搜索结果为空时，下拉框没有显示空状态问题 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- 0a4e90dbd: <br>
  - style(tag-input): 间距调整 (5.0)
  - style(select): 选择类组件选项圆角改为 4px (5.0)
  - style(picker): 搜索框样式调整 (5.0)
- 79739ed82: <br>
  - fix(cascader): 处理当 value 为空时清空选项的选中态(5.0)
  - style(cascader&check-cascader): 调整选项容器最小宽度为 160px (5.0)
  - style(cascader&check-cascader): 优化下拉框宽度，让内容和搜索框默认宽度对齐 (5.0)
  - perf(cascader&check-cascader): 优化 customRender 函数，支持传递选中项和当前值 (5.0)
- 4a31cea53: style: 统一调整选择类组件 hover 时的背景色 (5.0)
- 99801c2d1: fix: 修复 UI 问题 (5.0)
- Updated dependencies [0b34e1c15]
- Updated dependencies [da2e63a14]
- Updated dependencies [1e226cd66]
- Updated dependencies [b9989e482]
- Updated dependencies [1662753e0]
- Updated dependencies [122d1d859]
- Updated dependencies [f1ab51725]
- Updated dependencies [41552be0b]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [f4fc0ef30]
- Updated dependencies [ec4c7faa2]
- Updated dependencies [29cae09ea]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [be5a59325]
- Updated dependencies [71fc15e5c]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [277c5033a]
- Updated dependencies [95abba983]
- Updated dependencies [4a31cea53]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [6dca7795c]
- Updated dependencies [7b956b1eb]
- Updated dependencies [5210770d9]
- Updated dependencies [e2d184e74]
- Updated dependencies [4006b2c8c]
- Updated dependencies [77d969c2e]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [7f3abee55]
- Updated dependencies [6fcda9bf2]
- Updated dependencies [0a4e90dbd]
- Updated dependencies [58ad82e94]
- Updated dependencies [a0f0c9d6b]
- Updated dependencies [f2be367e9]
- Updated dependencies [1972fd16a]
- Updated dependencies [99801c2d1]
- Updated dependencies [86910f5e2]
- Updated dependencies [cb7b794d0]
  - @hi-ui/picker@5.0.0-experimental.0
  - @hi-ui/input@5.0.0-experimental.0
  - @hi-ui/popper@5.0.0-experimental.0
  - @hi-ui/icons@5.0.0-experimental.0
  - @hi-ui/virtual-list@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/use-check-state@5.0.0-experimental.0
  - @hi-ui/use-data-source@5.0.0-experimental.0
  - @hi-ui/use-latest@5.0.0-experimental.0
  - @hi-ui/use-search-mode@5.0.0-experimental.0
  - @hi-ui/use-toggle@5.0.0-experimental.0
  - @hi-ui/use-uncontrolled-state@5.0.0-experimental.0
  - @hi-ui/highlighter@5.0.0-experimental.0
  - @hi-ui/spinner@5.0.0-experimental.0
  - @hi-ui/array-utils@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0
  - @hi-ui/func-utils@5.0.0-experimental.0
  - @hi-ui/tree-utils@5.0.0-experimental.0
  - @hi-ui/type-assertion@5.0.0-experimental.0

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
