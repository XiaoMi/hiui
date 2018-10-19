## Alert


### 基础用法

:::demo

基础用法

```js
render () {
  return (
    <div>
      <Alert type="info" message="信息提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="success" message="成功提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="error" message="错误提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="warning" message="警示提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
    </div>
  )
}
```
:::


### 不可关闭

:::demo

不可关闭

```js
render () {
  return (
    <div>
      <Alert type="info" message="信息提示的文案" closeable={false} />
      <br />
      <Alert type="success" message="成功提示的文案" closeable={false} />
      <br />
      <Alert type="error" message="错误提示的文案" closeable={false} />
      <br />
      <Alert type="warning" message="警示提示的文案" closeable={false} />
    </div>
  )
}
```
:::


### 带标题

:::demo

带标题

```js
render () {
  return (
    <div>
      <Alert type="info" title="信息提示的文案" message="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="success" title="成功提示的文案" message="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="error" title="错误提示的文案" message="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="warning" title="警示提示的文案" message="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
    </div>
  )
}
```
:::


### 倒计时自动关闭

:::demo

3秒自动关闭，所以你看不见它们。需要设置 autoClase={true} closeable={false}。使用 autoCloseTime 设置自动关闭时间。

```js
render () {
  return (
    <div>
      <Alert type="info" message="信息提示的文案" autoClose closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="success" message="成功提示的文案" autoClose closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="error" message="错误提示的文案" autoClose closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
      <br />
      <Alert type="warning" message="警示提示的文案" autoClose closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
    </div>
  )
}
```
:::


### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 类型 | string | info \| success \| error \| warning | info |
| message | 提示内容 | string | - | - |
| title | 提示标题 | string | - | - |
| size | 弹框大小类型 | string | small \| middle \| large | middle |
| closeable | 是否显示关闭按钮 | boolean | true \| false | true |
| autoClose |  是否自动关闭（closeable 为 false 时生效） | boolean | true \| false |  false |
| autoCloseTime | 自动关闭时间，单位为毫秒 | number | - | 3000 |


### Events

| 参数 | 说明 | 回调参数
| ------- | ------- | ------- |
| onClose | 关闭时触发的事件 | - |
