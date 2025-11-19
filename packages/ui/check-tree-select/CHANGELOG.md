# @hi-ui/check-tree-select

## 4.7.6

### Patch Changes

- [#3409](https://github.com/XiaoMi/hiui/pull/3409) [`467701f`](https://github.com/XiaoMi/hiui/commit/467701f925d0bb0709e3fd17ca6e178fa1ca01c6) Thanks [@zyprepare](https://github.com/zyprepare)! - refactor(check-tree-select): 搜索和全选勾选逻辑调整，过滤后的结果勾选态还是按照全量数据进行计算，全选态根据过滤后的数据进行计算 (#3398)

- Updated dependencies [[`b2de718e9`](https://github.com/XiaoMi/hiui/commit/b2de718e9fd12dbe8fa1d762c6924696c19bc924)]:
  - @hi-ui/core@4.0.11

## 4.7.5

### Patch Changes

- [#3364](https://github.com/XiaoMi/hiui/pull/3364) [`06d6dcf`](https://github.com/XiaoMi/hiui/commit/06d6dcff5282bb702791ab87e0690edc3828da5c) Thanks [@fcppddl](https://github.com/fcppddl)! - feat(check-tree-select): 支持自定义下拉菜单底部渲染 (#3363)

## 4.7.4

### Patch Changes

- [#3336](https://github.com/XiaoMi/hiui/pull/3336) [`9356e8c`](https://github.com/XiaoMi/hiui/commit/9356e8ca43ae75f2886bd5225723ee9afad501a6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(use-search-mode): 优化初次搜索逻辑 (#3335)

- Updated dependencies [[`9356e8c`](https://github.com/XiaoMi/hiui/commit/9356e8ca43ae75f2886bd5225723ee9afad501a6)]:
  - @hi-ui/use-search-mode@4.2.3

## 4.7.3

### Patch Changes

- [#3324](https://github.com/XiaoMi/hiui/pull/3324) [`8db6414b6`](https://github.com/XiaoMi/hiui/commit/8db6414b635ef561c7487a6f713c21a388d85739) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(check-tree-select): 更新全选逻辑，使用 dataMemo 替代 flattedData，确保状态正确 (#3323)

- Updated dependencies [[`8db6414b6`](https://github.com/XiaoMi/hiui/commit/8db6414b635ef561c7487a6f713c21a388d85739)]:
  - @hi-ui/use-search-mode@4.2.2

## 4.7.2

### Patch Changes

- [#3249](https://github.com/XiaoMi/hiui/pull/3249) [`dc1311a91`](https://github.com/XiaoMi/hiui/commit/dc1311a917518bc5debef755a9fcd4e33fb58790) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(check-tree-select): 完善 dataSource 功能，支持搜索结果高亮和展开 (#3247)

- Updated dependencies [[`dc1311a91`](https://github.com/XiaoMi/hiui/commit/dc1311a917518bc5debef755a9fcd4e33fb58790), [`b8c19048f`](https://github.com/XiaoMi/hiui/commit/b8c19048fe25147f344be4cd951740593aee8d12)]:
  - @hi-ui/use-search-mode@4.2.1
  - @hi-ui/tag-input@4.1.4

## 4.7.1

### Patch Changes

- [#3196](https://github.com/XiaoMi/hiui/pull/3196) [`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0) Thanks [@KEH3](https://github.com/KEH3)! - fix(popper): ref 中增加更新位置方法解决上游组件弹窗被遮挡问题 (#3195)

- Updated dependencies [[`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0)]:
  - @hi-ui/picker@4.1.8
  - @hi-ui/popper@4.1.7

## 4.7.0

### Minor Changes

- [#3172](https://github.com/XiaoMi/hiui/pull/3172) [`a883d8e19`](https://github.com/XiaoMi/hiui/commit/a883d8e197446ef0e7cefcc5cc44d21ed1d0807f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(mock-input): 增加 onClear 参数 (#3171)

### Patch Changes

- Updated dependencies [[`7bf0630`](https://github.com/XiaoMi/hiui/commit/7bf063053a73923af41c33370c31371325206276)]:
  - @hi-ui/highlighter@4.1.2

## 4.6.2

### Patch Changes

- [#3096](https://github.com/XiaoMi/hiui/pull/3096) [`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(tag-input): 优化 wrap 模式下设置 displayRender 卡顿问题 (#3094)

- Updated dependencies [[`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00), [`414c96a86`](https://github.com/XiaoMi/hiui/commit/414c96a86c6311c5b103733749092108cad03760), [`13b169670`](https://github.com/XiaoMi/hiui/commit/13b16967026f8389cc66315d376ef77029f4ba2b)]:
  - @hi-ui/tag-input@4.1.3
  - @hi-ui/highlighter@4.1.0

## 4.6.1

### Patch Changes

- [#3000](https://github.com/XiaoMi/hiui/pull/3000) [`908d6cd96`](https://github.com/XiaoMi/hiui/commit/908d6cd9657551203917230d9a91de45e65354c2) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 优化大数据下勾选卡顿

- [#2994](https://github.com/XiaoMi/hiui/pull/2994) [`4d6b26507`](https://github.com/XiaoMi/hiui/commit/4d6b26507479030686d5da65e1bec8b353b80bfa) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 keyword 设置后数据没有过滤的问题

- Updated dependencies [[`908d6cd96`](https://github.com/XiaoMi/hiui/commit/908d6cd9657551203917230d9a91de45e65354c2)]:
  - @hi-ui/tag-input@4.1.2
  - @hi-ui/tree@4.6.1

## 4.6.0

### Minor Changes

- [#2952](https://github.com/XiaoMi/hiui/pull/2952) [`f7137e3db`](https://github.com/XiaoMi/hiui/commit/f7137e3dbff8a3a2735f9e7d8a09fc942c8a8a86) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 新增支持过滤已选择项

### Patch Changes

- Updated dependencies [[`bc306526c`](https://github.com/XiaoMi/hiui/commit/bc306526c948cb2b1ecd73b63e903d941c78dd9a), [`7bdd549d0`](https://github.com/XiaoMi/hiui/commit/7bdd549d0fcb6a6b903742333e352e184723aa3b)]:
  - @hi-ui/tree@4.6.0

## 4.5.0

### Minor Changes

- [#2878](https://github.com/XiaoMi/hiui/pull/2878) [`179fd7fef`](https://github.com/XiaoMi/hiui/commit/179fd7fef9d906ecec2c5f02de01b7fa16721c79) Thanks [@yang-x20](https://github.com/yang-x20)! - feat: 新增前置后置内容扩展功能

## 4.4.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/checkbox@4.0.10
  - @hi-ui/highlighter@4.0.9
  - @hi-ui/picker@4.1.6
  - @hi-ui/popper@4.1.5
  - @hi-ui/tag-input@4.1.1
  - @hi-ui/tree@4.5.10
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.4.0

### Minor Changes

- [#2737](https://github.com/XiaoMi/hiui/pull/2737) [`78bc495f2`](https://github.com/XiaoMi/hiui/commit/78bc495f233c205a5daddd987e8006e6ce21f7d5) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add customRender api

### Patch Changes

- Updated dependencies [[`b3a13135c`](https://github.com/XiaoMi/hiui/commit/b3a13135c77e75291d5864ff7fcf63ddb2ff46b8), [`ca008e4ae`](https://github.com/XiaoMi/hiui/commit/ca008e4ae9753bc1f11efcdcbf09121d1ef07b56)]:
  - @hi-ui/tag-input@4.1.0
  - @hi-ui/tree-utils@4.1.6

## 4.3.4

### Patch Changes

- [#2682](https://github.com/XiaoMi/hiui/pull/2682) [`41765fbed`](https://github.com/XiaoMi/hiui/commit/41765fbed0b3b9c8a574a0d7358b2d3f876162c5) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 下拉框盒模型设置为 content-box

- Updated dependencies [[`ba6e0265d`](https://github.com/XiaoMi/hiui/commit/ba6e0265da07964423d3a684dd068dcf50865dbc), [`41765fbed`](https://github.com/XiaoMi/hiui/commit/41765fbed0b3b9c8a574a0d7358b2d3f876162c5)]:
  - @hi-ui/popper@4.1.4
  - @hi-ui/picker@4.1.5

## 4.3.3

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-check@4.0.5
  - @hi-ui/use-data-source@4.0.4
  - @hi-ui/use-search-mode@4.1.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/checkbox@4.0.8
  - @hi-ui/highlighter@4.0.8
  - @hi-ui/picker@4.1.4
  - @hi-ui/popper@4.1.3
  - @hi-ui/tag-input@4.0.10
  - @hi-ui/tree@4.5.8
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/tree-utils@4.1.4
  - @hi-ui/type-assertion@4.0.4

## 4.3.2

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-check@4.0.4
  - @hi-ui/use-data-source@4.0.3
  - @hi-ui/use-search-mode@4.1.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/checkbox@4.0.7
  - @hi-ui/highlighter@4.0.7
  - @hi-ui/picker@4.1.3
  - @hi-ui/popper@4.1.2
  - @hi-ui/tag-input@4.0.9
  - @hi-ui/tree@4.5.7
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/tree-utils@4.1.3
  - @hi-ui/type-assertion@4.0.3

## 4.3.1

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-check@4.0.3
  - @hi-ui/use-data-source@4.0.2
  - @hi-ui/use-search-mode@4.1.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/checkbox@4.0.6
  - @hi-ui/highlighter@4.0.6
  - @hi-ui/picker@4.1.2
  - @hi-ui/popper@4.1.1
  - @hi-ui/tag-input@4.0.8
  - @hi-ui/tree@4.5.6
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/tree-utils@4.1.2
  - @hi-ui/type-assertion@4.0.2

## 4.3.0

### Minor Changes

- [#2604](https://github.com/XiaoMi/hiui/pull/2604) [`2dd977a5c`](https://github.com/XiaoMi/hiui/commit/2dd977a5c0db411e07aa5c4ea50ef04f37ebf8d2) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api

### Patch Changes

- Updated dependencies [[`534bfd298`](https://github.com/XiaoMi/hiui/commit/534bfd29852003af2209c3a64e5f1b2b1d37c19e)]:
  - @hi-ui/tree@4.5.2

## 4.2.0

### Minor Changes

- [#2531](https://github.com/XiaoMi/hiui/pull/2531) [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 tagInputProps API,支持显示内容高度自适应

### Patch Changes

- Updated dependencies [[`bd5940eba`](https://github.com/XiaoMi/hiui/commit/bd5940eba7d7a80aa676f37bb804ea27544864d2), [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912)]:
  - @hi-ui/picker@4.1.1
  - @hi-ui/popper@4.0.5
  - @hi-ui/tag-input@4.0.6

## 4.1.0

### Minor Changes

- [#2516](https://github.com/XiaoMi/hiui/pull/2516) [`49aa47c02`](https://github.com/XiaoMi/hiui/commit/49aa47c02f7b4fc858f2ca9b55974853dfdbd59d) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 showCheckAll API

## 4.0.10

### Patch Changes

- [#2334](https://github.com/XiaoMi/hiui/pull/2334) [`c9e6f4ad6`](https://github.com/XiaoMi/hiui/commit/c9e6f4ad6c1050b86bee5db681214d39830305c7) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复问题:设置 loading 无效果
