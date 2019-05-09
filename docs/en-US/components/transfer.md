## Transfer


### 基础用法

:::demo

基础用法

```js
render () {
  return (
    <div>
      <Transfer />
      
    </div>
  )
}
```
:::



### Alert Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 类型 | String | info \| success \| error \| warning | info |
| message | 提示内容 | String | - | - |
| title | 提示标题 | String | - | - |
| size | 弹框大小类型 | String | small \| middle \| large | middle |
| closeable | 是否显示关闭按钮 | Boolean | true  \| false | true |
| autoClose |  是否自动关闭（closeable 为 false 时生效） | Boolean | true  \| false |  false |
| autoCloseTime | 自动关闭时间，单位为毫秒 | Number | - | 3000 |


### Alert Events

| 参数 | 说明 | 回调参数
| ------- | ------- | ------- |
| onClose | 关闭时触发的事件 | - |
