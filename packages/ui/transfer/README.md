# Transfer 穿梭框

在一定展示空间里对选项进行单个或批量移动从而完成挑选的数据容器

## 何时使用

一组数据进行两种状态的分类时

有更多的空间进行选择时

需快速批量的完成选项归类且可调整顺序时

## 使用示例

<!-- Inject Stories -->

## Props

| 参数           | 说明                                                                                       | 类型                                                    | 可选值                  | 默认值    |
| -------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ----------------------- | --------- |
| type           | 穿梭框类型                                                                                 | string                                                  | 'default' \| 'multiple' | 'default' |
| showCheckAll   | 是否展示全选按钮                                                                           | boolean                                                 | true \| false           | false     |
| title          | 标题(数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题)                 | ReactNode[]                                             | -                       | -         |
| searchable     | 是否可筛选                                                                                 | boolean                                                 | true \| false           | false     |
| emptyContent   | 数据为空时的显示内容(数组长度为 1 或 2 位，1 位时左右内容将相同，2 位时将使用对应索引内容) | ReactNode[]                                             | -                       | -         |
| disabled       | 是否禁用                                                                                   | boolean                                                 | true \| false           | false     |
| data           | 穿梭框数据源                                                                               | DataItem[]                                              | -                       | —         |
| onDragStart    | 拖拽开始时的回调函数                                                                       | (dragItem: DataItem) => boolean                         | -                       | -         |
| onDragEnd      | 拖拽结束时的回调函数(完成拖拽)                                                             | (newData: DataItem[]) => void                           | -                       | -         |
| onDrop         | 放开拖拽元素时的回调函数，可用于条件判断，阻止拖拽到对应位置                               | (targetItem: DataItem, sourceItem: DataItem) => boolean | -                       | -         |
| targetLimit    | 最大可穿梭上限                                                                             | number                                                  | -                       | -         |
| targetIds      | 目标框内的元素 id 集合                                                                     | number[] \| string[]                                    | -                       | -         |
| targetSortType | 目标框内的排序方式                                                                         | string                                                  | 'default' \| 'queue'    | 'default' |
| placeholder    | 搜索输入框占位(数组长度为 1 或 2 位，1 位时左右内容将相同，2 位时将使用对应索引内容)       | string[]                                                | -                       | -         |

## Events

| 名称     | 说明                             | 类型                                                                                            | 参数                                                                                           | 返回值 |
| -------- | -------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| onChange | 选中元素被移动到目标框内后的回调 | (targetKeys: number[] \| string[], direction: 'left' \| 'right', moveItems: DataItem[]) => void | targetKeys: 目标框内的元素 ID 集合 <br/> direction: 移动方向 <br/> moveItems: 移动的数据项集合 | -      |
| render   | 自定义菜单渲染函数               | (item: DataItem) => ReactNode                                                                   | -                                                                                              | 无内容 |

## Type

### DataItem

| 参数     | 说明     | 类型      | 可选值        | 默认值 |
| -------- | -------- | --------- | ------------- | ------ |
| id       | 唯一 id  | ReactText | -             |
| title    | 显示内容 | string    | -             | -      |
| disabled | 是否禁用 | boolean   | true \| false | false  |

## CHANGELOG

| 参数             | 变更类型                        | 变更内容                                                                                                                                                              | 解决的问题                               |
| ---------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| propName         | feature \| deprecated \| update | 变更了什么                                                                                                                                                            | 之前是什么样子，解决什么问题             |
| ----             | ----                            | ----                                                                                                                                                                  | ----                                     |
| placeholder      | feature                         | 占位                                                                                                                                                                  | 增强搜索输入框                           |
| DataItem.title   | update                          | 字段：DataItem.content -> DataItem.title；类型：string -> ReactNode                                                                                                   | 统一数据源类型                           |
| defaultTargetIds | feature                         | -                                                                                                                                                                     | 表单控件统一添加非受控模式支持           |
| type             | update                          | 字段值：'default' -> 'single'                                                                                                                                         | 命名统一，移除含义不明的 `default`       |
| pagination       | feature                         | -                                                                                                                                                                     | 功能强化，大数据分页支持                 |
| targetSortType   | update                          | 字段值：'default' -> 'head'                                                                                                                                           | 命名统一，移除含义不明的 `default`       |
| onDrop           | feature                         | (targetItem: DataItem, sourceItem: DataItem) => boolean -> (targetItem: DataItem, sourceItem: DataItem, info: { before: ReactText[], after: ReactText[] }) => boolean | 新增第三个参数，之前和之后的 id 顺序列表 |
