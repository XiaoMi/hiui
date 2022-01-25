# Loading 动效加载

用于请求和数据加载成功的中间状态，缓冲用户的等待焦虑

## 何时使用

页面加载时

页面卡片、浮层面板加载时

## 使用示例

<!-- Inject Stories -->

## Props

| 参数    | 说明                   | 类型                | 可选值                          | 默认值    |
| ------- | ---------------------- | ------------------- | ------------------------------- | --------- |
| size    | loading 的尺寸         | string              | 'large' \| 'default' \| 'small' | 'default' |
| content | 自定义加载中状态的文案 | string \| ReactNode | -                               | -         |
| visible | 是否显示 loading       | boolean             | true \| false                   | true      |
| full    | 是否全屏               | boolean             | true \| false                   | false     |

## Methods

`Loading.open(target, { content, size, duration, key })`

| 参数     | 说明                                            | 类型                | 可选值                          | 默认值    |
| -------- | ----------------------------------------------- | ------------------- | ------------------------------- | --------- |
| key      | 标识  `Loading`  的唯一 key，仅用于关闭         | string              | -                               | -         |
| target   | 需要  `Loading`  遮罩的元素, 当不传时为全屏遮罩 | HTMLElement         | -                               | -         |
| content  | 自定义加载中状态的文案                          | string \| ReactNode | -                               | -         |
| duration | loading 自动关闭的时间，单位为毫秒              | number              | -                               | -         |
| size     | loading 的尺寸                                  | string              | 'large' \| 'default' \| 'small' | 'default' |

`Loading.close(key)`

| 参数 | 说明                        | 类型   | 可选值 | 默认值 |
| ---- | --------------------------- | ------ | ------ | ------ |
| key  | 标识  `Loading`  的唯一 key | string | -      | -      |

## CHANGELOG

| 参数      | 变更类型 | 变更内容 | 解决的问题 |
| --------- | -------- | -------- | ---------- |
| label     | feature  |          |            |
| container | feature  |          |            |
| delay     | feature  |          |            |

- `Loading.open` method 参数类型、个数改变
