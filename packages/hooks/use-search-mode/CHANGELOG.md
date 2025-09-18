# @hi-ui/use-search-mode

## 5.0.0-canary.4

### Patch Changes

- 8db6414b6: fix(use-search-mode): 更新搜索逻辑，增加对 nullish 值的处理，确保关键词有效性 (#3323)

## 5.0.0-canary.3

### Patch Changes

- dc1311a91: fix(check-tree-select): 完善 dataSource 功能，支持搜索结果高亮和展开 (#3247)

## 5.0.0-canary.2

### Patch Changes

- chore: rebase master (5.0)
- Updated dependencies
  - @hi-ui/use-data-source@5.0.0-canary.2
  - @hi-ui/use-latest@5.0.0-canary.2
  - @hi-ui/loading@5.0.0-canary.2
  - @hi-ui/dom-utils@5.0.0-canary.2
  - @hi-ui/env@5.0.0-canary.2
  - @hi-ui/func-utils@5.0.0-canary.2
  - @hi-ui/tree-utils@5.0.0-canary.2
  - @hi-ui/type-assertion@5.0.0-canary.2

## 5.0.0-canary.1

### Patch Changes

- 4b09e728b: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [4b09e728b]
  - @hi-ui/use-data-source@5.0.0-canary.1
  - @hi-ui/use-latest@5.0.0-canary.1
  - @hi-ui/loading@5.0.0-canary.1
  - @hi-ui/dom-utils@5.0.0-canary.1
  - @hi-ui/env@5.0.0-canary.1
  - @hi-ui/func-utils@5.0.0-canary.1
  - @hi-ui/tree-utils@5.0.0-canary.1
  - @hi-ui/type-assertion@5.0.0-canary.1

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- Updated dependencies [225ebaa51]
  - @hi-ui/use-data-source@5.0.0-canary.0
  - @hi-ui/use-latest@5.0.0-canary.0
  - @hi-ui/loading@5.0.0-canary.0
  - @hi-ui/dom-utils@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0
  - @hi-ui/func-utils@5.0.0-canary.0
  - @hi-ui/tree-utils@5.0.0-canary.0
  - @hi-ui/type-assertion@5.0.0-canary.0

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
