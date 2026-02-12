# @hi-ui/notification

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 7929cd254: feat(notification): 支持自定义弹出位置 (5.0)

### Patch Changes

- 4a31cea53: style: 统一调整组件 shadow (5.0)
- 1e226cd66: chore: 修改 react-compat 依赖管理方式 & 更新 react-transition-group 依赖 (5.0)
- 8c0ee78f0: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 9b34d99bc: fix: 修复 5.0 UI 问题 (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 95abba983: fix: 修改 UI 问题 (5.0)
- 934e1aecf: style: 修改样式问题 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- a0f0c9d6b: style: 修改 UI 问题 (5.0)
- Updated dependencies [1e226cd66]
- Updated dependencies [1662753e0]
- Updated dependencies [122d1d859]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [be5a59325]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [7f3abee55]
- Updated dependencies [58ad82e94]
- Updated dependencies [7f08a4e4f]
- Updated dependencies [a0f0c9d6b]
  - @hi-ui/toast@5.0.0-experimental.0
  - @hi-ui/icons@5.0.0-experimental.0
  - @hi-ui/icon-button@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0
  - @hi-ui/react-utils@5.0.0-experimental.0

## 4.2.1

### Patch Changes

- [#2804](https://github.com/XiaoMi/hiui/pull/2804) [`9e91b9075`](https://github.com/XiaoMi/hiui/commit/9e91b90752a7638930de7d86c73f67049c376342) Thanks [@wangjue666](https://github.com/wangjue666)! - fix: 调整通知组件过度样式触发滚动条

## 4.2.0

### Minor Changes

- [#2832](https://github.com/XiaoMi/hiui/pull/2832) [`e37e7616b`](https://github.com/XiaoMi/hiui/commit/e37e7616b541fec3940ec00dac0764f09234f7e3) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 支持自定义 notification 配置

### Patch Changes

- Updated dependencies [[`7550aff2e`](https://github.com/XiaoMi/hiui/commit/7550aff2ef526c0009f37d79b249875e5b756275)]:
  - @hi-ui/toast@4.1.0

## 4.1.4

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/icon-button@4.0.9
  - @hi-ui/toast@4.0.8
  - @hi-ui/classname@4.0.5

## 4.1.3

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/icons@4.0.18
  - @hi-ui/icon-button@4.0.8
  - @hi-ui/toast@4.0.7
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/react-utils@4.0.4

## 4.1.2

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/icons@4.0.17
  - @hi-ui/icon-button@4.0.7
  - @hi-ui/toast@4.0.6
  - @hi-ui/classname@4.0.3
  - @hi-ui/react-utils@4.0.3

## 4.1.1

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/icons@4.0.16
  - @hi-ui/icon-button@4.0.6
  - @hi-ui/toast@4.0.5
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/react-utils@4.0.2

## 4.1.0

### Minor Changes

- [#2578](https://github.com/XiaoMi/hiui/pull/2578) [`2df756409`](https://github.com/XiaoMi/hiui/commit/2df75640961d51f269df60e4dde1ee5c8751430d) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 size API

### Patch Changes

- Updated dependencies [[`937052db3`](https://github.com/XiaoMi/hiui/commit/937052db36ecfa50fef53df13d159bee0d08fa41)]:
  - @hi-ui/icons@4.0.14
