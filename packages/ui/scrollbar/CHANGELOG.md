# @hi-ui/scrollbar

## 5.0.0-canary.6

### Patch Changes

- 22db9cf70: style: fix ui bug (5.0)
- Updated dependencies [1f9c6e335]
  - @hi-ui/core@5.0.0-canary.6

## 5.0.0-canary.5

### Patch Changes

- 86877b241: style: 修改样式问题 (5.0)
- Updated dependencies [922686dcc]
  - @hi-ui/core@5.0.0-canary.5

## 5.0.0-canary.4

### Patch Changes

- Updated dependencies [9106dca82]
  - @hi-ui/core@5.0.0-canary.3

## 5.0.0-canary.3

### Minor Changes

- 756473045: feat(scrollbar): 增加 bordered 参数，和改造新版样式 (5.0)

## 5.0.0-canary.2

### Patch Changes

- chore: rebase master (5.0)
- Updated dependencies
  - @hi-ui/core@5.0.0-canary.2
  - @hi-ui/use-merge-refs@5.0.0-canary.2
  - @hi-ui/classname@5.0.0-canary.2
  - @hi-ui/env@5.0.0-canary.2

## 5.0.0-canary.1

### Patch Changes

- 4b09e728b: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [4b09e728b]
  - @hi-ui/core@5.0.0-canary.1
  - @hi-ui/use-merge-refs@5.0.0-canary.1
  - @hi-ui/classname@5.0.0-canary.1
  - @hi-ui/env@5.0.0-canary.1

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- Updated dependencies [225ebaa51]
- Updated dependencies [428716024]
  - @hi-ui/core@5.0.0-canary.0
  - @hi-ui/use-merge-refs@5.0.0-canary.0
  - @hi-ui/classname@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0

## 4.2.1

### Patch Changes

- [#3042](https://github.com/XiaoMi/hiui/pull/3042) [`3a5f60d`](https://github.com/XiaoMi/hiui/commit/3a5f60d702bee78455e936bbb4d094e272bd7b9f) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(scrollbar): Scrollbar 组件中去掉 perfect-scrollbar 依赖,因为通过 patch-package 修改了这个库的源码,所以必现将依赖去掉,这样才能将修改的源码打包到 Scrollbar 组件的 lib 中

## 4.2.0

### Minor Changes

- [#3020](https://github.com/XiaoMi/hiui/pull/3020) [`241447e14`](https://github.com/XiaoMi/hiui/commit/241447e148f4544c6a08623d60d977e286ec9d64) Thanks [@fcppddl](https://github.com/fcppddl)! - feat(scrollbar): 支持滚动条吸底 (#3019)

## 4.1.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/classname@4.0.5

## 4.1.0

### Minor Changes

- [#2688](https://github.com/XiaoMi/hiui/pull/2688) [`2fa5ee5b6`](https://github.com/XiaoMi/hiui/commit/2fa5ee5b6ecc7f95a5224fd91ccfcd263b41d932) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add zIndex api

## 4.0.6

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-merge-refs@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4

## 4.0.5

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-merge-refs@4.0.3
  - @hi-ui/classname@4.0.3

## 4.0.4

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-merge-refs@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2

## 4.0.3

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

## 4.0.2

### Patch Changes

- [#2597](https://github.com/XiaoMi/hiui/pull/2597) [`0ddf24960`](https://github.com/XiaoMi/hiui/commit/0ddf24960194fdd15653e34e0a6cef54b1586748) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 升级 dart-sass 后修改语法
