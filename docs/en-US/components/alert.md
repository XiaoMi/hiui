## Alert



### Basic

:::demo


```js
render () {
  return (
    <div>
      <Alert type="info" message="Message content" onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="success" message="Sucess Tips" onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="error" message="Error Tips" onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="warning" message="Warn Tips" onClose={()=>{console.log('closed')}} />
    </div>
  )
}
```
:::


### Not be closed

:::demo

Not be closed

```js
render () {
  return (
    <div>
      <Alert type="info" message="Message content" closeable={false} />
      <br />
      <Alert type="success" message="Sucess Tips" closeable={false} />
      <br />
      <Alert type="error" message="Error Tips" closeable={false} />
      <br />
      <Alert type="warning" message="Warn Tips" closeable={false} />
    </div>
  )
}
```
:::


### Title

:::demo

Title

```js
render () {
  return (
    <div>
      <Alert type="info" title="Message content" message="description" onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="success" title="Sucess Tips" message="description" onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="error" title="Error Tips" message="description" onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="warning" title="Warn Tips" message="description" onClose={()=>{console.log('closed')}} />
    </div>
  )
}
```
:::


### Auto Close

:::demo

Automatically close after 3 seconds, set auto close time using autoCloseTime

```js
render () {
  return (
    <div>
      <Alert type="info" message="Message content" autoClose closeable={false} onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="success" message="Sucess Tips" autoClose closeable={false} onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="error" message="Error Tips" autoClose closeable={false} onClose={()=>{console.log('closed')}} />
      <br />
      <Alert type="warning" message="Warn Tips" autoClose closeable={false} onClose={()=>{console.log('closed')}} />
    </div>
  )
}
```
:::


### Attributes

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| type | alert type | string | info \| success \| error \| warning | info |
| message | alert tips | string | - | - |
| title | alert title | string | - | - |
| size | windows size | string | small \| middle \| large | middle |
| closeable | whether to display close button | boolean | true \| false | true |
| autoClose |  autoClose | boolean | true \| false |  false |
| autoCloseTime | auto close time，Unit:ms | number | - | 3000 |


### Events

| Event Name       | Description   |  Parameters
| ------- | ------- | ------- |
| onClose | triggers when closed | - |
