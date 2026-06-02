# @hi-ui/alert

## 5.0.0-rc.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- 8c0ee78f0: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 67c80bdd5: style(alert): 新版样式调整 (5.0)
- eb17c4697: style: 修复 UI/样式问题 (5.0)
- 3ff6c519b: style(color-css): 更新颜色 Token (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [eea29eade]
- Updated dependencies [7f204c892]
- Updated dependencies [122d1d859]
- Updated dependencies [eb17c4697]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [3a7186e4b]
- Updated dependencies [8a92ec660]
- Updated dependencies [1429eced2]
- Updated dependencies [eb17c4697]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [c407744fe]
- Updated dependencies [d91a8bb0f]
- Updated dependencies [4006b2c8c]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [58ad82e94]
- Updated dependencies [95d930354]
- Updated dependencies [99801c2d1]
  - @hi-ui/button@5.0.0-rc.0
  - @hi-ui/icons@5.0.0-rc.0
  - @hi-ui/core@5.0.0-rc.0
  - @hi-ui/use-latest@5.0.0-rc.0
  - @hi-ui/use-timeout@5.0.0-rc.0
  - @hi-ui/classname@5.0.0-rc.0
  - @hi-ui/env@5.0.0-rc.0
  - @hi-ui/use-merge-semantic@5.0.0-rc.0

## 4.1.4

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/icon-button@4.0.9
  - @hi-ui/classname@4.0.5

## 4.1.3

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-timeout@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/icon-button@4.0.8
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4

## 4.1.2

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-timeout@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/icon-button@4.0.7
  - @hi-ui/classname@4.0.3

## 4.1.1

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-timeout@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/icon-button@4.0.6
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2

## 4.1.0

### Minor Changes

- [#2584](https://github.com/XiaoMi/hiui/pull/2584) [`4dc2094d4`](https://github.com/XiaoMi/hiui/commit/4dc2094d43cc39ab2cdeb0c10b62866d83f8ad05) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api
