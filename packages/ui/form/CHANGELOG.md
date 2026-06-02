# @hi-ui/form

## 5.0.0

### Major Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 组件的 package.json 中的 exports 统一加上 types 配置 (5.0)

### Minor Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`dd5033f60`](https://github.com/XiaoMi/hiui/commit/dd5033f60207a638d119a8585805ee69cf435abf) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(form): 增加 autoRegister 参数,支持动态添加和删除表单时,数据同步更新 (5.0)

- [#3502](https://github.com/XiaoMi/hiui/pull/3502) [`59cef699f`](https://github.com/XiaoMi/hiui/commit/59cef699f96f56d4f68fae7f9dadb960c487b5de) Thanks [@zyprepare](https://github.com/zyprepare)! - feat: 组件语义化样式改造，增加 styles 和 classNames 属性 (5.0)

### Patch Changes

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`dd83a83bc`](https://github.com/XiaoMi/hiui/commit/dd83a83bc60904342412a88af56ec904c972a965) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(form): 修复 FormList 字段变化时没有触发 onValuesChange 回调的问题 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`8c0ee78f0`](https://github.com/XiaoMi/hiui/commit/8c0ee78f013dcd9ced94cef13a69933e039621aa) Thanks [@zyprepare](https://github.com/zyprepare)! - perf: 优化全局 size 配置,对于组件中没有的 size 值,取最接近的尺寸展示 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`9b34d99bc`](https://github.com/XiaoMi/hiui/commit/9b34d99bc2aa8b78b9e3281e08afc086ac4afea1) Thanks [@zyprepare](https://github.com/zyprepare)! - fix: 修复 5.0 UI 问题 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`79ea480f3`](https://github.com/XiaoMi/hiui/commit/79ea480f33bb8f692dda1e6252a9d2a75c3ac30d) Thanks [@zyprepare](https://github.com/zyprepare)! - feat(global-context): 增加 size api 全局配置 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`2e56529f7`](https://github.com/XiaoMi/hiui/commit/2e56529f7ea8c74e2fac8b6061628d4fd0d862ac) Thanks [@zyprepare](https://github.com/zyprepare)! - styles: 主题定制功能完善&&样式变量化写法改造&&兼容 RTL (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`539749951`](https://github.com/XiaoMi/hiui/commit/53974995177f7cf813a4208b05fb6e1b43201f48) Thanks [@zyprepare](https://github.com/zyprepare)! - <br>

  - fix(form): 错误提示字号改为 12px (5.0)
  - fix(form): 必填星号调整为显示在右侧 (5.0)
  - fix(form): 标题和控件间距改为 6px (5.0)
  - fix(form): 包裹控件容器设置最小高度 32px (5.0)
  - fix(form): 默认不显示标题冒号 (5.0)

- [#3504](https://github.com/XiaoMi/hiui/pull/3504) [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe) Thanks [@zyprepare](https://github.com/zyprepare)! - style: 修复 UI/样式问题 (5.0)

- [#3532](https://github.com/XiaoMi/hiui/pull/3532) [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193) Thanks [@zyprepare](https://github.com/zyprepare)! - build: 将 package.json 中 exports 配置中的 types 配置放在最上面 (5.0)

- Updated dependencies [[`eea29eade`](https://github.com/XiaoMi/hiui/commit/eea29eade364317198270daa62d7454279f9068a), [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`8c0ee78f0`](https://github.com/XiaoMi/hiui/commit/8c0ee78f013dcd9ced94cef13a69933e039621aa), [`9b34d99bc`](https://github.com/XiaoMi/hiui/commit/9b34d99bc2aa8b78b9e3281e08afc086ac4afea1), [`8f3aa85e4`](https://github.com/XiaoMi/hiui/commit/8f3aa85e4e1977854cecdf2864498a77e959bc39), [`fd4c20bbd`](https://github.com/XiaoMi/hiui/commit/fd4c20bbd30e18bc4c1a2eb078acaa4790f7b2eb), [`79ea480f3`](https://github.com/XiaoMi/hiui/commit/79ea480f33bb8f692dda1e6252a9d2a75c3ac30d), [`2e56529f7`](https://github.com/XiaoMi/hiui/commit/2e56529f7ea8c74e2fac8b6061628d4fd0d862ac), [`3a7186e4b`](https://github.com/XiaoMi/hiui/commit/3a7186e4b4e7ce351c3856f3e1ba574b9f6df22f), [`8a92ec660`](https://github.com/XiaoMi/hiui/commit/8a92ec660d7622768574dfe2e799b24d14e052a7), [`1429eced2`](https://github.com/XiaoMi/hiui/commit/1429eced2c79d22b6973229af3860b5dc48ad4a9), [`eb17c4697`](https://github.com/XiaoMi/hiui/commit/eb17c46978dfcb5e8ec0a0e3b3dcffabae8d31fe), [`f1ab51725`](https://github.com/XiaoMi/hiui/commit/f1ab517258599ee2dfad183e4a8c7b855ef409c1), [`c407744fe`](https://github.com/XiaoMi/hiui/commit/c407744fea78d93da66b73eed0b62d18e5b3a011), [`d91a8bb0f`](https://github.com/XiaoMi/hiui/commit/d91a8bb0f887fa886215aa596852eef3c2ce8519), [`4006b2c8c`](https://github.com/XiaoMi/hiui/commit/4006b2c8cabba5ec553b69a17e4bf3fb53fe9180), [`33da3144e`](https://github.com/XiaoMi/hiui/commit/33da3144e916edd75ee0669ca9e5090edc681193), [`58ad82e94`](https://github.com/XiaoMi/hiui/commit/58ad82e9441e76bf6090e6a0f4e36a04342c25f0), [`95d930354`](https://github.com/XiaoMi/hiui/commit/95d930354a1ab4291e98a9abccb9525d6c210795), [`99801c2d1`](https://github.com/XiaoMi/hiui/commit/99801c2d12628c194657579eccd09a86aedea22b)]:
  - @hi-ui/button@5.0.0
  - @hi-ui/core@5.0.0
  - @hi-ui/use-latest@5.0.0
  - @hi-ui/array-utils@5.0.0
  - @hi-ui/classname@5.0.0
  - @hi-ui/dom-utils@5.0.0
  - @hi-ui/env@5.0.0
  - @hi-ui/func-utils@5.0.0
  - @hi-ui/object-utils@5.0.0
  - @hi-ui/type-assertion@5.0.0
  - @hi-ui/use-merge-semantic@5.0.0

## 4.3.4

### Patch Changes

- [#3476](https://github.com/XiaoMi/hiui/pull/3476) [`b12cd78`](https://github.com/XiaoMi/hiui/commit/b12cd78a3e701a0efaacc6f14705a0afcb0fae08) Thanks [@zyprepare](https://github.com/zyprepare)! - fix(form): 修复当 initialValues 为 {} 时无法正常重置表单问题 (#3475)

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
