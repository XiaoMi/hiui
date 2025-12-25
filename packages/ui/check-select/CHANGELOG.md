# @hi-ui/check-select

## 4.6.5

### Patch Changes

- [#3450](https://github.com/XiaoMi/hiui/pull/3450) [`0cea4d7`](https://github.com/XiaoMi/hiui/commit/0cea4d75c771b5db56f520821b53864051c33594) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(tag-input): ensure at least one tag is displayed when container width is insufficient (#3449)

- Updated dependencies [[`0cea4d7`](https://github.com/XiaoMi/hiui/commit/0cea4d75c771b5db56f520821b53864051c33594)]:
  - @hi-ui/tag-input@4.1.5

## 4.6.4

### Patch Changes

- [#3196](https://github.com/XiaoMi/hiui/pull/3196) [`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0) Thanks [@KEH3](https://github.com/KEH3)! - fix(popper): ref 中增加更新位置方法解决上游组件弹窗被遮挡问题 (#3195)

- [#3208](https://github.com/XiaoMi/hiui/pull/3208) [`36086f4c8`](https://github.com/XiaoMi/hiui/commit/36086f4c8ab11728dd4d0bb34b4d9301c6068452) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(select): 修复多级分组下分组标题左间距不对问题 (#3207)

- Updated dependencies [[`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0)]:
  - @hi-ui/picker@4.1.8
  - @hi-ui/popper@4.1.7

## 4.6.3

### Patch Changes

- [#3126](https://github.com/XiaoMi/hiui/pull/3126) [`6173495f3`](https://github.com/XiaoMi/hiui/commit/6173495f3a09ed8fce6ebdf1a99a50ffdc394952) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(check-select): 增强 mergedCheckedItems 逻辑以支持自定义渲染函数，并修复 getAllCheckedStatus 函数对非数组值的处理 (#3124)

- Updated dependencies [[`b97a8f8`](https://github.com/XiaoMi/hiui/commit/b97a8f81664b023237791769e0fd62b90956fc90)]:
  - @hi-ui/popper@4.1.6

## 4.6.2

### Patch Changes

- [#3114](https://github.com/XiaoMi/hiui/pull/3114) [`8ddcda3`](https://github.com/XiaoMi/hiui/commit/8ddcda36864ef1ad6679a413f660cfcc7f55e8a3) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(check-select): 修复 customRender 回调中的 value 值无法显示初始值问题 (#3113)

## 4.6.1

### Patch Changes

- [#3096](https://github.com/XiaoMi/hiui/pull/3096) [`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(tag-input): 优化 wrap 模式下设置 displayRender 卡顿问题 (#3094)

- Updated dependencies [[`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00), [`414c96a86`](https://github.com/XiaoMi/hiui/commit/414c96a86c6311c5b103733749092108cad03760), [`13b169670`](https://github.com/XiaoMi/hiui/commit/13b16967026f8389cc66315d376ef77029f4ba2b), [`bf2179191`](https://github.com/XiaoMi/hiui/commit/bf21791917f96c0b33b6a74539650bc56aba1d99)]:
  - @hi-ui/tag-input@4.1.3
  - @hi-ui/highlighter@4.1.0
  - @hi-ui/input@4.3.0

## 4.6.0

### Minor Changes

- [#3015](https://github.com/XiaoMi/hiui/pull/3015) [`b2d784b23`](https://github.com/XiaoMi/hiui/commit/b2d784b23682e70cbc7b09e3396f51fda02e2223) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(select): Add searchOnInit api (#3004)
  feat(check-select): Add searchOnInit api (#3004)

### Patch Changes

- Updated dependencies [[`b2d784b23`](https://github.com/XiaoMi/hiui/commit/b2d784b23682e70cbc7b09e3396f51fda02e2223)]:
  - @hi-ui/use-search-mode@4.2.0

## 4.5.0

### Minor Changes

- [#2970](https://github.com/XiaoMi/hiui/pull/2970) [`657d180`](https://github.com/XiaoMi/hiui/commit/657d1802ac424e2498f9036047cc74a34659d5d6) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 支持按 Enter 键是否选中当前项功能，checkedOnEntered 默认为 true

## 4.4.4

### Patch Changes

- [#2828](https://github.com/XiaoMi/hiui/pull/2828) [`b8679ce3e`](https://github.com/XiaoMi/hiui/commit/b8679ce3e7fab435fd126901e6e8b23268bcf712) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - fix: 修复异步搜索中，搜索结果中关键字没有高亮显示问题

- Updated dependencies [[`3afbf239e`](https://github.com/XiaoMi/hiui/commit/3afbf239e816ede48d6a85cbd99b6b099b8c8eb3)]:
  - @hi-ui/env@4.0.7

## 4.4.3

### Patch Changes

- [#2795](https://github.com/XiaoMi/hiui/pull/2795) [`234687ee0`](https://github.com/XiaoMi/hiui/commit/234687ee0ea4de16faaf771ea6a599bc43971249) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - fix: 修复 onClear 设置后没触发问题

## 4.4.2

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/checkbox@4.0.10
  - @hi-ui/highlighter@4.0.9
  - @hi-ui/input@4.1.1
  - @hi-ui/picker@4.1.6
  - @hi-ui/popper@4.1.5
  - @hi-ui/tag-input@4.1.1
  - @hi-ui/virtual-list@4.0.8
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.4.1

### Patch Changes

- [#2771](https://github.com/XiaoMi/hiui/pull/2771) [`eee27bd5f`](https://github.com/XiaoMi/hiui/commit/eee27bd5f81a89169c1c2dc993b9100731cafcbd) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 keyword 受控时搜索结果有误的问题

## 4.4.0

### Minor Changes

- [#2746](https://github.com/XiaoMi/hiui/pull/2746) [`b3a13135c`](https://github.com/XiaoMi/hiui/commit/b3a13135c77e75291d5864ff7fcf63ddb2ff46b8) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add prefix api

### Patch Changes

- Updated dependencies [[`a9b9c93fc`](https://github.com/XiaoMi/hiui/commit/a9b9c93fc3a3fea60d14052a5afeef9daf7efa1b), [`b3a13135c`](https://github.com/XiaoMi/hiui/commit/b3a13135c77e75291d5864ff7fcf63ddb2ff46b8), [`ca008e4ae`](https://github.com/XiaoMi/hiui/commit/ca008e4ae9753bc1f11efcdcbf09121d1ef07b56)]:
  - @hi-ui/input@4.1.0
  - @hi-ui/tag-input@4.1.0
  - @hi-ui/tree-utils@4.1.6

## 4.3.6

### Patch Changes

- [#2682](https://github.com/XiaoMi/hiui/pull/2682) [`41765fbed`](https://github.com/XiaoMi/hiui/commit/41765fbed0b3b9c8a574a0d7358b2d3f876162c5) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 下拉框盒模型设置为 content-box

- Updated dependencies [[`ba6e0265d`](https://github.com/XiaoMi/hiui/commit/ba6e0265da07964423d3a684dd068dcf50865dbc), [`41765fbed`](https://github.com/XiaoMi/hiui/commit/41765fbed0b3b9c8a574a0d7358b2d3f876162c5)]:
  - @hi-ui/popper@4.1.4
  - @hi-ui/picker@4.1.5

## 4.3.5

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-check@4.0.5
  - @hi-ui/use-children@4.0.4
  - @hi-ui/use-data-source@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-search-mode@4.1.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/checkbox@4.0.8
  - @hi-ui/highlighter@4.0.8
  - @hi-ui/input@4.0.13
  - @hi-ui/picker@4.1.4
  - @hi-ui/popper@4.1.3
  - @hi-ui/tag-input@4.0.10
  - @hi-ui/virtual-list@4.0.7
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/times@4.0.4
  - @hi-ui/tree-utils@4.1.4
  - @hi-ui/type-assertion@4.0.4

## 4.3.4

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-check@4.0.4
  - @hi-ui/use-children@4.0.3
  - @hi-ui/use-data-source@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-search-mode@4.1.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/checkbox@4.0.7
  - @hi-ui/highlighter@4.0.7
  - @hi-ui/input@4.0.12
  - @hi-ui/picker@4.1.3
  - @hi-ui/popper@4.1.2
  - @hi-ui/tag-input@4.0.9
  - @hi-ui/virtual-list@4.0.6
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/times@4.0.3
  - @hi-ui/tree-utils@4.1.3
  - @hi-ui/type-assertion@4.0.3

## 4.3.3

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-check@4.0.3
  - @hi-ui/use-children@4.0.2
  - @hi-ui/use-data-source@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-search-mode@4.1.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/checkbox@4.0.6
  - @hi-ui/highlighter@4.0.6
  - @hi-ui/input@4.0.11
  - @hi-ui/picker@4.1.2
  - @hi-ui/popper@4.1.1
  - @hi-ui/tag-input@4.0.8
  - @hi-ui/virtual-list@4.0.5
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/times@4.0.2
  - @hi-ui/tree-utils@4.1.2
  - @hi-ui/type-assertion@4.0.2

## 4.3.2

### Patch Changes

- [#2633](https://github.com/XiaoMi/hiui/pull/2633) [`4f7c8c906`](https://github.com/XiaoMi/hiui/commit/4f7c8c9063d9b72068a2db5fa614eed130aafd0f) Thanks [@aqiusen](https://github.com/aqiusen)! - CheckSelect dataSource 下搜索框增加防抖操作

- Updated dependencies [[`45cbe7bd9`](https://github.com/XiaoMi/hiui/commit/45cbe7bd9ddeaadfc8ff520a2448a0dade6be51c)]:
  - @hi-ui/use-search-mode@4.1.1

## 4.3.1

### Patch Changes

- [#2612](https://github.com/XiaoMi/hiui/pull/2612) [`832360b54`](https://github.com/XiaoMi/hiui/commit/832360b54231983148858b12707087c6b6fbac87) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修改下拉菜单高度为 32px

## 4.3.0

### Minor Changes

- [#2600](https://github.com/XiaoMi/hiui/pull/2600) [`03ecca72b`](https://github.com/XiaoMi/hiui/commit/03ecca72bac72a1b042e96599b68c3317f0c3236) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api

## 4.2.0

### Minor Changes

- [#2531](https://github.com/XiaoMi/hiui/pull/2531) [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 tagInputProps API,支持显示内容高度自适应

### Patch Changes

- [#2567](https://github.com/XiaoMi/hiui/pull/2567) [`bd5940eba`](https://github.com/XiaoMi/hiui/commit/bd5940eba7d7a80aa676f37bb804ea27544864d2) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 支持回车选中值

- Updated dependencies [[`bd5940eba`](https://github.com/XiaoMi/hiui/commit/bd5940eba7d7a80aa676f37bb804ea27544864d2), [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912)]:
  - @hi-ui/picker@4.1.1
  - @hi-ui/popper@4.0.5
  - @hi-ui/tag-input@4.0.6

## 4.1.3

### Patch Changes

- [#2482](https://github.com/XiaoMi/hiui/pull/2482) [`3301a290f`](https://github.com/XiaoMi/hiui/commit/3301a290fa9bd8b8717e24ef69ed832aa392b11e) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 数据改变后显示一次滚动条

- Updated dependencies [[`6980d058f`](https://github.com/XiaoMi/hiui/commit/6980d058f165b309695d10248d7511bd05bee457)]:
  - @hi-ui/input@4.0.9

## 4.1.2

### Patch Changes

- [#2411](https://github.com/XiaoMi/hiui/pull/2411) [`f7d1257ad`](https://github.com/XiaoMi/hiui/commit/f7d1257ad2006fd40cabb2d16f1fde77677f3117) Thanks [@zyprepare](https://github.com/zyprepare)! - 体验优化: 大数据列表中,打开下拉列表时有一次滚动条提示

- Updated dependencies [[`f7d1257ad`](https://github.com/XiaoMi/hiui/commit/f7d1257ad2006fd40cabb2d16f1fde77677f3117)]:
  - @hi-ui/icons@4.0.6

## 4.1.1

### Patch Changes

- [#2334](https://github.com/XiaoMi/hiui/pull/2334) [`c9e6f4ad6`](https://github.com/XiaoMi/hiui/commit/c9e6f4ad6c1050b86bee5db681214d39830305c7) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复问题:设置 loading 无效果

## 4.1.0

### Minor Changes

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 增加 customRender api
