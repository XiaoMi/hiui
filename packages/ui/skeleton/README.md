# Skeleton 骨架屏

页面或区域加载时的占位展示，提供更好的用户体验。

## 何时使用

在网络请求或数据处理过程中，需要展示内容的大致结构

在数据尚未加载完成前，用于替代真实内容的占位展示

用于避免页面空白和跳动，提升用户体验

## 使用示例

<!-- Inject Stories -->

## Props

### Skeleton

| 参数      | 说明                               | 类型             | 可选值                                  | 默认值 |
| --------- | ---------------------------------- | ---------------- | --------------------------------------- | ------ |
| visible   | 加载状态，控制骨架屏的显示与隐藏   | boolean          | true \| false                           | true   |
| type      | 骨架屏类型                         | string           | 'text' \| 'avatar' \| 'image' \| 'icon' | 'text' |
| animation | 动画效果                           | string           | 'pulse' \| 'wave' \| 'none'             | 'none' |
| size      | 尺寸大小                           | string           | 'sm' \| 'md' \| 'lg'                    | 'md'   |
| width     | 自定义宽度，支持数字（px）或字符串 | string \| number | -                                       | -      |
| height    | 自定义高度，支持数字（px）或字符串 | string \| number | -                                       | -      |

### Skeleton.Group

| 参数       | 说明                                                      | 类型             | 可选值                                    | 默认值   |
| ---------- | --------------------------------------------------------- | ---------------- | ----------------------------------------- | -------- |
| visible    | 加载状态，控制骨架屏与实际内容的切换                      | boolean          | true \| false                             | true     |
| content    | 加载完成后显示的实际内容                                  | React.ReactNode  | -                                         | -        |
| direction  | 布局方向                                                  | string           | 'column' \| 'row'                         | 'column' |
| gap        | 子元素间距，可以是数字（px）或字符串（如 '12px', '1rem'） | number \| string | -                                         | -        |
| animation  | 统一设置所有嵌套子组件的动画效果                          | string           | 'pulse' \| 'wave' \| 'none'               | -        |
| alignItems | 水平布局时子元素的对齐方式                                | string           | 'start' \| 'center' \| 'end' \| 'stretch' | 'center' |

## CHANGELOG

| 参数 | 变更类型 | 变更内容 | 解决的问题 |
| ---- | -------- | -------- | ---------- |
| -    | feature  | 新增组件 | -          |
