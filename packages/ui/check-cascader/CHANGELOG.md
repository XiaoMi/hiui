# @hi-ui/check-cascader

## 5.0.0-rc.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- b9989e482: feat(picker): 增加 clearSearchOnClosed api 默认是 false (5.0)
- f1ab51725: <br>
  - feat(picker): 下拉选择类组件增加 xs 尺寸 (5.0)
  - feat(input): 输入框组件增加 xs 尺寸 (5.0)
- f8acad4e1: feat(check-cascader): 增加 checkbox 级联禁用功能和相关样式调整 (5.0)
- a4c48b19e: feat(check-cascader): add showOnlyShowChecked api (5.0)
- 6dca7795c: feat: 下拉选择组件增加 showIndicator 参数 & 修改 appearance 中的 unset 样式 (5.0)
- 77d969c2e: feat: 下拉选择类组件 appearance 参数增加 contained 类型 (5.0)
- 58ad82e94: feat: 输入框和选择器组件增加 borderless 形态 (5.0)
- 59cef699f: feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- 9b34d99bc: chore: 将代码中 v4 改为 v5 (5.0)
- cf89262c7: style(picker): 移除 picker 组件中的 \_\_text 样式定义 (5.0)
- 68dccedb1: fix(check-cascader): 修复非平铺展示搜索结果时显示出层级问题 (5.0)
- 9b34d99bc: fix: 修复 5.0 UI 问题 (5.0)
- 1dbc23ca5: feat(check-cascader): 增加全选功能
- cb9d8f6db: fix(tag-input): 修复 contained 模式下 displayRender 设置无效问题 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 95abba983: fix: 修改 UI 问题 (5.0)
- 8f23e9322: style: 表单类组件统一调整后缀颜色、placeholder 颜色 (5.0)
- eb17c4697: style: 修复 UI/样式问题 (5.0)
- de8d058dc: perf: 对下拉选择类组件的 customRender 的内容增加 memoization 以优化性能 (5.0)
- 5210770d9: feat(picker): add header api (5.0)
- 424700fc5: style(cascader&check-cascader): 调整下拉框样式，增加搜索框宽度设置 (5.0)
- 9ecf354ba: perf(cascader): 性能优化 (5.0)
- 4b2596538: <br>
  - style(cascader&check-cascader): 增加 white-space: nowrap; 样式以防止文本换行 (5.0)
  - style(cascader&check-cascader): 调整搜索框默认宽度为 100px (5.0)
  - feat(check-cascader): 增加 flattedSearchResult 属性，用于控制搜索结果的展现形式 (5.0)
  - fix(cascader): 修复当搜索结果为空时，下拉框没有显示空状态问题 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- e7b64347e: style(tag-input): 增加 flex-wrap 属性以优化标签换行展示 (5.0)
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
- Updated dependencies [cce71cdfa]
- Updated dependencies [b9989e482]
- Updated dependencies [7f204c892]
- Updated dependencies [122d1d859]
- Updated dependencies [f1ab51725]
- Updated dependencies [41552be0b]
- Updated dependencies [eb17c4697]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [cb9d8f6db]
- Updated dependencies [ec4c7faa2]
- Updated dependencies [29cae09ea]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [f8acad4e1]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [3a7186e4b]
- Updated dependencies [277c5033a]
- Updated dependencies [4e0ed3a31]
- Updated dependencies [95abba983]
- Updated dependencies [8f23e9322]
- Updated dependencies [4a31cea53]
- Updated dependencies [b27483796]
- Updated dependencies [eb17c4697]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [6dca7795c]
- Updated dependencies [900c6c2f0]
- Updated dependencies [7b956b1eb]
- Updated dependencies [5210770d9]
- Updated dependencies [4006b2c8c]
- Updated dependencies [c407744fe]
- Updated dependencies [d91a8bb0f]
- Updated dependencies [77d969c2e]
- Updated dependencies [9ecf354ba]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [e7b64347e]
- Updated dependencies [6fcda9bf2]
- Updated dependencies [0a4e90dbd]
- Updated dependencies [58ad82e94]
- Updated dependencies [95d930354]
- Updated dependencies [f2be367e9]
- Updated dependencies [1972fd16a]
- Updated dependencies [59cef699f]
- Updated dependencies [99801c2d1]
- Updated dependencies [cb7b794d0]
  - @hi-ui/picker@5.0.0-rc.0
  - @hi-ui/input@5.0.0-rc.0
  - @hi-ui/popper@5.0.0-rc.0
  - @hi-ui/tag-input@5.0.0-rc.0
  - @hi-ui/icons@5.0.0-rc.0
  - @hi-ui/core@5.0.0-rc.0
  - @hi-ui/use-check@5.0.0-rc.0
  - @hi-ui/use-data-source@5.0.0-rc.0
  - @hi-ui/use-latest@5.0.0-rc.0
  - @hi-ui/use-merge-refs@5.0.0-rc.0
  - @hi-ui/use-outside-click@5.0.0-rc.0
  - @hi-ui/use-search-mode@5.0.0-rc.0
  - @hi-ui/use-toggle@5.0.0-rc.0
  - @hi-ui/use-uncontrolled-state@5.0.0-rc.0
  - @hi-ui/checkbox@5.0.0-rc.0
  - @hi-ui/spinner@5.0.0-rc.0
  - @hi-ui/array-utils@5.0.0-rc.0
  - @hi-ui/classname@5.0.0-rc.0
  - @hi-ui/env@5.0.0-rc.0
  - @hi-ui/func-utils@5.0.0-rc.0
  - @hi-ui/times@5.0.0-rc.0
  - @hi-ui/tree-utils@5.0.0-rc.0
  - @hi-ui/type-assertion@5.0.0-rc.0
  - @hi-ui/use-merge-semantic@5.0.0-rc.0

