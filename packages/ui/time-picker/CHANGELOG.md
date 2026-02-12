# @hi-ui/time-picker

## 5.0.0-experimental.1

### Patch Changes

- 8f23e9322: style: 表单类组件统一调整后缀颜色、placeholder 颜色 (5.0)
- 900c6c2f0: style: 统一修改表单类组件 filled 背景色为 g100 (5.0)
- 发布 hiui experimental 版本
- f8321b72f: fix(time-picker): 修复清空后无法选中 00:00:00 问题 & 设置默认宽度 100% (5.0)

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 2f5e5ce4d: feat(time-picker): appearance 增加 contained 类型，以及最新风格的样式修改 (5.0)
- 6dca7795c: feat: 下拉选择组件增加 showIndicator 参数 & 修改 appearance 中的 unset 样式 (5.0)
- 58ad82e94: feat: 输入框和选择器组件增加 borderless 形态 (5.0)

### Patch Changes

- 1662753e0: style: fix ui bug (5.0)
- 41552be0b: <br>
  - style(time-picker): 为占位符增加溢出处理和文本省略样式 (5.0)
  - style(tag-input): 为占位符增加溢出处理和文本省略样式 (5.0)
  - style(input): 增加溢出处理和文本省略样式 (5.0)
  - style(number-input): 增加溢出处理和文本省略样式 (5.0)
- f4fc0ef30: style: 修改样式问题 (5.0)
- 29cae09ea: style: 修改 appearance 为 unset 和 borderless 模式的样式 (5.0)
- be5a59325: style: 修改样式问题 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 3b989bb78: fix(time-picker): update notifyOutside callback to handle single value case (5.0)
- 4a31cea53: style: 下拉框间距改为 4px (5.0)
- a5327c316: style(date-picker, time-picker): 修改禁用时的样式 (5.0)
- c74ed73f3: fix(time-picker): 修改 notifyOutside 回调逻辑，修复清空要点击 2 次才生效问题 (5.0)
- 934e1aecf: style: 修改样式问题 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 0a8cc07a7: style: 修改样式 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- 4a31cea53: style: 统一调整选择类组件 hover 时的背景色 (5.0)
- 99801c2d1: fix: 修复 UI 问题 (5.0)
- 86910f5e2: style: 修改 UI (5.0)
- Updated dependencies [1e226cd66]
- Updated dependencies [eea29eade]
- Updated dependencies [1662753e0]
- Updated dependencies [122d1d859]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [be5a59325]
- Updated dependencies [71fc15e5c]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [277c5033a]
- Updated dependencies [95abba983]
- Updated dependencies [8a92ec660]
- Updated dependencies [1429eced2]
- Updated dependencies [976ec929d]
- Updated dependencies [f1ab51725]
- Updated dependencies [4006b2c8c]
- Updated dependencies [e42e2badf]
- Updated dependencies [33da3144e]
- Updated dependencies [0a8cc07a7]
- Updated dependencies [7f3abee55]
- Updated dependencies [58ad82e94]
- Updated dependencies [a0f0c9d6b]
- Updated dependencies [f2be367e9]
- Updated dependencies [1972fd16a]
- Updated dependencies [99801c2d1]
- Updated dependencies [86910f5e2]
  - @hi-ui/popper@5.0.0-experimental.0
  - @hi-ui/button@5.0.0-experimental.0
  - @hi-ui/icons@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/use-merge-refs@5.0.0-experimental.0
  - @hi-ui/use-uncontrolled-state@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0

## 4.1.2

### Patch Changes

- [#3307](https://github.com/XiaoMi/hiui/pull/3307) [`7211244`](https://github.com/XiaoMi/hiui/commit/7211244c035ec21966c42eb5e58134348d97bd2f) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(date-picker&time-picker): 修复在日期时间范围选择模式下，disabledHours 回调参数总数返回 single 的问题 (#3289)

- [#3306](https://github.com/XiaoMi/hiui/pull/3306) [`0eaaf1375`](https://github.com/XiaoMi/hiui/commit/0eaaf137524a58744c280c6b462ef9ea43fccd0a) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(time-picker): 优化默认值处理逻辑，确保在没有传值时使用默认值 (#3302)

## 4.1.1

### Patch Changes

- [#3107](https://github.com/XiaoMi/hiui/pull/3107) [`e9bcdb9`](https://github.com/XiaoMi/hiui/commit/e9bcdb9fbfdb8085a57b76a30bc9d8fd3ca8b923) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(time-picker): 修复点击叉号关闭弹窗时没有触发 onChange 事件问题 (#3106)

## 4.1.0

### Minor Changes

- [#2904](https://github.com/XiaoMi/hiui/pull/2904) [`cfc6c971d`](https://github.com/XiaoMi/hiui/commit/cfc6c971d6b54ec93a87c72eb9a7a29fbfb68739) Thanks [@yang-x20](https://github.com/yang-x20)! - feat: 新增前缀后缀内容扩展

## 4.0.15

### Patch Changes

- [#2841](https://github.com/XiaoMi/hiui/pull/2841) [`494ebd982`](https://github.com/XiaoMi/hiui/commit/494ebd982d50a1bc57697effd8365adfa2d37132) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复设置空字符串无效问题

- Updated dependencies [[`3afbf239e`](https://github.com/XiaoMi/hiui/commit/3afbf239e816ede48d6a85cbd99b6b099b8c8eb3)]:
  - @hi-ui/env@4.0.7

## 4.0.14

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/button@4.0.10
  - @hi-ui/popper@4.1.5
  - @hi-ui/classname@4.0.5

## 4.0.13

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/button@4.0.9
  - @hi-ui/popper@4.1.3
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4

## 4.0.12

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/button@4.0.8
  - @hi-ui/popper@4.1.2
  - @hi-ui/classname@4.0.3

## 4.0.11

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/button@4.0.7
  - @hi-ui/popper@4.1.1
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2

## 4.0.10

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

- Updated dependencies [[`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315)]:
  - @hi-ui/button@4.0.6

## 4.0.9

### Patch Changes

- [#2465](https://github.com/XiaoMi/hiui/pull/2465) [`eec7e12c0`](https://github.com/XiaoMi/hiui/commit/eec7e12c0b10bf8a0d6ecf39674f5b847f96fbff) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 format="HH:mm" 模式下,选择此刻不生效问题
