## Switch


### 基础用法

:::demo

基础用法

```js
constructor (props) {
  super(props)
  this.state = {
    checked: true,
    disabled: true
  }
}
onChange (status) {
  console.log(status)
}
render () {
  return (
    <div>
      <p>默认</p>
      <Switch />
      <p>自定义内容</p>
      <Switch content={['ON', 'OFF']}/>
      <Switch content={[<Icon name='check' />, <Icon name='close' />]}/>
      <p>禁用状态</p>
      <p>
        <Button onClick={() => {this.setState({disabled: !this.state.disabled})}}>切换禁用</Button>
        <Button onClick={() => {this.setState({checked: !this.state.checked})}}>切换开启</Button>
      </p>
      <Switch checked={this.state.checked} disabled={this.state.disabled} content={['开', '关']} onChange={this.onChange.bind(this)}/>
    </div>
  )
}
```
:::



###  Switch Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| content |  自定义显示内容 |  Array[String \| Element] | - | '' |
| checked |  是否默认开启状态 | Boolean | true  \| false |  false |
| disabled |  是否默认禁用状态 | Boolean | true  \| false |  false |
| size | 弹框大小类型 | String | small \| middle \| large | middle |


###  Switch Events

| 参数 | 说明 | 回调参数 |
| ------- | ------- | ------- |
|  onChange |  切换的回调函数 | 当前状态 |
