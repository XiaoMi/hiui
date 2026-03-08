# @hi-ui/form

## 5.0.0-experimental.1

### Minor Changes

- 59cef699f: feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- eb17c4697: style: 修复 UI/样式问题 (5.0)
- Updated dependencies [eb17c4697]
- Updated dependencies [eb17c4697]
- Updated dependencies [c407744fe]
  - @hi-ui/core@5.0.0-experimental.1
  - @hi-ui/button@5.0.0-experimental.1
  - @hi-ui/use-merge-semantic@5.0.0-experimental.0

## 5.0.0-experimental.0

### Major Changes

- 8f3aa85e4: feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- dd5033f60: feat(form): 增加 autoRegister 参数,支持动态添加和删除表单时,数据同步更新 (5.0)

### Patch Changes

- 1662753e0: style: fix ui bug (5.0)
- dd83a83bc: fix(form): 修复 FormList 字段变化时没有触发 onValuesChange 回调的问题 (5.0)
- 8c0ee78f0: perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)
- 9b34d99bc: fix: 修复 5.0 UI 问题 (5.0)
- f4fc0ef30: style: 修改样式问题 (5.0)
- 79ea480f3: feat(global-context): 增加 size api 全局配置 (5.0)
- 2e56529f7: styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)
- 539749951: <br>
  - fix(form): 错误提示字号改为 12px (5.0)
  - fix(form): 必填星号调整为显示在右侧 (5.0)
  - fix(form): 标题和控件间距改为 6px (5.0)
  - fix(form): 包裹控件容器设置最小高度 32px (5.0)
  - fix(form): 默认不显示标题冒号 (5.0)
