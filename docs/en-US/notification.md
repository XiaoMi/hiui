## Notification

### Basic

:::demo

```js
  render(){
    return(
      <div>
        <Button type="success" onClick={this.open.bind(this)}>Auto close</Button>
        <Button type="info" onClick={this.open1.bind(this)}>Does not automatically close</Button>
      </div>
    )
  }

  open(){
    handleNotificate({type: 'success',autoClose:true,title:'Title',message:'Message',onClose:()=>{console.log('Callback')}})
  }
  open1(){
    handleNotificate({autoClose:false,title:'标Title题',message:'Message',onClose:()=>{console.log('Callback')}})
  }

```
:::

### Attributes

| Attribute | Description | Type | Options | Default |
| -------- | ----- | ---- | ---- | ---- |
| type | type | string | info/error/success/warning | info |
| message | message | string | - | null |
| title | title | string | - | null |
| autoClose | autoClose | bool | - | false |
| onClose | Callback | func | - | null |