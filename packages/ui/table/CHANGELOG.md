# @hi-ui/table

## 5.0.0-canary.20

### Patch Changes

- 1f9c6e335: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 22db9cf70: style: fix ui bug (5.0)
- Updated dependencies [d97cc24eb]
- Updated dependencies [1f9c6e335]
- Updated dependencies [22db9cf70]
  - @hi-ui/drawer@5.0.0-canary.8
  - @hi-ui/loading@5.0.0-canary.8
  - @hi-ui/popper@5.0.0-canary.9
  - @hi-ui/core@5.0.0-canary.6
  - @hi-ui/empty-state@5.0.0-canary.6
  - @hi-ui/pagination@5.0.0-canary.8
  - @hi-ui/button@5.0.0-canary.12
  - @hi-ui/checkbox@5.0.0-canary.6
  - @hi-ui/icon-button@5.0.0-canary.5
  - @hi-ui/radio@5.0.0-canary.6
  - @hi-ui/scrollbar@5.0.0-canary.6
  - @hi-ui/select@5.0.0-canary.14

## 5.0.0-canary.19

### Minor Changes

- 922686dcc: feat(global-context): 增加 size api 全局配置 (5.0)

### Patch Changes

- 86877b241: style: 修改样式问题 (5.0)
- Updated dependencies [2b706fc6d]
- Updated dependencies [86877b241]
- Updated dependencies [922686dcc]
- Updated dependencies [8e969ad73]
  - @hi-ui/select@5.0.0-canary.13
  - @hi-ui/button@5.0.0-canary.11
  - @hi-ui/checkbox@5.0.0-canary.5
  - @hi-ui/drawer@5.0.0-canary.7
  - @hi-ui/empty-state@5.0.0-canary.5
  - @hi-ui/icon-button@5.0.0-canary.4
  - @hi-ui/loading@5.0.0-canary.6
  - @hi-ui/pagination@5.0.0-canary.7
  - @hi-ui/popper@5.0.0-canary.8
  - @hi-ui/radio@5.0.0-canary.5
  - @hi-ui/scrollbar@5.0.0-canary.5
  - @hi-ui/core@5.0.0-canary.5
  - @hi-ui/icons@5.0.0-canary.5
  - @hi-ui/spinner@5.0.0-canary.5

## 5.0.0-canary.18

### Patch Changes

- b265f3a8d: <br />
  - fix(table): 修改表格在外层是 scale 时导致列宽计算有误的问题 (5.0)
  - fix(loading): 修改 loading size 类型，移除 xs 尺寸 (5.0)
- Updated dependencies [b265f3a8d]
  - @hi-ui/loading@5.0.0-canary.5

## 5.0.0-canary.17

### Patch Changes

- 399ea1f0e: <br>
  - perf(table): 优化列宽更新逻辑，当 columns 长度和 dataKey、width 发生变化时，重新计算列宽 (5.0)
  - fix(table): 用于计算真实列宽的行节点，考虑单元格合并的场景 (5.0)
  - fix(table): 修复 stretchHeight 模式下高度变化时虚拟表格高度没有更新问题 (5.0)
- Updated dependencies [13a222d13]
- Updated dependencies [839ffd6d8]
  - @hi-ui/select@5.0.0-canary.12
  - @hi-ui/pagination@5.0.0-canary.6

## 5.0.0-canary.16

### Minor Changes

- 6160bdc73: feat(table): TableColumnItem 支持泛型 (5.0)

### Patch Changes

- Updated dependencies [9fa354f31]
  - @hi-ui/button@5.0.0-canary.9

## 5.0.0-canary.15

### Patch Changes

