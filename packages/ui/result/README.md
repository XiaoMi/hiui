# Result 结果页

用于反馈一系列操作任务的处理结果。

## 何时使用

- 当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。

## 使用示例

<!-- Inject Stories -->

## Props

| 参数             | 说明         | 类型            | 可选值        | 默认值 |
| ---------------- | ----------- | -------------- | ------------- | ------ |
| icon             | 自定义图标    | ReactNode      | -             | -      |
| iconSize         | 图标尺寸      | string         | 'sm' \| 'md' \| 'lg' | 'md'  |
| type             | 组件类型      | string         | 'info' \| 'success' \| 'warn' \| 'error' \| 'operation-succeed' \| 'operation-failed' \| 'processed' \| 'net-error' \| 'no-content' \| 'no-comment' \| 'no-permission' \| 'no-collection' | 'info'  |
| title            | 标题         | ReactNode      | -             | -      |
| subTitle         | 副标题       | ReactNode      | -             | -      |
| extra            | 操作区域      | ReactNode      | -             | -      |

## CHANGELOG



