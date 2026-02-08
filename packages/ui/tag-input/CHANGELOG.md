# @hi-ui/tag-input

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- f1ab51725: <br>
  - feat(picker): 下拉选择类组件增加 xs 尺寸 (5.0)
  - feat(input): 输入框组件增加 xs 尺寸 (5.0)
- 6dca7795c: feat: 下拉选择组件增加 showIndicator 参数 & 修改 appearance 中的 unset 样式 (5.0)
- 77d969c2e: feat: 下拉选择类组件 appearance 参数增加 contained 类型 (5.0)
- 58ad82e94: feat: 输入框和选择器组件增加 borderless 形态 (5.0)

### Patch Changes

- cce71cdfa: style(tag-input): 调整 total 的内边距和最小宽度 (5.0)
- 1662753e0: style: fix ui bug (5.0)
- 41552be0b: <br>
  - style(time-picker): 为占位符增加溢出处理和文本省略样式 (5.0)
  - style(tag-input): 为占位符增加溢出处理和文本省略样式 (5.0)
  - style(input): 增加溢出处理和文本省略样式 (5.0)
  - style(number-input): 增加溢出处理和文本省略样式 (5.0)
- 9b34d99bc: fix: 修复 5.0 UI 问题 (5.0)
- f4fc0ef30: style: 修改样式问题 (5.0)
- cb9d8f6db: fix(tag-input): 修复 contained 模式下 displayRender 设置无效问题 (5.0)
- 29cae09ea: style: 修改 appearance 为 unset 和 borderless 模式的样式 (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 9ecf354ba: perf(cascader): 性能优化 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- e7b64347e: style(tag-input): 增加 flex-wrap 属性以优化标签换行展示 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- 6fcda9bf2: chore: 优化 Input 和 TagInput label 显示逻辑 (5.0)
- 0a4e90dbd: <br>
  - style(tag-input): 间距调整 (5.0)
  - style(select): 选择类组件选项圆角改为 4px (5.0)
  - style(picker): 搜索框样式调整 (5.0)
- 99801c2d1: fix: 修复 UI 问题 (5.0)
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
  - @hi-ui/use-merge-refs@5.0.0-experimental.0
  - @hi-ui/use-outside-click@5.0.0-experimental.0
  - @hi-ui/use-uncontrolled-state@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0
  - @hi-ui/func-utils@5.0.0-experimental.0
  - @hi-ui/type-assertion@5.0.0-experimental.0

## 4.1.5

### Patch Changes

- [#3450](https://github.com/XiaoMi/hiui/pull/3450) [`0cea4d7`](https://github.com/XiaoMi/hiui/commit/0cea4d75c771b5db56f520821b53864051c33594) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(tag-input): ensure at least one tag is displayed when container width is insufficient (#3449)

## 4.1.4

### Patch Changes

- [#3261](https://github.com/XiaoMi/hiui/pull/3261) [`b8c19048f`](https://github.com/XiaoMi/hiui/commit/b8c19048fe25147f344be4cd951740593aee8d12) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(tag-input): 修复 TagInputMock 组件中标签最大数量逻辑及更新 tagsWidth 的处理方式 (#3260)

## 4.1.3

### Patch Changes

- [#3096](https://github.com/XiaoMi/hiui/pull/3096) [`3aff5eee7`](https://github.com/XiaoMi/hiui/commit/3aff5eee7ab4e1734fa2800d5154e8ebe24bbe00) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(tag-input): 优化 wrap 模式下设置 displayRender 卡顿问题 (#3094)

## 4.1.2

### Patch Changes

- [#3000](https://github.com/XiaoMi/hiui/pull/3000) [`908d6cd96`](https://github.com/XiaoMi/hiui/commit/908d6cd9657551203917230d9a91de45e65354c2) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 优化大数据下勾选卡顿

## 4.1.1

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/classname@4.0.5

## 4.1.0

### Minor Changes

- [#2746](https://github.com/XiaoMi/hiui/pull/2746) [`b3a13135c`](https://github.com/XiaoMi/hiui/commit/b3a13135c77e75291d5864ff7fcf63ddb2ff46b8) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add prefix api

## 4.0.10

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-merge-refs@4.0.4
  - @hi-ui/use-outside-click@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.0.9

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-merge-refs@4.0.3
  - @hi-ui/use-outside-click@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/classname@4.0.3
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.0.8

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-merge-refs@4.0.2
  - @hi-ui/use-outside-click@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.0.7

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

## 4.0.6

### Patch Changes

- [#2531](https://github.com/XiaoMi/hiui/pull/2531) [`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912) Thanks [@zyprepare](https://github.com/zyprepare)! - 优化 wrap 模式下代码
