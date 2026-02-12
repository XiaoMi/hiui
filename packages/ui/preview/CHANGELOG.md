# @hi-ui/preview

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- f03f60ebd: <br>
  - feat(preview): title 参数支持传入函数返回自定义内容 (5.0)
  - fix(preview): 修复禁止下载时下载按钮没有隐藏问题 (5.0)

### Patch Changes

- 1e226cd66: chore: 修改 react-compat 依赖管理方式 & 更新 react-transition-group 依赖 (5.0)
- 44deb7265: style(preview): 新版样式调整 (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 95abba983: fix: 修改 UI 问题 (5.0)
- d2ccdc691: fix(preview): 兼容 src 内容为空的情况 & 优化预览图片的展示 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- 5cf3f8930: fix(preview): 修复滚轮缩放缺乏边界&外部滚动锁定问题 (5.0)
- Updated dependencies [1662753e0]
- Updated dependencies [122d1d859]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [79ea480f3]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [58ad82e94]
- Updated dependencies [a0f0c9d6b]
  - @hi-ui/icons@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/use-latest@5.0.0-experimental.0
  - @hi-ui/use-scroll-lock@5.0.0-experimental.0
  - @hi-ui/use-uncontrolled-state@5.0.0-experimental.0
  - @hi-ui/portal@5.0.0-experimental.0
  - @hi-ui/watermark@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0

## 4.2.2

### Patch Changes

- [#3380](https://github.com/XiaoMi/hiui/pull/3380) [`9808ab271`](https://github.com/XiaoMi/hiui/commit/9808ab27177458431767602538ee52d1f2a3a9e6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(preview): prevent movement on right-click in Preview component (#3379)

- Updated dependencies [[`d5b4363`](https://github.com/XiaoMi/hiui/commit/d5b4363888ebc0869a70482de2eb114326ee4d3c)]:
  - @hi-ui/core@4.0.10

## 4.2.1

### Patch Changes

- [#3350](https://github.com/XiaoMi/hiui/pull/3350) [`997208570`](https://github.com/XiaoMi/hiui/commit/9972085705ff9db36a6460a933937c929c90a9c0) Thanks [@fcppddl](https://github.com/fcppddl)! - fix(preview): 修复初始设置可见无效问题 (#3349)

## 4.2.0

### Minor Changes

- [#3068](https://github.com/XiaoMi/hiui/pull/3068) [`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(portal-context): Provider 增加 portal 参数，支持配置全局 container (#3060)

### Patch Changes

- Updated dependencies [[`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770)]:
  - @hi-ui/core@4.0.9

## 4.1.1

### Patch Changes

- [#2924](https://github.com/XiaoMi/hiui/pull/2924) [`a227f4b5b`](https://github.com/XiaoMi/hiui/commit/a227f4b5b677ccbb41e196f2ea1cdd511dd6d6e7) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 添加 @hi-ui/watermark 依赖

## 4.1.0

### Minor Changes

- [#2815](https://github.com/XiaoMi/hiui/pull/2815) [`9103ff92e`](https://github.com/XiaoMi/hiui/commit/9103ff92e490105df57e0369ed6512a10e1818de) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 支持配置图片水印以及禁止右键下载图片

### Patch Changes

- Updated dependencies [[`3afbf239e`](https://github.com/XiaoMi/hiui/commit/3afbf239e816ede48d6a85cbd99b6b099b8c8eb3)]:
  - @hi-ui/env@4.0.7

## 4.0.9

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/portal@4.0.8
  - @hi-ui/classname@4.0.5

## 4.0.8

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/portal@4.0.7
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4

## 4.0.7

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/portal@4.0.6
  - @hi-ui/classname@4.0.3

## 4.0.6

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/portal@4.0.5
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2

## 4.0.5

### Patch Changes

- [#2553](https://github.com/XiaoMi/hiui/pull/2553) [`6d48d2f0b`](https://github.com/XiaoMi/hiui/commit/6d48d2f0b2c1258a1fe978cee8ef20a3443e4b66) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 支持键盘左右切换图片
