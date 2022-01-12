# `@hi-ui/list`

> TODO: description

## Usage

```
const List = require('@hi-ui/list');

// TODO: DEMONSTRATE API
```
## List

| 参数           | 说明                                                          | 类型               | 可选值                       | 默认值     |
| -------------- | ------------------------------------------------------------- | ------------------ | ---------------------------- | ---------- |
| data           | 列表展示的数据                                                | ListItemProps[]         | -                            | -          |
| renderItem     | 自定义渲染列表项                                              | item => ReactNode  | -                            | -          |
| split          | 是否展示分割线                                                | boolean \| object  | false                        | true       |
| pagination     | 对应的 pagination 配置, 设置 false 不显示                     | boolean \| object  | false                        | false      |
| bordered       | 是否展示边框                    | boolean            | -                            | false      |
| emptyText      | 无数据提示内容                                                | ReactNode | -                            | '暂无数据' |

## ListItemProps

List.Item 的配置项

| 参数         | 说明                   | 类型                       | 可选值                                         | 默认值    |
| ------------ | ---------------------- | -------------------------- | ---------------------------------------------- | --------- |
| title        | 列表元素的标题         | string                     | ReactNode                                      | -         |
| description  | 列表元素的描述内容     | string \|ReactNode         | -                                              | -         |
| extra        | 额外内容               | React.ReactNode | -                                              | -         |
| avatar       | 图片资源地址           | string                     | -                                              | -         |
| action         | 列表操作内容                                                  | ReactNode          | -                            | -          |
| actionPosition | 指定列表操作显示的位置                                        | string             | 'top' \| 'center' \|'bottom' | 'bottom'   |

## pagination

分页的配置项

| 参数     | 说明               | 类型   | 可选值                       | 默认值  |
| -------- | ------------------ | ------ | ---------------------------- | ------- |
| position | 指定分页显示的位置 | string | 'left' \| 'middle' \|'right' | 'right' |


## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| type        | deprecated                          | 移除type字段 | 根据item是否返回avatar字段已经可以决定如何渲染，不需要type字段           |
| action        | update                          | 由List props 迁移为 ListItem props | action 是依赖ListItem渲染的，原来的方式不符合预期，因为renderItem 可以不return ListItem，这样在List配置aciton是没有意义的           |
| actionPosition        | update                          | 由List props 迁移为 ListItem props | 同上           |
| hoverable        | deprecated                          | 鼠标移入时是否显示阴影 (仅在 type==='card'时生效) | 新设计稿没有这个效果了           |
|  layout        | deprecated                          | 设置 List.Item 布局, 设置成 vertical 则竖直样式显示, 默认横排| 现在这个功能好像就是不起作用的           |
|  titleTag        | deprecated                          | 列表元素的标题中的标签           | 直接title用reactNode，这种耦合性太强           |
|  titleTagType        | deprecated                          | 列表元素的标题中的标签的类型           | 直接title用reactNode，这种耦合性太强          |
