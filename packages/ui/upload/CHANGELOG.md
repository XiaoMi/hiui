# @hi-ui/upload

## 4.3.0

### Minor Changes

- [#3470](https://github.com/XiaoMi/hiui/pull/3470) [`24216019a`](https://github.com/XiaoMi/hiui/commit/24216019a409bd9ea029df27e41cc9000856b1f2) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(upload): add timeout option to upload components and types (#3469)

## 4.2.5

### Patch Changes

- [#3164](https://github.com/XiaoMi/hiui/pull/3164) [`084cf985c`](https://github.com/XiaoMi/hiui/commit/084cf985c7813c646c0a3df03d32dc9d8752edef) Thanks [@fcppddl](https://github.com/fcppddl)! - fix(upload): 修改 upload 组件支持上传的文件异常(#3163)

## 4.2.4

### Patch Changes

- [#3140](https://github.com/XiaoMi/hiui/pull/3140) [`482c4b6`](https://github.com/XiaoMi/hiui/commit/482c4b63999a8c1f9b24e703f529c28baebffbc0) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(upload): 在 DragUpload 和 PictureListUpload 组件中添加 actionRender 属性以支持自定义操作渲染 (#3139)

## 4.2.3

### Patch Changes

- [#2936](https://github.com/XiaoMi/hiui/pull/2936) [`5fa1190b9`](https://github.com/XiaoMi/hiui/commit/5fa1190b9d1aa5766b4270fd0240f0baffaa5e1a) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(upload): 修复设置 maxCount 后上传时报错问题

## 4.2.2

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/button@4.0.10
  - @hi-ui/file-select@4.0.8
  - @hi-ui/message@4.0.8
  - @hi-ui/modal@4.1.1
  - @hi-ui/preview@4.0.9
  - @hi-ui/classname@4.0.5

## 4.2.1

### Patch Changes

- [#2727](https://github.com/XiaoMi/hiui/pull/2727) [`26203110e`](https://github.com/XiaoMi/hiui/commit/26203110e48496b9d5a3725ff51f84f73e9633f3) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 disabled 不生效问题

## 4.2.0

### Minor Changes

- [#2705](https://github.com/XiaoMi/hiui/pull/2705) [`ec6de99c3`](https://github.com/XiaoMi/hiui/commit/ec6de99c3369d693df4d1c57564800f127446e23) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 依赖项中增加 @hi-ui/message，否则打包时会将多余代码打进去
  feat: 暴露出单个不同类型的上传组件，支持按需引入，对 Tree Shaking 友好

## 4.1.9

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-id@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/button@4.0.9
  - @hi-ui/file-select@4.0.7
  - @hi-ui/modal@4.0.15
  - @hi-ui/preview@4.0.8
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4

## 4.1.8

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-id@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/button@4.0.8
  - @hi-ui/file-select@4.0.6
  - @hi-ui/modal@4.0.14
  - @hi-ui/preview@4.0.7
  - @hi-ui/classname@4.0.3

## 4.1.7

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-id@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/button@4.0.7
  - @hi-ui/file-select@4.0.5
  - @hi-ui/modal@4.0.13
  - @hi-ui/preview@4.0.6
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2

## 4.1.6

### Patch Changes

- [#2612](https://github.com/XiaoMi/hiui/pull/2612) [`832360b54`](https://github.com/XiaoMi/hiui/commit/832360b54231983148858b12707087c6b6fbac87) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修改下拉菜单高度为 32px

## 4.1.5

### Patch Changes

- [#2552](https://github.com/XiaoMi/hiui/pull/2552) [`5c376ecee`](https://github.com/XiaoMi/hiui/commit/5c376eceefb006643aab2a918c7535c23f5e9449) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: accept 支持设置 .文件类型 这种格式

- Updated dependencies [[`6d48d2f0b`](https://github.com/XiaoMi/hiui/commit/6d48d2f0b2c1258a1fe978cee8ef20a3443e4b66)]:
  - @hi-ui/preview@4.0.5

## 4.1.4

### Patch Changes

- [#2473](https://github.com/XiaoMi/hiui/pull/2473) [`3d5f9ba15`](https://github.com/XiaoMi/hiui/commit/3d5f9ba15868ccdc385cdcdc8a3bbe2e55542b39) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 sonarcloud 扫描的 Bugs

## 4.1.3

### Patch Changes

- [#2443](https://github.com/XiaoMi/hiui/pull/2443) [`0a69cdf32`](https://github.com/XiaoMi/hiui/commit/0a69cdf32c305a35286947b55d1ec05159358ba0) Thanks [@zyprepare](https://github.com/zyprepare)! - hotfix: type="drag" 模式下，限制文件类型无效

## 4.1.2

### Patch Changes

- [#2429](https://github.com/XiaoMi/hiui/pull/2429) [`72e2adbbd`](https://github.com/XiaoMi/hiui/commit/72e2adbbd78911c14fa541492efb55873662657c) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复问题: maxSize 设置后，上传图片超出大小时无效果

## 4.1.1

### Patch Changes

- [#2419](https://github.com/XiaoMi/hiui/pull/2419) [`2a752a458`](https://github.com/XiaoMi/hiui/commit/2a752a458300331acefa250d20fd8c0785e6683b) Thanks [@zyprepare](https://github.com/zyprepare)! - 问题修复: type="avatar" 模式下,图片裁剪后的格式默认都变成了 png

## 4.1.0

### Minor Changes

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 增加 method api
  修复 uploadAction 异步处理时的问题
