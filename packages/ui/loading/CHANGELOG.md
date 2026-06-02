# @hi-ui/loading

## 5.0.0-rc.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 4006b2c8c: feat(loading): 默认效果改为 spin 类型 & 增加 contentPosition、size 和 color 参数 (5.0)
- 59cef699f: feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- 0f7aac2f3: fix(loading): rename wrapper class to content-wrapper and adjust styles for better layout (5.0)
- 1e226cd66: chore: 修改 react-compat 依赖管理方式 & 更新 react-transition-group 依赖 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- eb17c4697: style: 修复 UI/样式问题 (5.0)
- ac15c6141: <br />
  - fix(table): 修改表格在外层是 scale 时导致列宽计算有误的问题 (5.0)
  - fix(loading): 修改 loading size 类型，移除 xs 尺寸 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [eb17c4697]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [79ea480f3]
- Updated dependencies [3a7186e4b]
- Updated dependencies [e3dea9be5]
- Updated dependencies [f1ab51725]
- Updated dependencies [7f08a4e4f]
- Updated dependencies [4006b2c8c]
- Updated dependencies [c407744fe]
- Updated dependencies [d91a8bb0f]
- Updated dependencies [33da3144e]
- Updated dependencies [58ad82e94]
- Updated dependencies [95d930354]
  - @hi-ui/core@5.0.0-rc.0
  - @hi-ui/use-id@5.0.0-rc.0
  - @hi-ui/use-latest@5.0.0-rc.0
  - @hi-ui/portal@5.0.0-rc.0
  - @hi-ui/spinner@5.0.0-rc.0
  - @hi-ui/classname@5.0.0-rc.0
  - @hi-ui/container@5.0.0-rc.0
  - @hi-ui/env@5.0.0-rc.0
  - @hi-ui/func-utils@5.0.0-rc.0
  - @hi-ui/react-utils@5.0.0-rc.0
  - @hi-ui/type-assertion@5.0.0-rc.0
  - @hi-ui/use-merge-semantic@5.0.0-rc.0
  - @hi-ui/react-compat@5.0.0-rc.0

## 4.3.0

### Minor Changes

- [#3068](https://github.com/XiaoMi/hiui/pull/3068) [`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(portal-context): Provider 增加 portal 参数，支持配置全局 container (#3060)

### Patch Changes

- Updated dependencies [[`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770)]:
  - @hi-ui/core@4.0.9

## 4.2.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/portal@4.0.8
  - @hi-ui/spinner@4.0.9
  - @hi-ui/classname@4.0.5
  - @hi-ui/container@4.1.1

## 4.2.0

### Minor Changes

- [#2703](https://github.com/XiaoMi/hiui/pull/2703) [`4ec059bad`](https://github.com/XiaoMi/hiui/commit/4ec059badc67f3facc98288f3e7a67f51938e40f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add wrapperClassName and wrapperStyle apis

## 4.1.3

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-id@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/portal@4.0.7
  - @hi-ui/spinner@4.0.8
  - @hi-ui/classname@4.0.4
  - @hi-ui/container@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.2

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-id@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/portal@4.0.6
  - @hi-ui/spinner@4.0.7
  - @hi-ui/classname@4.0.3
  - @hi-ui/container@4.0.3
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.1.1

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-id@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/portal@4.0.5
  - @hi-ui/spinner@4.0.6
  - @hi-ui/classname@4.0.2
  - @hi-ui/container@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.0

### Minor Changes

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加环形 loading
