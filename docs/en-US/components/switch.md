## Switch


### Basic

:::demo

Basic

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
      <p>Default</p>
      <Switch />
      <p>Custom content</p>
      <Switch content={['ON', 'OFF']}/>
      <Switch content={[<Icon name='check' />, <Icon name='close' />]}/>
      <p>Disabled state</p>
      <p>
        <Button onClick={() => {this.setState({disabled: !this.state.disabled})}}>Toggle disabled</Button>
        <Button onClick={() => {this.setState({checked: !this.state.checked})}}>Toggle open</Button>
      </p>
      <Switch checked={this.state.checked} disabled={this.state.disabled} content={['ON', 'OFF']} onChange={this.onChange.bind(this)}/>
    </div>
  )
}
```
:::



###  Switch Attributes

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| content |  Custom display content |  Array[String \| Element] | - | '' |
| checked |  Specifies whether the switch is checked | Boolean | true  \| false |  false |
| disabled |  Specifies whether the switch is disabled | Boolean | true  \| false |  false |


###  Switch Events

| Event Name       | Description   |  Parameters
| ------- | ------- | ------- |
|  onChange |  callback | current status |
