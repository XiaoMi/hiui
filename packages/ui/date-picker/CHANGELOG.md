# @hi-ui/date-picker

## 5.0.0-canary.23

### Patch Changes

- 22db9cf70: style: fix ui bug (5.0)
- Updated dependencies [d97cc24eb]
- Updated dependencies [1f9c6e335]
- Updated dependencies [22db9cf70]
  - @hi-ui/popper@5.0.0-canary.9
  - @hi-ui/core@5.0.0-canary.6
  - @hi-ui/button@5.0.0-canary.12
  - @hi-ui/time-picker@5.0.0-canary.15

## 5.0.0-canary.22

### Minor Changes

- 922686dcc: feat(global-context): 增加 size api 全局配置 (5.0)

### Patch Changes

- 86877b241: style: 修改样式问题 (5.0)
- 0de8163de: style(date-picker, time-picker): 修改禁用时的样式 (5.0)
- Updated dependencies [86877b241]
- Updated dependencies [922686dcc]
- Updated dependencies [8e969ad73]
- Updated dependencies [0de8163de]
  - @hi-ui/button@5.0.0-canary.11
  - @hi-ui/popper@5.0.0-canary.8
  - @hi-ui/time-picker@5.0.0-canary.14
  - @hi-ui/core@5.0.0-canary.5
  - @hi-ui/icons@5.0.0-canary.5

## 5.0.0-canary.21

### Patch Changes

- 07a38d6f8: fix(date-picker): 加强 valueAdapter 逻辑处理，当值是数组并且是范围类型时，再做转换 (5.0)

## 5.0.0-canary.20

### Patch Changes

- fix(date-picker): 修复日期时间范围模式下,滑动选择时间时上面的时间无法选中问题 (5.0)

## 5.0.0-canary.19

### Minor Changes

- e97485c24: feat: 下拉选择组件增加 showIndicator 参数 & 修改 appearance 中的 unset 样式 (5.0)

### Patch Changes

- Updated dependencies [e97485c24]
  - @hi-ui/time-picker@5.0.0-canary.12

## 5.0.0-canary.18

### Patch Changes

- f7d6b062f: fix(date-picker): 修复在 showTime 模式下，选择时间后没有触发 onSelect 回调的问题 (5.0)

## 5.0.0-canary.17

### Patch Changes

- d34906c53: style(date-picker): 增加日期选择器输入框的溢出处理和文本省略样式 (5.0)
- eba118692: perf: 对下拉选择类组件的 customRender 的内容增加 memoization 以优化性能 (5.0)
- Updated dependencies [eaf6005e4]
  - @hi-ui/time-picker@5.0.0-canary.11

## 5.0.0-canary.16

### Patch Changes