- 33da3144e: build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)
- 7f3abee55: style: fix ui bug (5.0)
- b12cd78a3: fix(form): 修复当 initialValues 为 {} 时无法正常重置表单问题 (#3475)
- Updated dependencies [eea29eade]
- Updated dependencies [8c0ee78f0]
- Updated dependencies [9b34d99bc]
- Updated dependencies [8f3aa85e4]
- Updated dependencies [fd4c20bbd]
- Updated dependencies [be5a59325]
- Updated dependencies [71fc15e5c]
- Updated dependencies [79ea480f3]
- Updated dependencies [2e56529f7]
- Updated dependencies [8a92ec660]
- Updated dependencies [1429eced2]
- Updated dependencies [f1ab51725]
- Updated dependencies [4006b2c8c]
- Updated dependencies [33da3144e]
- Updated dependencies [0a8cc07a7]
- Updated dependencies [7f3abee55]
- Updated dependencies [58ad82e94]
- Updated dependencies [99801c2d1]
- Updated dependencies [86910f5e2]
  - @hi-ui/button@5.0.0-experimental.0
  - @hi-ui/core@5.0.0-experimental.0
  - @hi-ui/use-latest@5.0.0-experimental.0
  - @hi-ui/array-utils@5.0.0-experimental.0
  - @hi-ui/classname@5.0.0-experimental.0
  - @hi-ui/dom-utils@5.0.0-experimental.0
  - @hi-ui/env@5.0.0-experimental.0
  - @hi-ui/func-utils@5.0.0-experimental.0
  - @hi-ui/object-utils@5.0.0-experimental.0
  - @hi-ui/type-assertion@5.0.0-experimental.0

## 4.3.3

### Patch Changes

- [#3277](https://github.com/XiaoMi/hiui/pull/3277) [`93df0aaff`](https://github.com/XiaoMi/hiui/commit/93df0aafff09be59faeb4bad0ceea57a00df5ccf) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(form): 处理规则消息为空的情况，将其设置为 undefined (#3276)

- [#3275](https://github.com/XiaoMi/hiui/pull/3275) [`b2b66a9e7`](https://github.com/XiaoMi/hiui/commit/b2b66a9e73a1a92d6b0604dc2ad711895154e518) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(form): 优化 valueType 为 number 情况下的校验逻辑 (#3274)

## 4.3.2

### Patch Changes

- [#3160](https://github.com/XiaoMi/hiui/pull/3160) [`3244e5a`](https://github.com/XiaoMi/hiui/commit/3244e5a94d1cfa3d85a65bc8804a21b8b60b80a4) Thanks [@zyprepare](https://github.com/zyprepare)! - <br>
  - feat(form): 入口新增 FormLabel 组件导出
  - feat(form): 更新 FormListProps 中 children 渲染函数中 fields 参数的类型

## 4.3.1

### Patch Changes

- [#3121](https://github.com/XiaoMi/hiui/pull/3121) [`a6eb8cb`](https://github.com/XiaoMi/hiui/commit/a6eb8cbfda696dfeee147d6adba9805ecb8af5d0) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(form): 更新 FormItemProps 的 children 类型以支持渲染函数，并修复 useForm 中对 formState 的引用问题 (#3120)

## 4.3.0

### Minor Changes

- [#3006](https://github.com/XiaoMi/hiui/pull/3006) [`4540c217a`](https://github.com/XiaoMi/hiui/commit/4540c217ade6749c38ee58cefcfe94322889b929) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: Add scrollToFirstError api

## 4.2.2

### Patch Changes

- [#2933](https://github.com/XiaoMi/hiui/pull/2933) [`369cdf935`](https://github.com/XiaoMi/hiui/commit/369cdf935fb4e3a81478dcbd8e199c1a7cac1875) Thanks [@xiamiao1121](https://github.com/xiamiao1121)! - fix: 修复 validator 回调中第一个参数带有多余的引号

## 4.2.1

### Patch Changes

- [#2842](https://github.com/XiaoMi/hiui/pull/2842) [`3dc8c1556`](https://github.com/XiaoMi/hiui/commit/3dc8c155674bb8d702187cc4a33e684d22f04bf6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复标签顶对齐时样式问题

- Updated dependencies [[`3afbf239e`](https://github.com/XiaoMi/hiui/commit/3afbf239e816ede48d6a85cbd99b6b099b8c8eb3)]:
  - @hi-ui/env@4.0.7

## 4.2.0

### Minor Changes

- [#2818](https://github.com/XiaoMi/hiui/pull/2818) [`39d555903`](https://github.com/XiaoMi/hiui/commit/39d555903c81207d5d2bf34a2a5d1942152dcee0) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: add showValidateMessage api

## 4.1.7

### Patch Changes

- [#2791](https://github.com/XiaoMi/hiui/pull/2791) [`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715) Thanks [@zyprepare](https://github.com/zyprepare)! - build: style-inject(node 环境下有问题) 替换为 @hi-ui/style-inject

- Updated dependencies [[`1a00f9fc4`](https://github.com/XiaoMi/hiui/commit/1a00f9fc4a44619059d7852e846b54fedbd56715)]:
  - @hi-ui/env@4.0.5
  - @hi-ui/button@4.0.10
  - @hi-ui/array-utils@4.0.5
  - @hi-ui/classname@4.0.5

## 4.1.6

### Patch Changes

- [#2761](https://github.com/XiaoMi/hiui/pull/2761) [`7fc7e2c1a`](https://github.com/XiaoMi/hiui/commit/7fc7e2c1a8c0daa6df77bf01864c262a14df3cc6) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复横向表单错误提示样式问题

## 4.1.5

### Patch Changes

- build: rollup2 构建
- Updated dependencies
  - @hi-ui/core@4.0.8
  - @hi-ui/use-latest@4.0.4
  - @hi-ui/button@4.0.9
  - @hi-ui/array-utils@4.0.4
  - @hi-ui/classname@4.0.4
  - @hi-ui/dom-utils@4.0.7
  - @hi-ui/env@4.0.4
  - @hi-ui/func-utils@4.0.4
  - @hi-ui/object-utils@4.0.4
  - @hi-ui/type-assertion@4.0.4

## 4.1.4

### Patch Changes

- fix: 修复 rollup3 打包 cjs 模块问题
- Updated dependencies
  - @hi-ui/env@4.0.3
  - @hi-ui/core@4.0.7
  - @hi-ui/use-latest@4.0.3
  - @hi-ui/button@4.0.8
  - @hi-ui/array-utils@4.0.3
  - @hi-ui/classname@4.0.3
  - @hi-ui/dom-utils@4.0.6
  - @hi-ui/func-utils@4.0.3
  - @hi-ui/object-utils@4.0.3
  - @hi-ui/type-assertion@4.0.3

## 4.1.3

### Patch Changes

- [#2672](https://github.com/XiaoMi/hiui/pull/2672) [`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 升级到 rollup3,重新构建发布组件

- Updated dependencies [[`1ebe27830`](https://github.com/XiaoMi/hiui/commit/1ebe2783098b3a8cd980bd10076d67635463800e)]:
  - @hi-ui/core@4.0.6
  - @hi-ui/use-latest@4.0.2
  - @hi-ui/button@4.0.7
  - @hi-ui/array-utils@4.0.2
  - @hi-ui/classname@4.0.2
  - @hi-ui/dom-utils@4.0.5
  - @hi-ui/env@4.0.2
  - @hi-ui/func-utils@4.0.2
  - @hi-ui/object-utils@4.0.2
  - @hi-ui/type-assertion@4.0.2

## 4.1.2

### Patch Changes

- [#2374](https://github.com/XiaoMi/hiui/pull/2374) [`4e7308002`](https://github.com/XiaoMi/hiui/commit/4e7308002165b63b43491cfcfd0bc0586666cb85) Thanks [@zyprepare](https://github.com/zyprepare)! - 在 labelPlacement="top" 下，formMessage 显示异常

## 4.1.1

### Patch Changes

- [#2347](https://github.com/XiaoMi/hiui/pull/2347) [`1dd3fa9ce`](https://github.com/XiaoMi/hiui/commit/1dd3fa9cee0c408ead0849b9fab3e451bcf3e1f7) Thanks [@zyprepare](https://github.com/zyprepare)! - 修复体验问题: 错误提示过长时样式错乱

## 4.1.0

### Minor Changes

- [#2336](https://github.com/XiaoMi/hiui/pull/2336) [`bb2de106e`](https://github.com/XiaoMi/hiui/commit/bb2de106ee471f47a6f7223b6297e707f42d0278) Thanks [@zyprepare](https://github.com/zyprepare)! - FormList 对外暴露内部 add remove 等方法
