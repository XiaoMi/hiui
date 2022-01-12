# `@hi-ui/preview`

> TODO: description

## Usage

```
const Preview = require('@hi-ui/preview');

// TODO: DEMONSTRATE API
```

## Props

| 参数      | 说明                                               | 类型                | 可选值                                 | 默认值  |
| --------- | -------------------------------------------------- | ------------------- | -------------------------------------- | ------- |
| visible    |  是否显示预览窗体                                  |  boolean              | -                                      | false      |
| showBar（未实现）    |    是否显示预览窗体下方工具条                       | boolean | true \| false                                          | true     |
| showArrow （未实现） | 是否显示预览窗体两侧切换按钮                        | boolean              | true \| false       | false   |
| showCount（未实现）  | 是否显示预览窗体上方图片数量                        | boolean              | true \| false            | false |
|src     | 预览图片地址                                            | string | string[]            | -                         | -   |
|current     | 当前预览图片索引(受控)                                            | number           | -                         | -   |
|defaultCurrent     | 当前预览图片索引                                            | number           | -                         | -   |
|title     | 预览图片标题                                            | string | string[]            | -                         | -   |
|visible     | 是否显示预览窗体                                           | boolean            | true \| false                         | false   |

# Events

| 名称       | 说明               | 类型                            | 参数                  | 返回值 |
| ---------- | ------------------ | ------------------------------- | --------------------- | ------ |
| onError    | 在点击的预览图片预览大图资源加载失败的回调函数   | (e) => void | - | -      |
| onClose    | 在点击关闭按钮回调函数   |((event: MouseEvent<Element, MouseEvent>) => void) | - | -      |
| onPreviewChange    | 图片索引改变触发   |(current: number) => void| - | -      |
## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| onError       | update                          | 入参变化 | 更应关心错误信息，索引没啥用          |
| onClose       | update                          | 入参变化 | 增加event 入参         |
| src       | update                          | images 改为src | 语义更好，且支持单个和数组         |
| title       | feature                          | 图片标题 | 增加图片标题展示         |
| current       | update                          | 当前预览图片索引(受控)，有activeIndex 调整为current  | 增加图片索引控制能力         |
| defaultCurrent       | feature                          | 当前预览图片索引(受控)  | 增加图片索引控制能力         |
| simpleData       | deprecated                          | 是否为简单数据格式（string[]和object[]的区别  | 统一为string[]，这个字段意义不大         |
