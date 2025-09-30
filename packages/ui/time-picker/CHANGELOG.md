# @hi-ui/time-picker

## 5.0.0-alpha.0

### Major Changes

- 1b05b44a4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 33edf35d2: feat(time-picker): appearance 增加 contained 类型，以及最新风格的样式修改 (5.0)
- 632dbda3a: feat: 下拉选择组件增加 showIndicator 参数 & 修改 appearance 中的 unset 样式 (5.0)
- 6eac4b78b: feat: 输入框和选择器组件增加 borderless 形态 (5.0)

### Patch Changes

- ddd2acc79: <br>
  - style(time-picker): 为占位符增加溢出处理和文本省略样式 (5.0)
  - style(tag-input): 为占位符增加溢出处理和文本省略样式 (5.0)
  - style(input): 增加溢出处理和文本省略样式 (5.0)
  - style(number-input): 增加溢出处理和文本省略样式 (5.0)
- 0cd15438e: style: 修改样式问题 (5.0)
- a01771e8d: style: 修改 appearance 为 unset 和 borderless 模式的样式 (5.0)
- 85bb84874: style: 下拉框间距改为 4px (5.0)
- 967963246: fix(time-picker): 修改 notifyOutside 回调逻辑，修复清空要点击 2 次才生效问题 (5.0)
- 2bbdebbe4: style: 修改样式问题 (5.0)
- 61d132802: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 489b27cb3: style: 修改样式 (5.0)
- 85bb84874: style: 统一调整选择类组件 hover 时的背景色 (5.0)
- c125e4c48: fix: 修复 UI 问题 (5.0)
- b7ad460d8: style: 修改 UI (5.0)
- Updated dependencies [dfff90e7c]
- Updated dependencies [5de7a848b]
- Updated dependencies [1b05b44a4]
- Updated dependencies [67960d871]
- Updated dependencies [de7f92b26]
- Updated dependencies [8116f0304]
- Updated dependencies [9fa354f31]
- Updated dependencies [77ed66eac]
- Updated dependencies [61d132802]
- Updated dependencies [489b27cb3]
- Updated dependencies [6eac4b78b]
- Updated dependencies [bcd3d08dd]
- Updated dependencies [4fb586f6f]
- Updated dependencies [c125e4c48]
- Updated dependencies [b7ad460d8]
  - @hi-ui/button@5.0.0-alpha.0
  - @hi-ui/core@5.0.0-alpha.0
  - @hi-ui/use-merge-refs@5.0.0-alpha.0
  - @hi-ui/use-uncontrolled-state@5.0.0-alpha.0
  - @hi-ui/icons@5.0.0-alpha.0
  - @hi-ui/popper@5.0.0-alpha.0
  - @hi-ui/classname@5.0.0-alpha.0
  - @hi-ui/env@5.0.0-alpha.0

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
