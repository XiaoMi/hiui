## Notification

### 基础

:::demo

```js
  render(){
    return(
      <div>
        <Button type="success" onClick={this.open.bind(this)}>自动关闭</Button>
        <br/>
        <Button type="info" onClick={this.open1.bind(this)}>不自动关闭</Button>
      </div>
    )
  }

  open(){
    handleNotificate({type: 'success',autoClose:true,title:'标题',message:'我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动',onClose:()=>{console.log('关闭回调')}})
  }
  open1(){
    handleNotificate({autoClose:false,title:'标题',message:'我不会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭我会自动关闭',onClose:()=>{console.log('关闭回调')}})
  }

```
:::

### Attribute

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 类型 | string | info/error/success/warning | info |
| message | 提示内容 | string | - | 无 |
| title | 提示标题 | string | - | 无 |
| autoClose | 是否自动关闭 | bool | - | false |
| onClose | 关闭回调 | func | - | 无 |