- 6e274310f: fix(table): 优化列宽设置逻辑，确保在列变化时准确计算并更新列宽 (#3327)
- df353062b: fix(table): 修复设置 scrollbar 后冻结列失效问题 (#3329)
- Updated dependencies [75a3d93a9]
  - @hi-ui/drawer@5.0.0-canary.6

## 5.0.0-canary.14

### Minor Changes

- 6316a318e: feat(table): 添加 fixedToRow 功能，支持设置行固定到顶部或底部 (#3304)

### Patch Changes

- Updated dependencies [4dc72a186]
  - @hi-ui/popper@5.0.0-canary.7

## 5.0.0-canary.13

### Patch Changes

- 864c3a54e: fix(table): 优化 useColSorter 钩子，移除不必要的 columnsLatestRef 引用，直接使用 columns 进行排序计算 (5.0)

## 5.0.0-canary.12

### Minor Changes

- a067ee087: feat(table): 支持远程排序 (5.0)

### Patch Changes

- Updated dependencies [efce04a26]
- Updated dependencies [9106dca82]
  - @hi-ui/checkbox@5.0.0-canary.3
  - @hi-ui/popper@5.0.0-canary.6
  - @hi-ui/radio@5.0.0-canary.4
  - @hi-ui/select@5.0.0-canary.9
  - @hi-ui/core@5.0.0-canary.3
  - @hi-ui/icons@5.0.0-canary.3
  - @hi-ui/button@5.0.0-canary.8
  - @hi-ui/drawer@5.0.0-canary.5
  - @hi-ui/empty-state@5.0.0-canary.3
  - @hi-ui/icon-button@5.0.0-canary.3
  - @hi-ui/loading@5.0.0-canary.3
  - @hi-ui/pagination@5.0.0-canary.5
  - @hi-ui/scrollbar@5.0.0-canary.4
  - @hi-ui/spinner@5.0.0-canary.3

## 5.0.0-canary.11

### Patch Changes

- e5b589b86: chore(table): export SettingDrawer types (5.0)

## 5.0.0-canary.10

### Patch Changes

- fc1360986: fix(table): 更新 useTable 逻辑以确保滚动位置不超出表格宽度，并添加 @hi-ui/radio 依赖

## 5.0.0-canary.9

### Patch Changes

- fix(table): 修复 resizable 模式下列宽计算问题 (5.0)
- Updated dependencies [bf65028e6]
  - @hi-ui/button@5.0.0-canary.7
  - @hi-ui/popper@5.0.0-canary.4

## 5.0.0-canary.8

### Minor Changes

- ca7a945fe: feat(table): TableColumnItem 类型增加 minWidth 参数 (#3216)

### Patch Changes

- Updated dependencies [756473045]
- Updated dependencies [b4cecde83]
  - @hi-ui/scrollbar@5.0.0-canary.3
  - @hi-ui/button@5.0.0-canary.6

## 5.0.0-canary.7

### Patch Changes

- chore: rebase master (5.0)
- Updated dependencies
  - @hi-ui/core@5.0.0-canary.2
  - @hi-ui/use-cache@5.0.0-canary.2
  - @hi-ui/use-check@5.0.0-canary.2
  - @hi-ui/use-check-state@5.0.0-canary.2
  - @hi-ui/use-drag-sorter@5.0.0-canary.2
  - @hi-ui/use-latest@5.0.0-canary.2
  - @hi-ui/use-toggle@5.0.0-canary.2
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.2
  - @hi-ui/use-update-effect@5.0.0-canary.2
  - @hi-ui/icons@5.0.0-canary.2
  - @hi-ui/button@5.0.0-canary.5
  - @hi-ui/checkbox@5.0.0-canary.2
  - @hi-ui/drawer@5.0.0-canary.4
  - @hi-ui/empty-state@5.0.0-canary.2
  - @hi-ui/icon-button@5.0.0-canary.2
  - @hi-ui/loading@5.0.0-canary.2
  - @hi-ui/pagination@5.0.0-canary.4
  - @hi-ui/popper@5.0.0-canary.3
  - @hi-ui/scrollbar@5.0.0-canary.2
  - @hi-ui/select@5.0.0-canary.7
  - @hi-ui/spinner@5.0.0-canary.2
  - @hi-ui/array-utils@5.0.0-canary.2
  - @hi-ui/classname@5.0.0-canary.2
  - @hi-ui/dom-utils@5.0.0-canary.2
  - @hi-ui/env@5.0.0-canary.2
  - @hi-ui/func-utils@5.0.0-canary.2
  - @hi-ui/object-utils@5.0.0-canary.2
  - @hi-ui/react-utils@5.0.0-canary.2
  - @hi-ui/times@5.0.0-canary.2
  - @hi-ui/tree-utils@5.0.0-canary.2
  - @hi-ui/type-assertion@5.0.0-canary.2

## 5.0.0-canary.6

### Patch Changes

- ba7c324c2: style: 统一调整组件 shadow (5.0)
- 4b09e728b: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- Updated dependencies [ba7c324c2]
- Updated dependencies [4b09e728b]
- Updated dependencies [ba7c324c2]
  - @hi-ui/drawer@5.0.0-canary.3
  - @hi-ui/core@5.0.0-canary.1
  - @hi-ui/use-cache@5.0.0-canary.1
  - @hi-ui/use-check@5.0.0-canary.1
  - @hi-ui/use-check-state@5.0.0-canary.1
  - @hi-ui/use-drag-sorter@5.0.0-canary.1
  - @hi-ui/use-latest@5.0.0-canary.1
  - @hi-ui/use-toggle@5.0.0-canary.1
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.1
  - @hi-ui/use-update-effect@5.0.0-canary.1
  - @hi-ui/icons@5.0.0-canary.1
  - @hi-ui/button@5.0.0-canary.4
  - @hi-ui/checkbox@5.0.0-canary.1
  - @hi-ui/empty-state@5.0.0-canary.1
  - @hi-ui/icon-button@5.0.0-canary.1
  - @hi-ui/loading@5.0.0-canary.1
  - @hi-ui/pagination@5.0.0-canary.3
  - @hi-ui/popper@5.0.0-canary.2
  - @hi-ui/scrollbar@5.0.0-canary.1
  - @hi-ui/select@5.0.0-canary.6
  - @hi-ui/spinner@5.0.0-canary.1
  - @hi-ui/array-utils@5.0.0-canary.1
  - @hi-ui/classname@5.0.0-canary.1
  - @hi-ui/dom-utils@5.0.0-canary.1
  - @hi-ui/env@5.0.0-canary.1
  - @hi-ui/func-utils@5.0.0-canary.1
  - @hi-ui/object-utils@5.0.0-canary.1
  - @hi-ui/react-utils@5.0.0-canary.1
  - @hi-ui/times@5.0.0-canary.1
  - @hi-ui/tree-utils@5.0.0-canary.1
  - @hi-ui/type-assertion@5.0.0-canary.1

## 5.0.0-canary.5

### Patch Changes

- a89b3b3ae: fix: 修改组件问题 (5.0)
- Updated dependencies [a89b3b3ae]
  - @hi-ui/select@5.0.0-canary.4

## 5.0.0-canary.4

### Patch Changes

- c3a7005b0: style: 修改 UI 问题 (5.0)

## 5.0.0-canary.3

### Minor Changes

- 870279eff: feat(table): add stretchHeight api (5.0)

## 5.0.0-canary.2

### Patch Changes

- 3cb3377dc: style: 修改样式问题 (5.0)
- Updated dependencies [3cb3377dc]
- Updated dependencies [df3615e78]
  - @hi-ui/button@5.0.0-canary.2
  - @hi-ui/pagination@5.0.0-canary.2
  - @hi-ui/select@5.0.0-canary.3

## 5.0.0-canary.1

### Patch Changes

- 3903bd4ff: chore: 将代码中 v4 改为 v5 (5.0)
- 3903bd4ff: fix: 修复 5.0 UI 问题 (5.0)
- Updated dependencies [3903bd4ff]
  - @hi-ui/button@5.0.0-canary.1
  - @hi-ui/drawer@5.0.0-canary.1
  - @hi-ui/pagination@5.0.0-canary.1

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Patch Changes

- 4e00fda45: <br>
  - fix(table): 标题去掉背景，头部加上边框 (5.0)
  - fix(table): 单元格间距调整 & 设置最小高度 (5.0)
  - fix(table): 不同尺寸修改 (5.0)
- Updated dependencies [f70601635]
- Updated dependencies [428716024]
- Updated dependencies [225ebaa51]
- Updated dependencies [9d3e4f910]
- Updated dependencies [192de8767]
- Updated dependencies [428716024]
- Updated dependencies [0608199b4]
  - @hi-ui/button@5.0.0-canary.0
  - @hi-ui/select@5.0.0-canary.0
  - @hi-ui/core@5.0.0-canary.0
  - @hi-ui/use-cache@5.0.0-canary.0
  - @hi-ui/use-check@5.0.0-canary.0
  - @hi-ui/use-check-state@5.0.0-canary.0
  - @hi-ui/use-drag-sorter@5.0.0-canary.0
  - @hi-ui/use-latest@5.0.0-canary.0
  - @hi-ui/use-toggle@5.0.0-canary.0
  - @hi-ui/use-uncontrolled-state@5.0.0-canary.0
  - @hi-ui/use-update-effect@5.0.0-canary.0
  - @hi-ui/icons@5.0.0-canary.0
  - @hi-ui/checkbox@5.0.0-canary.0
  - @hi-ui/drawer@5.0.0-canary.0
  - @hi-ui/empty-state@5.0.0-canary.0
  - @hi-ui/icon-button@5.0.0-canary.0
  - @hi-ui/loading@5.0.0-canary.0
  - @hi-ui/pagination@5.0.0-canary.0
  - @hi-ui/popper@5.0.0-canary.0
  - @hi-ui/scrollbar@5.0.0-canary.0
  - @hi-ui/spinner@5.0.0-canary.0
  - @hi-ui/array-utils@5.0.0-canary.0
  - @hi-ui/classname@5.0.0-canary.0
  - @hi-ui/dom-utils@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0
  - @hi-ui/func-utils@5.0.0-canary.0
  - @hi-ui/object-utils@5.0.0-canary.0
  - @hi-ui/react-utils@5.0.0-canary.0
  - @hi-ui/times@5.0.0-canary.0
  - @hi-ui/tree-utils@5.0.0-canary.0
  - @hi-ui/type-assertion@5.0.0-canary.0

## 4.10.0

### Minor Changes

- [#3093](https://github.com/XiaoMi/hiui/pull/3093) [`8192dc3c0`](https://github.com/XiaoMi/hiui/commit/8192dc3c06a5299165fcad1a05f291b994384e3f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(table): 列排序支持设置默认排序顺序和受控模式 (#3091)

### Patch Changes

- [#3105](https://github.com/XiaoMi/hiui/pull/3105) [`af5207873`](https://github.com/XiaoMi/hiui/commit/af5207873a2e1187a95b00d2c5f64658eb210086) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(table): 修复虚拟表格下自定义行和单元格样式无效问题 (#3100)

## 4.9.2

### Patch Changes

- [#3086](https://github.com/XiaoMi/hiui/pull/3086) [`1596605`](https://github.com/XiaoMi/hiui/commit/159660554b4c26aa2d2bbc36d0c14f69584e6389) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(table): 修复表头分组下设置列排序无效问题 (#3085)

## 4.9.1

### Patch Changes

- [#3083](https://github.com/XiaoMi/hiui/pull/3083) [`28dfa39`](https://github.com/XiaoMi/hiui/commit/28dfa390a9870432b597cc01107f25090651e689) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(table): 修复空状态下设置边框左边框不显示问题 (#3082)

- Updated dependencies [[`a8a4a7ecf`](https://github.com/XiaoMi/hiui/commit/a8a4a7ecf9fe056a9a16d03641b297bb01b17970)]:
  - @hi-ui/drawer@4.3.1

## 4.9.0

### Minor Changes

- [#3052](https://github.com/XiaoMi/hiui/pull/3052) [`a3ef6ac6e`](https://github.com/XiaoMi/hiui/commit/a3ef6ac6e3361c8bd1a0e3c12d7e4204dcbbf5f6) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(table): add tableWidthAdjustOnResize api (#3046)

- [#3045](https://github.com/XiaoMi/hiui/pull/3045) [`26a081f0a`](https://github.com/XiaoMi/hiui/commit/26a081f0a51efb1d2b8f69720d28818e04b3b24a) Thanks [@fcppddl](https://github.com/fcppddl)! - feat(table): 虚拟列表下，支持设置滚动位置(#3044)

### Patch Changes

- Updated dependencies [[`cc8c3a263`](https://github.com/XiaoMi/hiui/commit/cc8c3a263357069626c0ed9e2f2d50a3f24615af)]:
  - @hi-ui/pagination@4.2.0

## 4.8.0

### Minor Changes

- [#3033](https://github.com/XiaoMi/hiui/pull/3033) [`17158fa6e`](https://github.com/XiaoMi/hiui/commit/17158fa6e286a560aeb9fd65d68856c2e7a00736) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(table): 支持表头列合并 (#3032)

- [#2978](https://github.com/XiaoMi/hiui/pull/2978) [`f807f7dda`](https://github.com/XiaoMi/hiui/commit/f807f7ddae07184a0584e16d017a3d9f5785d4b8) Thanks [@fcppddl](https://github.com/fcppddl)! - feat(table): 将表格中的交互统一加上回调事件 (#2977)

- [#3034](https://github.com/XiaoMi/hiui/pull/3034) [`83be3c14b`](https://github.com/XiaoMi/hiui/commit/83be3c14b9e8cd3e73ec477895a47b925439a3a5) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(table): SettingDrawer 增加 onReset api (#3021)

### Patch Changes

- Updated dependencies [[`241447e14`](https://github.com/XiaoMi/hiui/commit/241447e148f4544c6a08623d60d977e286ec9d64), [`b2d784b23`](https://github.com/XiaoMi/hiui/commit/b2d784b23682e70cbc7b09e3396f51fda02e2223)]:
  - @hi-ui/scrollbar@4.2.0
  - @hi-ui/select@4.6.0

## 4.7.0

### Minor Changes

- [#3008](https://github.com/XiaoMi/hiui/pull/3008) [`e9aadf1fb`](https://github.com/XiaoMi/hiui/commit/e9aadf1fba8896af3bf4ccaa747283ea96be6b81) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: virtual 模式增加 onVisibleChange api

- [#3008](https://github.com/XiaoMi/hiui/pull/3008) [`e9aadf1fb`](https://github.com/XiaoMi/hiui/commit/e9aadf1fba8896af3bf4ccaa747283ea96be6b81) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: Add onResizeStop api

### Patch Changes

- [#3007](https://github.com/XiaoMi/hiui/pull/3007) [`9b9a44826`](https://github.com/XiaoMi/hiui/commit/9b9a448262f9a6c89af78db008bc16430f495aff) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复合并单元格边框样式问题

## 4.6.1

### Patch Changes

- [#2997](https://github.com/XiaoMi/hiui/pull/2997) [`0b7182591`](https://github.com/XiaoMi/hiui/commit/0b71825914510dedf25d64489f7ba2cdcf69917d) Thanks [@zyprepare](https://github.com/zyprepare)! - style: 优化 resizable 模式下列 hover 时样式

## 4.6.0

### Minor Changes

- [#2968](https://github.com/XiaoMi/hiui/pull/2968) [`6ed4e8eeb`](https://github.com/XiaoMi/hiui/commit/6ed4e8eeb1edb97ed23aa3d5366f993575a6df57) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 行选中增加单选

## 4.5.5

### Patch Changes

- [#2867](https://github.com/XiaoMi/hiui/pull/2867) [`eec624313`](https://github.com/XiaoMi/hiui/commit/eec624313de88943869f592dd06248455bddedbc) Thanks [@aqiusen](https://github.com/aqiusen)! - 修复统计行中选中模式下显示异常问题(#2863)

- [#2859](https://github.com/XiaoMi/hiui/pull/2859) [`a8d3a1f26`](https://github.com/XiaoMi/hiui/commit/a8d3a1f2687709b986fc54408cb6c69b9eb56318) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 onDragStart 事件不触发问题

- [#2847](https://github.com/XiaoMi/hiui/pull/2847) [`0e67d2263`](https://github.com/XiaoMi/hiui/commit/0e67d2263c7e1bf9213e1a2f74300ee201f3a52e) Thanks [@aqiusen](https://github.com/aqiusen)! - fix(table): 修复虚拟列表 maxHeight 无法支持字符串问题

- Updated dependencies [[`5508758ec`](https://github.com/XiaoMi/hiui/commit/5508758ec2fe241d635949828065111c9a465ef8)]:
  - @hi-ui/pagination@4.0.16

## 4.5.4

### Patch Changes

- [#2839](https://github.com/XiaoMi/hiui/pull/2839) [`e8498f36e`](https://github.com/XiaoMi/hiui/commit/e8498f36efe4dd42e0ef26c2e4c60298e2ce0147) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 columns 中将 title 设置为空字符串报错

- [#2840](https://github.com/XiaoMi/hiui/pull/2840) [`c2afbaf33`](https://github.com/XiaoMi/hiui/commit/c2afbaf337dc933aa3858187e0010255ee2b82d5) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复同时设置 fieldKey 和 rowSelection 时 onChange 回调参数异常问题

- Updated dependencies [[`3afbf239e`](https://github.com/XiaoMi/hiui/commit/3afbf239e816ede48d6a85cbd99b6b099b8c8eb3), [`613c15a41`](https://github.com/XiaoMi/hiui/commit/613c15a41d783b86d86ccfb1dccd4da897e5ba9c), [`5d531802b`](https://github.com/XiaoMi/hiui/commit/5d531802ba9b142d448a2de2a7a8315722be0af8)]:
  - @hi-ui/env@4.0.7
  - @hi-ui/select@4.4.2

## 4.5.3

### Patch Changes

- [#2817](https://github.com/XiaoMi/hiui/pull/2817) [`c32ae3dd9`](https://github.com/XiaoMi/hiui/commit/c32ae3dd9b5a89840270649fc397d474e9e1de4b) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复表头分组单元格边框显示问题

## 4.5.2

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- [#2790](https://github.com/XiaoMi/hiui/pull/2790) [`86a096b03`](https://github.com/XiaoMi/hiui/commit/86a096b031e42622714c4147ea99d2867baddfda) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复全选时 onChange 第 4 个参数返回 undefined 问题

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/button@4.0.10
  - @hi-ui/checkbox@4.0.10
  - @hi-ui/drawer@4.1.4
  - @hi-ui/empty-state@4.1.1
  - @hi-ui/icon-button@4.0.9
  - @hi-ui/loading@4.2.1
  - @hi-ui/pagination@4.0.15
  - @hi-ui/popper@4.1.5
  - @hi-ui/scrollbar@4.1.1
  - @hi-ui/select@4.4.1
  - @hi-ui/spinner@4.0.9
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.5.1

### Patch Changes

- [#2760](https://github.com/XiaoMi/hiui/pull/2760) [`68afb78ed`](https://github.com/XiaoMi/hiui/commit/68afb78ed1fb8e42bc8eec68cfa5f1787ee052b0) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 Safari 中设置 virtual 后只能表头滚动问题

- [#2759](https://github.com/XiaoMi/hiui/pull/2759) [`7437ca3b0`](https://github.com/XiaoMi/hiui/commit/7437ca3b07ce1fb66fe9fa3572b45c2928e64a73) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 SettingDrawer 列更新问题

## 4.5.0

### Minor Changes

- [#2735](https://github.com/XiaoMi/hiui/pull/2735) [`a2b9df50b`](https://github.com/XiaoMi/hiui/commit/a2b9df50b454ae033a5dd0e5f6165ab2f6de07a5) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 设置 rowSelection 后默认冻结该列

- [#2735](https://github.com/XiaoMi/hiui/pull/2735) [`81863f522`](https://github.com/XiaoMi/hiui/commit/81863f52200213ae7740f496c4fe8d73f607b66c) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: setting 增加 trigger 配置

### Patch Changes

- [#2726](https://github.com/XiaoMi/hiui/pull/2726) [`459c7940c`](https://github.com/XiaoMi/hiui/commit/459c7940cc94b124e182754474424e13de9f120a) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复双表格结构下，无法设置空状态内容问题

- [#2735](https://github.com/XiaoMi/hiui/pull/2735) [`6ac546d3e`](https://github.com/XiaoMi/hiui/commit/6ac546d3e9c1b863fb30941dd365220fa138258a) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复虚拟表格设置 maxHeight 底部内容被遮挡问题

- [#2735](https://github.com/XiaoMi/hiui/pull/2735) [`b971c0b06`](https://github.com/XiaoMi/hiui/commit/b971c0b06b1c64dd72c79c23068c4fed684d97c3) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复同时设置 bordered 和 scrollbar 后滚动异常问题

- [#2735](https://github.com/XiaoMi/hiui/pull/2735) [`a2b9df50b`](https://github.com/XiaoMi/hiui/commit/a2b9df50b454ae033a5dd0e5f6165ab2f6de07a5) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(table): 设置 rowSelection 后默认冻结该列

- [#2748](https://github.com/XiaoMi/hiui/pull/2748) [`ca008e4ae`](https://github.com/XiaoMi/hiui/commit/ca008e4ae9753bc1f11efcdcbf09121d1ef07b56) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复表头分组超过 2 列时冻结列交互异常问题

- [#2735](https://github.com/XiaoMi/hiui/pull/2735) [`528314e46`](https://github.com/XiaoMi/hiui/commit/528314e46173dd18cc0140e60e763cb84b52fa2c) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复设置 dataSource 组件首次会执行 2 次请求问题

- [#2747](https://github.com/XiaoMi/hiui/pull/2747) [`b5654408e`](https://github.com/XiaoMi/hiui/commit/b5654408ee33b6448b6e9f1297a2790a486d753f) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 监听列变化,更新列最小可调整宽度

- Updated dependencies [[`a9b9c93fc`](https://github.com/XiaoMi/hiui/commit/a9b9c93fc3a3fea60d14052a5afeef9daf7efa1b), [`ca008e4ae`](https://github.com/XiaoMi/hiui/commit/ca008e4ae9753bc1f11efcdcbf09121d1ef07b56)]:
  - @hi-ui/select@4.3.0
  - @hi-ui/tree-utils@4.1.6

## 4.4.1

### Patch Changes

- [#2722](https://github.com/XiaoMi/hiui/pull/2722) [`a25261a88`](https://github.com/XiaoMi/hiui/commit/a25261a884f9b3470924c29564b3c4758ebab6cf) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复空状态下横向滚动条问题

- Updated dependencies [[`a25261a88`](https://github.com/XiaoMi/hiui/commit/a25261a884f9b3470924c29564b3c4758ebab6cf)]:
  - @hi-ui/checkbox@4.0.9

## 4.4.0

### Minor Changes

- [#2699](https://github.com/XiaoMi/hiui/pull/2699) [`6c5d9c7ed`](https://github.com/XiaoMi/hiui/commit/6c5d9c7ed21eaebc26638ba6ee54eb3bfe918af4) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add fixed and rowClassName api
  feat: SettingDrawer 增加 extraHeader showCheckAll itemRender api
  fix: 修复边框模式下样式问题
  feat: SettingDrawer 支持配置列是否禁止拖拽
  fix: 修复 resize 模式下多选时宽度被重置问题
  fix: 修复树形表格节点图标没有对齐问题
  fix: 修复虚拟表格边框样式问题
  fix: 修复虚拟表格下双滚动条问题
  fix: 修复虚拟表格下 size 和 maxHeight 失效问题

### Patch Changes

- Updated dependencies [[`4ec059bad`](https://github.com/XiaoMi/hiui/commit/4ec059badc67f3facc98288f3e7a67f51938e40f), [`ffd47b89a`](https://github.com/XiaoMi/hiui/commit/ffd47b89a5d7da54ea717fa827123e9c3b2b6d0f), [`cfc37dc37`](https://github.com/XiaoMi/hiui/commit/cfc37dc37c83ce737d88262644c07ca23cde0731), [`2fa5ee5b6`](https://github.com/XiaoMi/hiui/commit/2fa5ee5b6ecc7f95a5224fd91ccfcd263b41d932), [`9cf8e079f`](https://github.com/XiaoMi/hiui/commit/9cf8e079fd3f342d851d7abfecc1c0447c3ac40b)]:
  - @hi-ui/loading@4.2.0
  - @hi-ui/empty-state@4.1.0
  - @hi-ui/tree-utils@4.1.5
  - @hi-ui/scrollbar@4.1.0

## 4.3.4

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-cache@4.0.4
  - @hi-ui/use-check@4.0.5
  - @hi-ui/use-check-state@4.0.4
  - @hi-ui/use-drag-sorter@4.0.4
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/use-toggle@4.0.4
  - @hi-ui/use-uncontrolled-state@4.0.4
  - @hi-ui/use-update-effect@4.0.4
  - @hi-ui/icons@4.0.18
  - @hi-ui/button@4.0.9
  - @hi-ui/checkbox@4.0.8
  - @hi-ui/drawer@4.1.3
  - @hi-ui/empty-state@4.0.7
  - @hi-ui/icon-button@4.0.8
  - @hi-ui/loading@4.1.3
  - @hi-ui/pagination@4.0.14
  - @hi-ui/popper@4.1.3
  - @hi-ui/select@4.2.5
  - @hi-ui/spinner@4.0.8
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/object-utils@4.0.4
  - @hi-ui/react-utils@4.0.4
  - @hi-ui/times@4.0.4
  - @hi-ui/tree-utils@4.1.4
  - @hi-ui/type-assertion@4.0.4

## 4.3.3

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-cache@4.0.3
  - @hi-ui/use-check@4.0.4
  - @hi-ui/use-check-state@4.0.3
  - @hi-ui/use-drag-sorter@4.0.3
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/use-toggle@4.0.3
  - @hi-ui/use-uncontrolled-state@4.0.3
  - @hi-ui/use-update-effect@4.0.3
  - @hi-ui/icons@4.0.17
  - @hi-ui/button@4.0.8
  - @hi-ui/checkbox@4.0.7
  - @hi-ui/drawer@4.1.2
  - @hi-ui/empty-state@4.0.6
  - @hi-ui/icon-button@4.0.7
  - @hi-ui/loading@4.1.2
  - @hi-ui/pagination@4.0.13
  - @hi-ui/popper@4.1.2
  - @hi-ui/select@4.2.4
  - @hi-ui/spinner@4.0.7
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/object-utils@4.0.3
  - @hi-ui/react-utils@4.0.3
  - @hi-ui/times@4.0.3
  - @hi-ui/tree-utils@4.1.3
  - @hi-ui/type-assertion@4.0.3

## 4.3.2

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- [#2671](https://github.com/XiaoMi/hiui/pull/2671) [`6d7909444`](https://github.com/XiaoMi/hiui/commit/6d790944418f36689b34805f858a1268530864b9) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复组件参数类型错误

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-cache@4.0.2
  - @hi-ui/use-check@4.0.3
  - @hi-ui/use-check-state@4.0.2
  - @hi-ui/use-drag-sorter@4.0.2
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/use-toggle@4.0.2
  - @hi-ui/use-uncontrolled-state@4.0.2
  - @hi-ui/use-update-effect@4.0.2
  - @hi-ui/icons@4.0.16
  - @hi-ui/button@4.0.7
  - @hi-ui/checkbox@4.0.6
  - @hi-ui/drawer@4.1.1
  - @hi-ui/empty-state@4.0.5
  - @hi-ui/icon-button@4.0.6
  - @hi-ui/loading@4.1.1
  - @hi-ui/pagination@4.0.12
  - @hi-ui/popper@4.1.1
  - @hi-ui/select@4.2.3
  - @hi-ui/spinner@4.0.6
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/object-utils@4.0.2
  - @hi-ui/react-utils@4.0.2
  - @hi-ui/times@4.0.2
  - @hi-ui/tree-utils@4.1.2
  - @hi-ui/type-assertion@4.0.2

## 4.3.1

### Patch Changes

- [#2654](https://github.com/XiaoMi/hiui/pull/2654) [`dc002a32a`](https://github.com/XiaoMi/hiui/commit/dc002a32a2c6f538b0df37c63d34f603647d9b70) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 scrollbar 参数,用于在 Windows 环境下优化滚动条样式

- Updated dependencies [[`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315)]:
  - @hi-ui/button@4.0.6
  - @hi-ui/icon-button@4.0.5
  - @hi-ui/pagination@4.0.11

## 4.3.0

### Minor Changes

- [#2642](https://github.com/XiaoMi/hiui/pull/2642) [`74d8c5148`](https://github.com/XiaoMi/hiui/commit/74d8c51489ae7a88c90b1426e9da118125579b97) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 将之前的双表格结构优化成单表格,冻结列和表头吸顶等场景依然采用双表格结构

- [#2647](https://github.com/XiaoMi/hiui/pull/2647) [`8767c9470`](https://github.com/XiaoMi/hiui/commit/8767c94702fdc697207001f639508907e20fc6a5) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add footerRender api

### Patch Changes

- [#2648](https://github.com/XiaoMi/hiui/pull/2648) [`54387a81e`](https://github.com/XiaoMi/hiui/commit/54387a81e1c6add77e791af8d849a6518077afd5) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 优化 resizable 模式下可调整的最小宽度

- Updated dependencies [[`4f7c8c906`](https://github.com/XiaoMi/hiui/commit/4f7c8c9063d9b72068a2db5fa614eed130aafd0f)]:
  - @hi-ui/select@4.2.2

## 4.2.0

### Minor Changes

- [#2597](https://github.com/XiaoMi/hiui/pull/2597) [`0ddf24960`](https://github.com/XiaoMi/hiui/commit/0ddf24960194fdd15653e34e0a6cef54b1586748) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: axios 升级为 1.5.0

### Patch Changes

- [#2608](https://github.com/XiaoMi/hiui/pull/2608) [`fb9b1281d`](https://github.com/XiaoMi/hiui/commit/fb9b1281d99ba0d21b5cb32c87b5e671272c1c8e) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复紧凑模式下多选项间距问题

- Updated dependencies [[`b3b36813a`](https://github.com/XiaoMi/hiui/commit/b3b36813a6968c5c96c39d1100935372e3aa5b4d)]:
  - @hi-ui/select@4.2.0

## 4.1.2

### Patch Changes

- [#2572](https://github.com/XiaoMi/hiui/pull/2572) [`eee5e6d16`](https://github.com/XiaoMi/hiui/commit/eee5e6d1658685a6119b5aa40038c572145b3b4e) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 表格性能优化

- Updated dependencies [[`937052db3`](https://github.com/XiaoMi/hiui/commit/937052db36ecfa50fef53df13d159bee0d08fa41), [`ccb1eec12`](https://github.com/XiaoMi/hiui/commit/ccb1eec122a33466536b365d443f175d1e16dc86), [`eee5e6d16`](https://github.com/XiaoMi/hiui/commit/eee5e6d1658685a6119b5aa40038c572145b3b4e)]:
  - @hi-ui/icons@4.0.14
  - @hi-ui/popper@4.1.0
  - @hi-ui/tree-utils@4.1.1

## 4.1.1

### Patch Changes

- [#2557](https://github.com/XiaoMi/hiui/pull/2557) [`ef7aae038`](https://github.com/XiaoMi/hiui/commit/ef7aae038362d3a7700611737c474c29d1ba07b4) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: maxHeight 支持表达式

- [#2558](https://github.com/XiaoMi/hiui/pull/2558) [`bdd913d71`](https://github.com/XiaoMi/hiui/commit/bdd913d7173de64952437014ab9ffd1947ed506c) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加树形结构排序

- Updated dependencies [[`bdd913d71`](https://github.com/XiaoMi/hiui/commit/bdd913d7173de64952437014ab9ffd1947ed506c)]:
  - @hi-ui/tree-utils@4.1.0

## 4.1.0

### Minor Changes

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: rowSelection onChange 回调增加已选数据集合参数

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加虚拟滚动功能

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 dataSource 功能

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 列设置增加 checkDisabledColKeys api,用于禁用列选择操作

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add SettingDrawer component

### Patch Changes

- [#2474](https://github.com/XiaoMi/hiui/pull/2474) [`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 数据排序样式不对

- [#2473](https://github.com/XiaoMi/hiui/pull/2473) [`3d5f9ba15`](https://github.com/XiaoMi/hiui/commit/3d5f9ba15868ccdc385cdcdc8a3bbe2e55542b39) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 sonarcloud 扫描的 Bugs

- Updated dependencies [[`e95268aa4`](https://github.com/XiaoMi/hiui/commit/e95268aa4af48edaaa9f6afcf5a262342a550cd1)]:
  - @hi-ui/loading@4.1.0

## 4.0.13

### Patch Changes

- [#2315](https://github.com/XiaoMi/hiui/pull/2315) [`551ab0b73`](https://github.com/XiaoMi/hiui/commit/551ab0b734e00d1e0ca170c9a87f316aa4197762) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复设置 size 后,空状态会出现滚动条问题
