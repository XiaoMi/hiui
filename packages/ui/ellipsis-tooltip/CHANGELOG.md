# @hi-ui/ellipsis-tooltip

## 5.0.0

### Major Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- [#3512](https://github.com/XiaoMi/hiui/pull/3512) [`66bc9c3e2`](https://github.com/XiaoMi/hiui/commit/66bc9c3e24b2c8d20875a07c5305fb37f10ac5ac) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(ellipsis-tooltip): 修改为鼠标 hover 时再计算是否展示 Tooltip 以提升性能 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`fa5a60b56`](https://github.com/XiaoMi/hiui/commit/fa5a60b5627c18128f949387b3a21dec0734c424) Thanks [@zyprepare](https://github.com/zyprepare)! - <br>

  - fix(ellipsis-tooltip): 修复设置 numberOfLines 无效问题 & 兼容 children 为空情况 (5.0)
  - feat(ellipsis-tooltip): 增强 children 处理逻辑，支持 ReactNode 类型并优化 tooltip 显示 (5.0)

- [#3504](https://github.com/XiaoMi/hiui/pull/3504) [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe) Thanks [@zyprepare](https://github.com/zyprepare)! - style: 修复 UI/样式问题 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`0f4794deb`](https://github.com/XiaoMi/hiui/commit/0f4794debde4e42468c1cf46d1130c21372bff05) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(ellipsis-tooltip): 兼容 number 类型展示 (5.0)

- Updated dependencies [[`1e226cd66`](https://github.com/XiaoMi/hiui/commit/1e226cd66413cea8eb1e63b1cb83c1bfbf5f0a41), [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`8c0ee78f0`](https://github.com/XiaoMi/hiui/commit/8c0ee78f013dcd9ced94cef13a69933e039621aa), [`9b34d99bc`](https://github.com/XiaoMi/hiui/commit/9b34d99bc2aa8b78b9e3281e08afc086ac4afea1), [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39), [`fd4c20bbd`](https://github.com/XiaoMi/hiui/commit/fd4c20bbd30e18bc4c1a2eb078acaa4790f7b2eb), [`79ea480f3`](https://github.com/XiaoMi/hiui/commit/79ea480f33bb8f692dda1e6252a9d2a75c3ac30d), [`2e56529f7`](https://github.com/XiaoMi/hiui/commit/2e56529f7ea8c74e2fac8b6061628d4fd0d862ac), [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`9b34d99bc`](https://github.com/XiaoMi/hiui/commit/9b34d99bc2aa8b78b9e3281e08afc086ac4afea1), [`d021b4fa6`](https://github.com/XiaoMi/hiui/commit/d021b4fa6440faa7a09140c2c35dda10d51a35b3), [`f1ab51725`](https://github.com/XiaoMi/hiui/commit/f1ab517258599ee2dfad183e4a8c7b855ef409c1), [`d91a8bb0f`](https://github.com/XiaoMi/hiui/commit/d91a8bb0f887fa886215aa596852eef3c2ce8519), [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193), [`58ad82e94`](https://github.com/XiaoMi/hiui/commit/58ad82e9441e76bf6090e6a0f4e36a04342c25f0), [`95d930354`](https://github.com/XiaoMi/hiui/commit/95d930354a1ab4291e98a9abccb9525d6c210795), [`59cef699f`](https://github.com/XiaoMi/hiui/commit/59cef699f96f56d4f68fae7f9dadb960c487b5de)]:
  - @hi-ui/tooltip@5.0.0
  - @hi-ui/core@5.0.0
  - @hi-ui/classname@5.0.0
  - @hi-ui/env@5.0.0

## 4.2.0

### Minor Changes

- [#3098](https://github.com/XiaoMi/hiui/pull/3098) [`5ff292557`](https://github.com/XiaoMi/hiui/commit/5ff292557be9b69b6f954717165818d7e9c25c45) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(ellipsis-tooltip): 支持标记 Tooltip 可用状态 (#3097)

## 4.1.8

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/tooltip@4.0.11
  - @hi-ui/classname@4.0.5

## 4.1.7

### Patch Changes

- [#2772](https://github.com/XiaoMi/hiui/pull/2772) [`bd08ec23f`](https://github.com/XiaoMi/hiui/commit/bd08ec23ff0b3ba6c8c4e26c7655d0770397aa90) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复在 Table 中 resizable 模式下不显示气泡问题

## 4.1.6

### Patch Changes

- [#2767](https://github.com/XiaoMi/hiui/pull/2767) [`bf65f0061`](https://github.com/XiaoMi/hiui/commit/bf65f006190766d09a27b5d81703a8ed88d79205) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复在下拉框中使用无效果问题

## 4.1.5

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/tooltip@4.0.10
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4

## 4.1.4

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/tooltip@4.0.9
  - @hi-ui/classname@4.0.3

## 4.1.3

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/tooltip@4.0.8
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2

## 4.1.2

### Patch Changes

- [#2459](https://github.com/XiaoMi/hiui/pull/2459) [`957f35be5`](https://github.com/XiaoMi/hiui/commit/957f35be51204b0dbdd48942ca66d0bb99ce50d6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: type error

## 4.1.1

### Patch Changes

- [#2439](https://github.com/XiaoMi/hiui/pull/2439) [`960cb3bc8`](https://github.com/XiaoMi/hiui/commit/960cb3bc89a37a2d8b9882bc6551b75f2119fb82) Thanks [@chownchen](https://github.com/chownchen)! - add title api

## 4.1.0

### Minor Changes

- [#2435](https://github.com/XiaoMi/hiui/pull/2435) [`c3e490027`](https://github.com/XiaoMi/hiui/commit/c3e49002752965c90fdf73f9be26d85b9252be19) Thanks [@chownchen](https://github.com/chownchen)! - api and docs update

## 4.0.0

### Patch Changes

- [#2424](https://github.com/XiaoMi/hiui/pull/2424) [`87f404cfc`](https://github.com/XiaoMi/hiui/commit/87f404cfcc30b8191cd5f60e837c075dab3cd0ee) Thanks [@zyprepare](https://github.com/zyprepare)! - 增加 ellipsis-tooltip 组件

- Updated dependencies [[`14f0e2d53`](https://github.com/XiaoMi/hiui/commit/14f0e2d5313cf1575f6e6378659e5406f8045529)]:
  - @hi-ui/tooltip@4.0.6