## 4.5.2

### Patch Changes

- [#3336](https://github.com/XiaoMi/hiui/pull/3336) [`9356e8c`](https://github.com/XiaoMi/hiui/commit/9356e8ca43ae75f2886bd5225723ee9afad501a6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(use-search-mode): 优化初次搜索逻辑 (#3335)

- Updated dependencies [[`9356e8c`](https://github.com/XiaoMi/hiui/commit/9356e8ca43ae75f2886bd5225723ee9afad501a6)]:
  - @hi-ui/use-search-mode@4.2.3

## 4.5.1

### Patch Changes

- [#3326](https://github.com/XiaoMi/hiui/pull/3326) [`c11a132ad`](https://github.com/XiaoMi/hiui/commit/c11a132ad1bb076356752e9d0a6f40cc04c44880) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(check-cascader): 修复 onChange 第三个参数返回的值和类型不匹配问题 (#3325)

- Updated dependencies [[`8db6414b6`](https://github.com/XiaoMi/hiui/commit/8db6414b635ef561c7487a6f713c21a388d85739)]:
  - @hi-ui/use-search-mode@4.2.2

## 4.5.0

### Minor Changes

- [#3231](https://github.com/XiaoMi/hiui/pull/3231) [`bbba46153`](https://github.com/XiaoMi/hiui/commit/bbba4615313cd0618deff633bebc657e7f34ec94) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(cascader): onChange 回调中增加选中项对象参数返回 (#3230)

### Patch Changes

- Updated dependencies [[`dc1311a91`](https://github.com/XiaoMi/hiui/commit/dc1311a917518bc5debef755a9fcd4e33fb58790), [`b8c19048f`](https://github.com/XiaoMi/hiui/commit/b8c19048fe25147f344be4cd951740593aee8d12)]:
  - @hi-ui/use-search-mode@4.2.1
  - @hi-ui/tag-input@4.1.4

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

- Updated dependencies [[`a883d8e19`](https://github.com/XiaoMi/hiui/commit/a883d8e197446ef0e7cefcc5cc44d21ed1d0807f)]:
  - @hi-ui/input@4.4.0

## 4.3.2

### Patch Changes

- [#3096](https://github.com/XiaoMi/hiui/pull/3096) [`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(tag-input): 优化 wrap 模式下设置 displayRender 卡顿问题 (#3094)

- Updated dependencies [[`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00), [`bf2179191`](https://github.com/XiaoMi/hiui/commit/bf21791917f96c0b33b6a74539650bc56aba1d99)]:
  - @hi-ui/tag-input@4.1.3
  - @hi-ui/input@4.3.0

## 4.3.1

### Patch Changes

- [#2993](https://github.com/XiaoMi/hiui/pull/2993) [`102d01a6b`](https://github.com/XiaoMi/hiui/commit/102d01a6bbae65e452a861060f6ac13d44b6d06c) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 优化搜索算法

- [#2993](https://github.com/XiaoMi/hiui/pull/2993) [`102d01a6b`](https://github.com/XiaoMi/hiui/commit/102d01a6bbae65e452a861060f6ac13d44b6d06c) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 checkedMode="PARENT"模式下搜索后子节点无法选中问题

- [#3001](https://github.com/XiaoMi/hiui/pull/3001) [`872c903`](https://github.com/XiaoMi/hiui/commit/872c903af99f2a00c95de134d344a3cb53deab45) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 优化大数据下勾选根节点时卡顿

- [#2994](https://github.com/XiaoMi/hiui/pull/2994) [`4d6b26507`](https://github.com/XiaoMi/hiui/commit/4d6b26507479030686d5da65e1bec8b353b80bfa) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 keyword 设置后数据没有过滤的问题

- Updated dependencies [[`908d6cd96`](https://github.com/XiaoMi/hiui/commit/908d6cd9657551203917230d9a91de45e65354c2)]:
  - @hi-ui/tag-input@4.1.2

## 4.3.0

### Minor Changes

- [#2868](https://github.com/XiaoMi/hiui/pull/2868) [`95f2e843d`](https://github.com/XiaoMi/hiui/commit/95f2e843d154d5767c08d7a04a86d61804d71396) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 新增支持配置字段别名

- [#2824](https://github.com/XiaoMi/hiui/pull/2824) [`912c60b7b`](https://github.com/XiaoMi/hiui/commit/912c60b7b0f19a8386ec1de30fe6440e3963f288) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 支持前置后置内容

- [#2920](https://github.com/XiaoMi/hiui/pull/2920) [`ec38ee1a6`](https://github.com/XiaoMi/hiui/commit/ec38ee1a62f1716106ecd4617840295c1f22ed5b) Thanks [@yang-x20](https://github.com/yang-x20)! - feat: 新增自定义触发器

## 4.2.7

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/checkbox@4.0.10
  - @hi-ui/input@4.1.1
  - @hi-ui/picker@4.1.6
  - @hi-ui/popper@4.1.5
  - @hi-ui/spinner@4.0.9
  - @hi-ui/tag-input@4.1.1
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.2.6

### Patch Changes

- [#2752](https://github.com/XiaoMi/hiui/pull/2752) [`8cc7d032a`](https://github.com/XiaoMi/hiui/commit/8cc7d032aff1aa62099e71e2e1a3ca3a9a226e30) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 PARENT 和 CHILD 模式在搜索场景下 id 丢失问题

- Updated dependencies [[`a9b9c93fc`](https://github.com/XiaoMi/hiui/commit/a9b9c93fc3a3fea60d14052a5afeef9daf7efa1b), [`b3a13135c`](https://github.com/XiaoMi/hiui/commit/b3a13135c77e75291d5864ff7fcf63ddb2ff46b8), [`ca008e4ae`](https://github.com/XiaoMi/hiui/commit/ca008e4ae9753bc1f11efcdcbf09121d1ef07b56)]:
  - @hi-ui/input@4.1.0
  - @hi-ui/tag-input@4.1.0
  - @hi-ui/tree-utils@4.1.6

## 4.2.5

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-check@4.0.5
  - @hi-ui/use-data-source@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-merge-refs@4.0.4
  - @hi-ui/use-outside-click@4.0.4
  - @hi-ui/use-search-mode@4.1.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/checkbox@4.0.8
  - @hi-ui/input@4.0.13
  - @hi-ui/picker@4.1.4
  - @hi-ui/popper@4.1.3
  - @hi-ui/spinner@4.0.8
  - @hi-ui/tag-input@4.0.10
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/times@4.0.4
  - @hi-ui/tree-utils@4.1.4
  - @hi-ui/type-assertion@4.0.4

## 4.2.4

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-check@4.0.4
  - @hi-ui/use-data-source@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-merge-refs@4.0.3
  - @hi-ui/use-outside-click@4.0.3
  - @hi-ui/use-search-mode@4.1.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/checkbox@4.0.7
  - @hi-ui/input@4.0.12
  - @hi-ui/picker@4.1.3
  - @hi-ui/popper@4.1.2
  - @hi-ui/spinner@4.0.7
  - @hi-ui/tag-input@4.0.9
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/times@4.0.3
  - @hi-ui/tree-utils@4.1.3
  - @hi-ui/type-assertion@4.0.3

## 4.2.3

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-check@4.0.3
  - @hi-ui/use-data-source@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-merge-refs@4.0.2
  - @hi-ui/use-outside-click@4.0.2
  - @hi-ui/use-search-mode@4.1.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/checkbox@4.0.6
  - @hi-ui/input@4.0.11
  - @hi-ui/picker@4.1.2
  - @hi-ui/popper@4.1.1
  - @hi-ui/spinner@4.0.6
  - @hi-ui/tag-input@4.0.8
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/times@4.0.2
  - @hi-ui/tree-utils@4.1.2
  - @hi-ui/type-assertion@4.0.2

## 4.2.2

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

- Updated dependencies [[`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315)]:
  - @hi-ui/input@4.0.10
  - @hi-ui/tag-input@4.0.7

## 4.2.1

### Patch Changes

- [#2612](https://github.com/XiaoMi/hiui/pull/2612) [`832360b54`](https://github.com/XiaoMi/hiui/commit/832360b54231983148858b12707087c6b6fbac87) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修改下拉菜单高度为 32px

## 4.2.0

### Minor Changes

- [#2606](https://github.com/XiaoMi/hiui/pull/2606) [`9be456ec0`](https://github.com/XiaoMi/hiui/commit/9be456ec092031eab5ab6097f8276cde0bd4721d) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 renderExtraFooter 和 dropdownColumnRender api

- [#2602](https://github.com/XiaoMi/hiui/pull/2602) [`ad0d14abd`](https://github.com/XiaoMi/hiui/commit/ad0d14abdaf3ab2d5b79d649e7886ee90d1c941a) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api

## 4.1.0

### Minor Changes

- [#2531](https://github.com/XiaoMi/hiui/pull/2531) [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 tagInputProps API,支持显示内容高度自适应

### Patch Changes

- Updated dependencies [[`bd5940eba`](https://github.com/XiaoMi/hiui/commit/bd5940eba7d7a80aa676f37bb804ea27544864d2), [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912)]:
  - @hi-ui/picker@4.1.1
  - @hi-ui/popper@4.0.5
  - @hi-ui/tag-input@4.0.6
