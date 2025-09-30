# @hi-ui/use-search-mode

## 5.0.0-alpha.0

### Major Changes

- 1b05b44a4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- 2c7c65a5a: fix(use-search-mode): 优化首次触发搜索逻辑 (5.0)
- 61d132802: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [1b05b44a4]
- Updated dependencies [61d132802]
  - @hi-ui/use-data-source@5.0.0-alpha.0
  - @hi-ui/use-latest@5.0.0-alpha.0
  - @hi-ui/loading@5.0.0-alpha.0
  - @hi-ui/dom-utils@5.0.0-alpha.0
  - @hi-ui/env@5.0.0-alpha.0
  - @hi-ui/func-utils@5.0.0-alpha.0
  - @hi-ui/tree-utils@5.0.0-alpha.0
  - @hi-ui/type-assertion@5.0.0-alpha.0

## 4.2.3

### Patch Changes

- [#3336](https://github.com/XiaoMi/hiui/pull/3336) [`9356e8c`](https://github.com/XiaoMi/hiui/commit/9356e8ca43ae75f2886bd5225723ee9afad501a6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(use-search-mode): 优化初次搜索逻辑 (#3335)

## 4.2.2

### Patch Changes

- [#3324](https://github.com/XiaoMi/hiui/pull/3324) [`8db6414b6`](https://github.com/XiaoMi/hiui/commit/8db6414b635ef561c7487a6f713c21a388d85739) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(use-search-mode): 更新搜索逻辑，增加对 nullish 值的处理，确保关键词有效性 (#3323)

## 4.2.1

### Patch Changes

- [#3249](https://github.com/XiaoMi/hiui/pull/3249) [`dc1311a91`](https://github.com/XiaoMi/hiui/commit/dc1311a917518bc5debef755a9fcd4e33fb58790) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(check-tree-select): 完善 dataSource 功能，支持搜索结果高亮和展开 (#3247)

## 4.2.0

### Minor Changes

- [#3015](https://github.com/XiaoMi/hiui/pull/3015) [`b2d784b23`](https://github.com/XiaoMi/hiui/commit/b2d784b23682e70cbc7b09e3396f51fda02e2223) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(select): Add searchOnInit api (#3004)
  feat(check-select): Add searchOnInit api (#3004)

## 4.1.4

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/use-data-source@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/loading@4.1.3
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/tree-utils@4.1.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.3

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/use-data-source@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/loading@4.1.2
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/tree-utils@4.1.3
  - @hi-ui/type-assertion@4.0.3

## 4.1.2

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/use-data-source@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/loading@4.1.1
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/tree-utils@4.1.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.1

### Patch Changes

- [#2633](https://github.com/XiaoMi/hiui/pull/2633) [`45cbe7bd9`](https://github.com/XiaoMi/hiui/commit/45cbe7bd9ddeaadfc8ff520a2448a0dade6be51c) Thanks [@aqiusen](https://github.com/aqiusen)! - 异步 search 增加防抖功能

## 4.1.0

### Minor Changes

- [#2542](https://github.com/XiaoMi/hiui/pull/2542) [`4b40f173a`](https://github.com/XiaoMi/hiui/commit/4b40f173a3c6125958392185c48756a07b1adb2f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 keyword API