- 7211244c0: fix(date-picker&time-picker): 修复在日期时间范围选择模式下，disabledHours 回调参数总数返回 single 的问题 (#3289)
- Updated dependencies [7211244c0]
- Updated dependencies [0eaaf1375]
- Updated dependencies [4dc72a186]
  - @hi-ui/time-picker@5.0.0-canary.10
  - @hi-ui/popper@5.0.0-canary.7

## 5.0.0-canary.15

### Patch Changes

- 19e0da371: style: 修改 appearance 为 unset 和 borderless 模式的样式 (5.0)
- Updated dependencies [19e0da371]
  - @hi-ui/time-picker@5.0.0-canary.9

## 5.0.0-canary.14

### Minor Changes

- 9106dca82: feat: 输入框和选择器组件增加 borderless 形态 (5.0)

### Patch Changes

- efce04a26: fix: 修改 UI 问题 (5.0)
- Updated dependencies [efce04a26]
- Updated dependencies [9106dca82]
  - @hi-ui/popper@5.0.0-canary.6
  - @hi-ui/core@5.0.0-canary.3
  - @hi-ui/time-picker@5.0.0-canary.8
  - @hi-ui/icons@5.0.0-canary.3
  - @hi-ui/button@5.0.0-canary.8

## 5.0.0-canary.13

### Patch Changes

- 34fc15f75: style: 修改样式问题 (5.0)
- Updated dependencies [34fc15f75]
  - @hi-ui/time-picker@5.0.0-canary.7

## 5.0.0-canary.12

### Patch Changes

- fix(date-picker): 修复日期范围无法传时间戳问题 (5.0)

## 5.0.0-canary.11

### Patch Changes

- b3a21e9cd: fix(date-picker): disabledDate 回调的时间参数加上 utcOffset 处理 (5.0)

## 5.0.0-canary.10

### Minor Changes

- 0d6cec005: feat(date-picker): add utcOffset api (#3232)

### Patch Changes

- Updated dependencies [7bc790804]
  - @hi-ui/popper@5.0.0-canary.5

## 5.0.0-canary.9

### Patch Changes

- b4cecde83: style: 修改样式 (5.0)
- Updated dependencies [f435959a3]
- Updated dependencies [b4cecde83]
  - @hi-ui/time-picker@5.0.0-canary.5
  - @hi-ui/button@5.0.0-canary.6

## 5.0.0-canary.8

### Patch Changes

- chore: rebase master (5.0)
- Updated dependencies
  - @hi-ui/core@5.0.0-canary.2
  - @hi-ui/icons@5.0.0-canary.2
  - @hi-ui/button@5.0.0-canary.5
  - @hi-ui/popper@5.0.0-canary.3
  - @hi-ui/time-picker@5.0.0-canary.4
  - @hi-ui/classname@5.0.0-canary.2
  - @hi-ui/env@5.0.0-canary.2
  - @hi-ui/object-utils@5.0.0-canary.2

## 5.0.0-canary.7

### Patch Changes

- ba7c324c2: style: 下拉框间距改为 4px (5.0)
- 4b09e728b: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- ba7c324c2: style: 统一调整选择类组件 hover 时的背景色 (5.0)
- Updated dependencies [ba7c324c2]
- Updated dependencies [4b09e728b]
- Updated dependencies [ba7c324c2]
  - @hi-ui/time-picker@5.0.0-canary.3
  - @hi-ui/core@5.0.0-canary.1
  - @hi-ui/icons@5.0.0-canary.1
  - @hi-ui/button@5.0.0-canary.4
  - @hi-ui/popper@5.0.0-canary.2
  - @hi-ui/classname@5.0.0-canary.1
  - @hi-ui/env@5.0.0-canary.1
  - @hi-ui/object-utils@5.0.0-canary.1

## 5.0.0-canary.6

### Patch Changes

- 40f819417: fix: 修复 UI 问题 (5.0)
- Updated dependencies [40f819417]
  - @hi-ui/button@5.0.0-canary.3
  - @hi-ui/time-picker@5.0.0-canary.2

## 5.0.0-canary.5

### Patch Changes

- 0c5923439: style: 修改样式问题 (5.0)
- Updated dependencies [0c5923439]
  - @hi-ui/time-picker@5.0.0-canary.1

## 5.0.0-canary.4

### Patch Changes

- c3a7005b0: style: 修改 UI 问题 (5.0)

## 5.0.0-canary.3

### Patch Changes

- 3cb3377dc: style: 修改样式问题 (5.0)
- Updated dependencies [3cb3377dc]
  - @hi-ui/button@5.0.0-canary.2

## 5.0.0-canary.2

### Patch Changes

- bb5b8150d: perf(date-picker): 优化 contained 模式下的点击事件交互&范围选择的交互优化 (5.0)

## 5.0.0-canary.1

### Minor Changes

- b98def710: feat(date-picker): appearance 参数增加 contained 类型 (5.0)

## 5.0.0-canary.0

### Major Changes

- 225ebaa51: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- 8f826800f: - fix(date-picker): 显示框圆角改为 6px (5.0)
  - feat(date-picker): 增加 xs 尺寸 (5.0)

### Patch Changes

- Updated dependencies [f70601635]
- Updated dependencies [225ebaa51]
- Updated dependencies [428716024]
  - @hi-ui/button@5.0.0-canary.0
  - @hi-ui/core@5.0.0-canary.0
  - @hi-ui/icons@5.0.0-canary.0
  - @hi-ui/popper@5.0.0-canary.0
  - @hi-ui/time-picker@5.0.0-canary.0
  - @hi-ui/classname@5.0.0-canary.0
  - @hi-ui/env@5.0.0-canary.0
  - @hi-ui/object-utils@5.0.0-canary.0

## 4.11.1

### Patch Changes

- [#3202](https://github.com/XiaoMi/hiui/pull/3202) [`0d006f890`](https://github.com/XiaoMi/hiui/commit/0d006f890d8c6d7c6064b8672c9dbc561173c1c0) Thanks [@fcppddl](https://github.com/fcppddl)! - fix(date-picker): DatePicker 组件 type 为 季度下无法选择年份(#3201)

- [`714637dfe`](https://github.com/XiaoMi/hiui/commit/714637dfee0f943ef497b2073e3c4f27dee35ecc) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(date-picker): 修复周选择面板周数显示异常问题 (#3209)

- Updated dependencies [[`80a909d2d`](https://github.com/XiaoMi/hiui/commit/80a909d2dae99d68d71f2ec6f4b210080d032ec0)]:
  - @hi-ui/popper@4.1.7

## 4.11.0

### Minor Changes

- [#3134](https://github.com/XiaoMi/hiui/pull/3134) [`e5ef01298`](https://github.com/XiaoMi/hiui/commit/e5ef012986e7d9e017f9547cdb24480e8fa682ae) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(date-picker): 添加可选的 visible 属性以控制日期选择器的显示状态 (#3131)

### Patch Changes

- [#3136](https://github.com/XiaoMi/hiui/pull/3136) [`5330d91b7`](https://github.com/XiaoMi/hiui/commit/5330d91b7c4713174857c38078baced790dc0431) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(date-picker): 在日期选择器中添加 onClose 回调 (#3133)

## 4.10.1

### Patch Changes

- [#3119](https://github.com/XiaoMi/hiui/pull/3119) [`9fac22a3d`](https://github.com/XiaoMi/hiui/commit/9fac22a3d47bc7df2d77fcfb472af9948c60dbdd) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(date-picker): 添加头部操作区域用户选择样式以改善交互体验 (#3117)

## 4.10.0

### Minor Changes

- [#3089](https://github.com/XiaoMi/hiui/pull/3089) [`9898157c4`](https://github.com/XiaoMi/hiui/commit/9898157c4d19a4492313f78d94440c4468b1f1a6) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(date-picker): 完善 footerRender 功能，footerRender 增加 onPick 回调，方便用户快速设置时间 (#3088)

### Patch Changes

- Updated dependencies [[`e9bcdb9`](https://github.com/XiaoMi/hiui/commit/e9bcdb9fbfdb8085a57b76a30bc9d8fd3ca8b923)]:
  - @hi-ui/time-picker@4.1.1

## 4.9.2

### Patch Changes

- [#3078](https://github.com/XiaoMi/hiui/pull/3078) [`30f90d924`](https://github.com/XiaoMi/hiui/commit/30f90d92475b8edb4e2c6762d70958d24ea8459e) Thanks [@fcppddl](https://github.com/fcppddl)! - perf(date-picker): 图标固定在右边 (#3077)

## 4.9.1

### Patch Changes

- [#3068](https://github.com/XiaoMi/hiui/pull/3068) [`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770) Thanks [@zyprepare](https://github.com/zyprepare)! - perf(date-picker): 范围选择交互优化 (#3055)

- Updated dependencies [[`69f8f07`](https://github.com/XiaoMi/hiui/commit/69f8f07006b4aeeea554de424389aeb93e0f1770)]:
  - @hi-ui/core@4.0.9

## 4.9.0

### Minor Changes

- [#3010](https://github.com/XiaoMi/hiui/pull/3010) [`b809ca9`](https://github.com/XiaoMi/hiui/commit/b809ca9bd59e5e2455b13fefe32d8307c8ab1d4a) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 新增自定义触发器

- [#3010](https://github.com/XiaoMi/hiui/pull/3010) [`b809ca9`](https://github.com/XiaoMi/hiui/commit/b809ca9bd59e5e2455b13fefe32d8307c8ab1d4a) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: Add needConfirm and onConfirm api

- [#3010](https://github.com/XiaoMi/hiui/pull/3010) [`b809ca9`](https://github.com/XiaoMi/hiui/commit/b809ca9bd59e5e2455b13fefe32d8307c8ab1d4a) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: onSelect 回调中增加 panelIndex 参数

## 4.8.0

### Minor Changes

- [#2834](https://github.com/XiaoMi/hiui/pull/2834) [`969abb849`](https://github.com/XiaoMi/hiui/commit/969abb8497e3c674c66827bd9057581c53e5f621) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: cellRender 增加 date 参数

## 4.7.0

### Minor Changes

- [#2905](https://github.com/XiaoMi/hiui/pull/2905) [`7ac6a76b4`](https://github.com/XiaoMi/hiui/commit/7ac6a76b46a4999bbc19935e82794a9279600c5a) Thanks [@yang-x20](https://github.com/yang-x20)! - feat: 新增前缀后缀内容扩展

### Patch Changes

- Updated dependencies [[`cfc6c971d`](https://github.com/XiaoMi/hiui/commit/cfc6c971d6b54ec93a87c72eb9a7a29fbfb68739)]:
  - @hi-ui/time-picker@4.1.0

## 4.6.4

### Patch Changes

- [#2854](https://github.com/XiaoMi/hiui/pull/2854) [`3585fd8fe`](https://github.com/XiaoMi/hiui/commit/3585fd8fe0797972277681caf153fdeb9dfe37c0) Thanks [@maoguoping](https://github.com/maoguoping)! - fix(date-picker): 修复预置农历下切换 1891 年以前组件报错问题 (#2611)

- [#2860](https://github.com/XiaoMi/hiui/pull/2860) [`b4945c38b`](https://github.com/XiaoMi/hiui/commit/b4945c38bdc98631b9d262b9a8e4e4319678bc71) Thanks [@maoguoping](https://github.com/maoguoping)! - fix(date-picker): 修复 datepicker 显示农历时 2 月中 1 月农历显示错误问题(#2853)

## 4.6.3

### Patch Changes

- [#2827](https://github.com/XiaoMi/hiui/pull/2827) [`9809ce813`](https://github.com/XiaoMi/hiui/commit/9809ce8132600cb7a3e8bb8537909bb3c3c9551b) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - fix: 修复 format 传入函数，只有在 type='weekrange'情况下生效

- Updated dependencies [[`3afbf239e`](https://github.com/XiaoMi/hiui/commit/3afbf239e816ede48d6a85cbd99b6b099b8c8eb3), [`494ebd982`](https://github.com/XiaoMi/hiui/commit/494ebd982d50a1bc57697effd8365adfa2d37132)]:
  - @hi-ui/env@4.0.7
  - @hi-ui/time-picker@4.0.15

## 4.6.2

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/icons@4.0.19
  - @hi-ui/button@4.0.10
  - @hi-ui/popper@4.1.5
  - @hi-ui/time-picker@4.0.14
  - @hi-ui/classname@4.0.5

## 4.6.1

### Patch Changes

- [#2762](https://github.com/XiaoMi/hiui/pull/2762) [`240d02ecc`](https://github.com/XiaoMi/hiui/commit/240d02ecc7e8974dec6c42303212795f63bfb8b9) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复受控模式下设置 showTime 后 Input 框没有实时显示选择的值问题

## 4.6.0

### Minor Changes

- [#2751](https://github.com/XiaoMi/hiui/pull/2751) [`2ef3db5b5`](https://github.com/XiaoMi/hiui/commit/2ef3db5b5cd3ba4a2c076b877de1d20bdc846e3d) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add onOpen api

## 4.5.0

### Minor Changes

- [#2704](https://github.com/XiaoMi/hiui/pull/2704) [`51267eb24`](https://github.com/XiaoMi/hiui/commit/51267eb2408ee50970e2d354eaa554a34df00878) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 支持季度选择
  feat: add onPanelChange api

## 4.4.4

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/icons@4.0.18
  - @hi-ui/button@4.0.9
  - @hi-ui/popper@4.1.3
  - @hi-ui/time-picker@4.0.13
  - @hi-ui/classname@4.0.4
  - @hi-ui/env@4.0.4
  - @hi-ui/object-utils@4.0.4

## 4.4.3

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/icons@4.0.17
  - @hi-ui/button@4.0.8
  - @hi-ui/popper@4.1.2
  - @hi-ui/time-picker@4.0.12
  - @hi-ui/classname@4.0.3
  - @hi-ui/object-utils@4.0.3

## 4.4.2

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/icons@4.0.16
  - @hi-ui/button@4.0.7
  - @hi-ui/popper@4.1.1
  - @hi-ui/time-picker@4.0.11
  - @hi-ui/classname@4.0.2
  - @hi-ui/env@4.0.2
  - @hi-ui/object-utils@4.0.2

## 4.4.1

### Patch Changes

- [#2653](https://github.com/XiaoMi/hiui/pull/2653) [`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: 更新使用到的 G40 颜色值

- Updated dependencies [[`b477d91db`](https://github.com/XiaoMi/hiui/commit/b477d91db15bbc92c8712a9a771af5b332779315)]:
  - @hi-ui/button@4.0.6
  - @hi-ui/time-picker@4.0.10

## 4.4.0

### Minor Changes

- [#2631](https://github.com/XiaoMi/hiui/pull/2631) [`48a16f4bb`](https://github.com/XiaoMi/hiui/commit/48a16f4bbff22ba966608a6e3d040043b82e17cb) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 strideSelectMode API & format 支持函数

- [#2634](https://github.com/XiaoMi/hiui/pull/2634) [`ddb8d0c8b`](https://github.com/XiaoMi/hiui/commit/ddb8d0c8b8140f4984b17cf92ac58aed5e8b4ca4) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add footerRender api

## 4.3.0

### Minor Changes

- [#2614](https://github.com/XiaoMi/hiui/pull/2614) [`db9fca55f`](https://github.com/XiaoMi/hiui/commit/db9fca55fc4aabd22fa795b1b4ceabab4e985e58) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add cellRender api

## 4.2.0

### Minor Changes

- [#2597](https://github.com/XiaoMi/hiui/pull/2597) [`0ddf24960`](https://github.com/XiaoMi/hiui/commit/0ddf24960194fdd15653e34e0a6cef54b1586748) Thanks [@zyprepare](https://github.com/zyprepare)! - chore: axios 升级为 1.5.0

## 4.1.0

### Minor Changes

- [#2568](https://github.com/XiaoMi/hiui/pull/2568) [`07188e0d3`](https://github.com/XiaoMi/hiui/commit/07188e0d3106d5ed7b1da4e4fe60e0868481b33f) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 增加 onClose API

### Patch Changes

- Updated dependencies [[`0a9d90ac5`](https://github.com/XiaoMi/hiui/commit/0a9d90ac53bdf66aa2b83b698b58d2cdeb98d912)]:
  - @hi-ui/popper@4.0.5

## 4.0.18

### Patch Changes

- [#2523](https://github.com/XiaoMi/hiui/pull/2523) [`765c4e770`](https://github.com/XiaoMi/hiui/commit/765c4e770626006de15352c49e7c3b8af255c0ca) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 Safari 中月份选择时回调数据错误问题

## 4.0.17

### Patch Changes

- [#2484](https://github.com/XiaoMi/hiui/pull/2484) [`6980d058f`](https://github.com/XiaoMi/hiui/commit/6980d058f165b309695d10248d7511bd05bee457) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 样式优化

- [#2481](https://github.com/XiaoMi/hiui/pull/2481) [`0d4cfe83d`](https://github.com/XiaoMi/hiui/commit/0d4cfe83d017e596bb52c8aa74072e4c0c03fc18) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复时间选择格式化问题

## 4.0.16

### Patch Changes

- [#2458](https://github.com/XiaoMi/hiui/pull/2458) [`8198be5ac`](https://github.com/XiaoMi/hiui/commit/8198be5ac3f0b1b86d14c4bb68a535157da4d2b1) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 范围选择中，需要在切换年份或月份时触发 onSelect

- Updated dependencies [[`8f4ed78aa`](https://github.com/XiaoMi/hiui/commit/8f4ed78aad42002124e2ecaf8fd6845157b4c720)]:
  - @hi-ui/icons@4.0.7

## 4.0.15

### Patch Changes

- [#2431](https://github.com/XiaoMi/hiui/pull/2431) [`93489d394`](https://github.com/XiaoMi/hiui/commit/93489d394264189b783dde21169e6a3d458e9d6e) Thanks [@zyprepare](https://github.com/zyprepare)! - 样式优化: 日历面板显示界面过小

## 4.0.14

### Patch Changes

- [#2423](https://github.com/XiaoMi/hiui/pull/2423) [`2916a5578`](https://github.com/XiaoMi/hiui/commit/2916a557818fe232978562c1f3d4ce6dbb991218) Thanks [@zyprepare](https://github.com/zyprepare)! - 交互优化: 日期选择中,左右切换年或月时触发 onSelect 回调

## 4.0.13

### Patch Changes

- [#2411](https://github.com/XiaoMi/hiui/pull/2411) [`f7d1257ad`](https://github.com/XiaoMi/hiui/commit/f7d1257ad2006fd40cabb2d16f1fde77677f3117) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复问题: 日期选择中,选择月份后会有一个闪动的界面

- Updated dependencies [[`f7d1257ad`](https://github.com/XiaoMi/hiui/commit/f7d1257ad2006fd40cabb2d16f1fde77677f3117)]:
  - @hi-ui/icons@4.0.6

## 4.0.12

### Patch Changes

- [#2326](https://github.com/XiaoMi/hiui/pull/2326) [`8f89a1cd9`](https://github.com/XiaoMi/hiui/commit/8f89a1cd9f00e768dbf2d3f25207414698a20ac3) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复问题:设置 type="weekrange" 时，选择后没有触发 onChange

## 4.0.11

### Patch Changes

- [#2312](https://github.com/XiaoMi/hiui/pull/2312) [`763e80604`](https://github.com/XiaoMi/hiui/commit/763e80604bb5040e64cf5f95b82346ed2bccd028) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复 type 受控情况下,修改后 UI 更新不及时问题

- [#2313](https://github.com/XiaoMi/hiui/pull/2313) [`357ea008c`](https://github.com/XiaoMi/hiui/commit/357ea008c8230bd5961837942d596990dbd837d3) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复 value 受控模式下,输入时没有更新值输入框 UI 的问题

## 4.0.10

### Patch Changes

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复 DatePicker 依赖的 moment 库本地语言设置问题
