# `@hi-ui/pagination`

> TODO: description

## Usage

```
const Pagination = require('@hi-ui/pagination');

// TODO: DEMONSTRATE API
```

## Props

| 参数            | 说明                     | 类型     | 可选值                            | 默认值    |
| --------------- | ------------------------ | -------- | --------------------------------- | --------- |
| defaultCurrent  | 默认的当前页数           | number   | -                                 | 1         |
| current         | 当前页数                 | number   | -                                 | -         |
| max             | 最大显示的页数           | number   | -                                 | 2         |
| pageSize        | 每页条数                 | number   | -                                 | 10        |
| pageSizeOptions | 指定每页可以显示多少条   | number[] | -                                 | []        |
| total           | 数据总数                 | number   | -                                 | -         |
| showTotal           | 是否显示数据总数                 | boolean   | -                                 | false         |
| autoHide（没做）        | 只有一页时是否隐藏分页器 | boolean  | true \| false                     | false     |
| showJumper      | 是否显示跳转             | boolean  | true \| false                     | false     |

## Events

| 名称             | 说明                       | 类型                                                      | 参数                                                                        | 返回值 |
| ---------------- | -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| onJump           | 快速跳转时触发             | (current: number) => void                                 | current: 快速跳转页数                                                       | -      |
| onChange         | 页码改变时的回调           | (current: number, prev: number, pageSize: number) => void | current: 改变后的新页数 prev: 改变前的页数 pageSize: 每页记录数 | -      |
| onPageSizeChange | 每页显示条数改变的回调函数 | (pageSize: number, current: number) => void               | current: 当前页数 每页记录数

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| type        | deprecated                          | 移除type字段，改为原子化引用 | 建议还是恢复为type形态，这个变更意义不是特别大           |
