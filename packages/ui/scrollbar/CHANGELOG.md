# @hi-ui/scrollbar

## 5.0.0

### Major Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`95dd766b9`](https://github.com/XiaoMi/hiui/commit/95dd766b919af5c02d0d29d8b99a61261183da2f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(scrollbar): 增加 bordered 参数，和改造新版样式 (5.0)

### Patch Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`2e56529f7`](https://github.com/XiaoMi/hiui/commit/2e56529f7ea8c74e2fac8b6061628d4fd0d862ac) Thanks [@zyprepare](https://github.com/zyprepare)! - styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)

- [#3504](https://github.com/XiaoMi/hiui/pull/3504) [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe) Thanks [@zyprepare](https://github.com/zyprepare)! - style: 修复 UI/样式问题 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)

- Updated dependencies [[`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`8c0ee78f0`](https://github.com/XiaoMi/hiui/commit/8c0ee78f013dcd9ced94cef13a69933e039621aa), [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39), [`fd4c20bbd`](https://github.com/XiaoMi/hiui/commit/fd4c20bbd30e18bc4c1a2eb078acaa4790f7b2eb), [`79ea480f3`](https://github.com/XiaoMi/hiui/commit/79ea480f33bb8f692dda1e6252a9d2a75c3ac30d), [`f1ab51725`](https://github.com/XiaoMi/hiui/commit/f1ab517258599ee2dfad183e4a8c7b855ef409c1), [`d91a8bb0f`](https://github.com/XiaoMi/hiui/commit/d91a8bb0f887fa886215aa596852eef3c2ce8519), [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193), [`58ad82e94`](https://github.com/XiaoMi/hiui/commit/58ad82e9441e76bf6090e6a0f4e36a04342c25f0), [`95d930354`](https://github.com/XiaoMi/hiui/commit/95d930354a1ab4291e98a9abccb9525d6c210795)]:
  - @hi-ui/core@5.0.0
  - @hi-ui/use-merge-refs@5.0.0
  - @hi-ui/classname@5.0.0
  - @hi-ui/env@5.0.0

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
