# @hi-ui/descriptions

## 5.0.0-canary.7

### Patch Changes

- 1f9c6e335: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 22db9cf70: style: fix ui bug (5.0)
- Updated dependencies [1f9c6e335]
  - @hi-ui/core@5.0.0-canary.6

## 5.0.0-canary.6

### Minor Changes

- 922686dcc: feat(global-context): 增加 size api 全局配置 (5.0)

### Patch Changes

- 86877b241: style: 修改样式问题 (5.0)
- Updated dependencies [922686dcc]
  - @hi-ui/core@5.0.0-canary.5

## 5.0.0-canary.5

### Patch Changes

- d066abb24: style(descriptions): 更新描述组件样式，调整标签颜色为灰色 600，并增加行高设置 (5.0)

## 5.0.0-canary.4

### Patch Changes

- efce04a26: fix: 修改 UI 问题 (5.0)
- Updated dependencies [9106dca82]
  - @hi-ui/core@5.0.0-canary.3

## 5.0.0-canary.3

### Patch Changes

- chore: rebase master (5.0)
- Updated dependencies
  - @hi-ui/core@5.0.0-canary.2
  - @hi-ui/classname@5.0.0-canary.2
  - @hi-ui/env@5.0.0-canary.2
  - @hi-ui/type-assertion@5.0.0-canary.2

## 5.0.0-canary.2

### Patch Changes

- 4b09e728b: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [4b09e728b]
  - @hi-ui/core@5.0.0-canary.1
  - @hi-ui/classname@5.0.0-canary.1
  - @hi-ui/env@5.0.0-canary.1
  - @hi-ui/type-assertion@5.0.0-canary.1

## 5.0.0-canary.1

### Patch Changes

- 3903bd4ff: chore: 将代码中 v4 改为 v5 (5.0)

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- Updated dependencies [225ebaa51]
- Updated dependencies [428716024]
  - @hi-ui/core@5.0.0-canary.0
  - @hi-ui/classname@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0
  - @hi-ui/type-assertion@5.0.0-canary.0

## 4.5.1

### Patch Changes

- [#3197](https://github.com/XiaoMi/hiui/pull/3197) [`c31ebeb66`](https://github.com/XiaoMi/hiui/commit/c31ebeb661a437b730509792fbe88bb0cc028883) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(descriptions): 给 Row 和 Cell 组件增加 rest 参数支持，允许传递额外属性至组件 (#3193)

## 4.5.0

### Minor Changes

- [#2947](https://github.com/XiaoMi/hiui/pull/2947) [`e65de3140`](https://github.com/XiaoMi/hiui/commit/e65de31402d4ebd1aabcfbffa0e768d6cc2f6dc3) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: Add contentPosition api

## 4.4.0

### Minor Changes

- [#2882](https://github.com/XiaoMi/hiui/pull/2882) [`760114484`](https://github.com/XiaoMi/hiui/commit/760114484bb7a2c681c2de9972a5deb1267b6bbc) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 新增支持配置字段别名

## 4.3.0

### Minor Changes

- [#2812](https://github.com/XiaoMi/hiui/pull/2812) [`fbaf242b0`](https://github.com/XiaoMi/hiui/commit/fbaf242b0e36729787ee576e7e3ab05ed4115cf4) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - feat: 新增自定义列间距功能

## 4.2.5

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/classname@4.0.5

## 4.2.4

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.2.3

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/classname@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.2.2

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.2.1

### Patch Changes

- [#2624](https://github.com/XiaoMi/hiui/pull/2624) [`b8d4d79b4`](https://github.com/XiaoMi/hiui/commit/b8d4d79b4316ccae5753b97fbd16b1e5183d6fe6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复带边框模式下 size 设置无效问题

## 4.2.0

### Minor Changes

- [#2591](https://github.com/XiaoMi/hiui/pull/2591) [`fcbfd8026`](https://github.com/XiaoMi/hiui/commit/fcbfd80268b81d75cb63d5381ffba506b67e22a6) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add size api

## 4.1.2

### Patch Changes

- [#2550](https://github.com/XiaoMi/hiui/pull/2550) [`521ad72ed`](https://github.com/XiaoMi/hiui/commit/521ad72ed7eda1104e240320e0f9898fcfc4255b) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复只有一条数据时显示问题

## 4.1.1

### Patch Changes

- [#2416](https://github.com/XiaoMi/hiui/pull/2416) [`f8488d3c3`](https://github.com/XiaoMi/hiui/commit/f8488d3c3235d8bf2fc38e0ca3bfaed75bd0ce09) Thanks [@chownchen](https://github.com/chownchen)! - handle fix null data item crash

## 4.1.0

### Minor Changes

- [#2389](https://github.com/XiaoMi/hiui/pull/2389) [`0f1420d36`](https://github.com/XiaoMi/hiui/commit/0f1420d36bc6bc73b8994eb9dd277b26b930451f) Thanks [@chownchen](https://github.com/chownchen)! - Descriptions Component add data api

### Patch Changes

- Updated dependencies [[`a7d47168b`](https://github.com/XiaoMi/hiui/commit/a7d47168b519cacfd7b34edf6ba239c5b0b92284)]:
  - @hi-ui/core@4.0.5
