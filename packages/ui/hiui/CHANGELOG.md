# @hi-ui/hiui

## 4.1.15

### Patch Changes

- [#2363](https://github.com/XiaoMi/hiui/pull/2363) [`d4f104643`](https://github.com/XiaoMi/hiui/commit/d4f1046435637f2d92ec9f0e94baf7aa4ec37f1a) Thanks [@zyprepare](https://github.com/zyprepare)! - Modal 体验问题: 鼠标选中内容滑动到外部，松开后模态框会关闭

- [#2354](https://github.com/XiaoMi/hiui/pull/2354) [`badd273af`](https://github.com/XiaoMi/hiui/commit/badd273afb4a45ffa4d69ee81eef2e83603e025d) Thanks [@zyprepare](https://github.com/zyprepare)! - Tree 修复问题: 自定义搜索中 useTreeSearchProps 中的 filterTree 中的 keyword 是数组时，结果没有高亮展示

- [#2359](https://github.com/XiaoMi/hiui/pull/2359) [`1d467606f`](https://github.com/XiaoMi/hiui/commit/1d467606f8d1e9d6beb977a57b77971d65294317) Thanks [@zyprepare](https://github.com/zyprepare)! - Tree 修复问题: 自定义搜索中，当传入空字符串时，搜索会展开全部节点

- [#2361](https://github.com/XiaoMi/hiui/pull/2361) [`768a30597`](https://github.com/XiaoMi/hiui/commit/768a305979dddd345bd26b45adfe2971123ce013) Thanks [@zyprepare](https://github.com/zyprepare)! - Slider 修复问题: 滑块外部容器设置 overflow: 'hidden' 时,滑块的提示内容显示受限

- Updated dependencies [[`768a30597`](https://github.com/XiaoMi/hiui/commit/768a305979dddd345bd26b45adfe2971123ce013), [`d4f104643`](https://github.com/XiaoMi/hiui/commit/d4f1046435637f2d92ec9f0e94baf7aa4ec37f1a), [`badd273af`](https://github.com/XiaoMi/hiui/commit/badd273afb4a45ffa4d69ee81eef2e83603e025d), [`1d467606f`](https://github.com/XiaoMi/hiui/commit/1d467606f8d1e9d6beb977a57b77971d65294317)]:
  - @hi-ui/slider@4.0.6
  - @hi-ui/modal@4.0.8
  - @hi-ui/tree@4.1.1

## 4.1.14

### Patch Changes

- [#2345](https://github.com/XiaoMi/hiui/pull/2345) [`5c1fb516f`](https://github.com/XiaoMi/hiui/commit/5c1fb516f94b6282dcb54907cbcf32cca4e46dbc) Thanks [@zyprepare](https://github.com/zyprepare)! - Tabs 修复问题: TabPane 设置 disabled 不生效

- [#2347](https://github.com/XiaoMi/hiui/pull/2347) [`1dd3fa9ce`](https://github.com/XiaoMi/hiui/commit/1dd3fa9cee0c408ead0849b9fab3e451bcf3e1f7) Thanks [@zyprepare](https://github.com/zyprepare)! - Form 修复体验问题: 错误提示过长时样式错乱

- [#2351](https://github.com/XiaoMi/hiui/pull/2351) [`d39a3d341`](https://github.com/XiaoMi/hiui/commit/d39a3d34117f7a1d18f4d4ad4046749563dcdd37) Thanks [@zyprepare](https://github.com/zyprepare)! - Tree 增加功能: 自定义搜索中 useTreeSearchProps 中的 filterTree 中的 keyword 支持数组

- Updated dependencies [[`5c1fb516f`](https://github.com/XiaoMi/hiui/commit/5c1fb516f94b6282dcb54907cbcf32cca4e46dbc), [`d39a3d341`](https://github.com/XiaoMi/hiui/commit/d39a3d34117f7a1d18f4d4ad4046749563dcdd37), [`1dd3fa9ce`](https://github.com/XiaoMi/hiui/commit/1dd3fa9cee0c408ead0849b9fab3e451bcf3e1f7)]:
  - @hi-ui/tabs@4.0.6
  - @hi-ui/tree@4.1.0
  - @hi-ui/form@4.1.1

## 4.1.13

### Patch Changes

- [#2334](https://github.com/XiaoMi/hiui/pull/2334) [`c9e6f4ad6`](https://github.com/XiaoMi/hiui/commit/c9e6f4ad6c1050b86bee5db681214d39830305c7) Thanks [@zyprepare](https://github.com/zyprepare)! - Select CheckSelect CheckTreeSelect TreeSelect 修复问题:设置 loading 无效果

- [#2336](https://github.com/XiaoMi/hiui/pull/2336) [`bb2de106e`](https://github.com/XiaoMi/hiui/commit/bb2de106ee471f47a6f7223b6297e707f42d0278) Thanks [@zyprepare](https://github.com/zyprepare)! - FormList 对外暴露内部 add remove 等方法

- Updated dependencies [[`c9e6f4ad6`](https://github.com/XiaoMi/hiui/commit/c9e6f4ad6c1050b86bee5db681214d39830305c7), [`bb2de106e`](https://github.com/XiaoMi/hiui/commit/bb2de106ee471f47a6f7223b6297e707f42d0278)]:
  - @hi-ui/check-select@4.1.1
  - @hi-ui/check-tree-select@4.0.10
  - @hi-ui/select@4.0.9
  - @hi-ui/tree-select@4.0.10
  - @hi-ui/form@4.1.0

## 4.1.12

### Patch Changes

- [#2326](https://github.com/XiaoMi/hiui/pull/2326) [`8f89a1cd9`](https://github.com/XiaoMi/hiui/commit/8f89a1cd9f00e768dbf2d3f25207414698a20ac3) Thanks [@zyprepare](https://github.com/zyprepare)! - DatePicker 修复问题:设置 type="weekrange" 时，选择后没有触发 onChange

- [#2324](https://github.com/XiaoMi/hiui/pull/2324) [`d736da9c8`](https://github.com/XiaoMi/hiui/commit/d736da9c8932760053a1cac4c1b727b6cfab036c) Thanks [@zyprepare](https://github.com/zyprepare)! - Tabs 修复单独使用 TabList 时,设置 placement="vertical" 不生效问题

- Updated dependencies [[`8f89a1cd9`](https://github.com/XiaoMi/hiui/commit/8f89a1cd9f00e768dbf2d3f25207414698a20ac3), [`d736da9c8`](https://github.com/XiaoMi/hiui/commit/d736da9c8932760053a1cac4c1b727b6cfab036c)]:
  - @hi-ui/date-picker@4.0.12
  - @hi-ui/tabs@4.0.5

## 4.1.11

### Patch Changes

- [#2315](https://github.com/XiaoMi/hiui/pull/2315) [`551ab0b73`](https://github.com/XiaoMi/hiui/commit/551ab0b734e00d1e0ca170c9a87f316aa4197762) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复设置 size 后,空状态会出现滚动条问题

- [#2312](https://github.com/XiaoMi/hiui/pull/2312) [`763e80604`](https://github.com/XiaoMi/hiui/commit/763e80604bb5040e64cf5f95b82346ed2bccd028) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复 type 受控情况下,修改后 UI 更新不及时问题

- [#2313](https://github.com/XiaoMi/hiui/pull/2313) [`357ea008c`](https://github.com/XiaoMi/hiui/commit/357ea008c8230bd5961837942d596990dbd837d3) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复 value 受控模式下,输入时没有更新值输入框 UI 的问题

- Updated dependencies [[`551ab0b73`](https://github.com/XiaoMi/hiui/commit/551ab0b734e00d1e0ca170c9a87f316aa4197762), [`763e80604`](https://github.com/XiaoMi/hiui/commit/763e80604bb5040e64cf5f95b82346ed2bccd028), [`357ea008c`](https://github.com/XiaoMi/hiui/commit/357ea008c8230bd5961837942d596990dbd837d3)]:
  - @hi-ui/table@4.0.13
  - @hi-ui/date-picker@4.0.11

## 4.1.10

### Patch Changes

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 更新 filter 组件依赖

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 更新 Upload 组件依赖

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 更新 CheckSelect 组件依赖版本

- [#2304](https://github.com/XiaoMi/hiui/pull/2304) [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复 DatePicker 依赖的 moment 库本地语言设置问题

- Updated dependencies [[`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7), [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7), [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7), [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7), [`feaec9a67`](https://github.com/XiaoMi/hiui/commit/feaec9a67a05e315f6f3370115eaf0c8c418faf7)]:
  - @hi-ui/upload@4.1.0
  - @hi-ui/collapse@4.1.0
  - @hi-ui/check-select@4.1.0
  - @hi-ui/date-picker@4.0.10
  - @hi-ui/filter@4.1.0
