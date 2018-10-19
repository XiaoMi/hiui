## Checkbox

Normal

:::demo
```js
render() {
  return (
    <div>
      <p><Checkbox value='one' onChange={(val, isCheck) => console.log(val, isCheck)}>unCheck</Checkbox></p>
      <p><Checkbox disabled>unCheck & disabled</Checkbox></p>
      <p><Checkbox checked onChange={(val, isCheck) => console.log(val, isCheck)}>Checked</Checkbox></p>
      <p><Checkbox disabled checked>Checked & disabled</Checkbox></p>
    </div>
  )
}
```
:::

trueValue | falseValue
:::demo
```js
render() {
  return (
    <div>
      <p>Set selected and unselected values with trueValue and falseValue (trueValue | falseValue  > value > content)</p>
      <p><Checkbox  trueValue='yes' falseValue='no' onChange={(val, isCheck) => console.log(val, isCheck)}>basketball</Checkbox>--Both trueValue and falseValue</p>
      <p><Checkbox  value='yes' falseValue='no' onChange={(val, isCheck) => console.log(val, isCheck)}>football</Checkbox>--Both value and falseValue</p>
      <p><Checkbox  falseValue='no'  onChange={(val, isCheck) => console.log(val, isCheck)}>volleyball</Checkbox>--only falseValue</p>
    </div>
  )
}
```
:::

多选
:::demo
```js
constructor () {
  super()
  this.state = {
    list: ['football', 'basketball', 'volleyball'],
    list2: [{
      text: 'BeiJing',
      value: 'BeiJint',
      trueValue: 'BJ',
      falseValue: 'b',
      checked: true
    },{
      text: 'ShangHai',
      value: ' ShangHai'
    },{
      text: 'ShenZhen'
    },{
      text: 'TianJin',
      disabled: true,
      checked: true
    }]
  }
}
render() {
  return (
    <div>
      <p>multi-select mode, suboption name is the same</p>
      <br/>
      <div><Checkbox list={this.state.list} onChange={(list) => console.log(list)} name="c1"/></div>
      <br/>
      <div><Checkbox list={this.state.list2} onChange={(list) => console.log(list)} name="c2"/></div>
      <br/>
      <p>any position</p>
      <div>
        <Checkbox value='one' onChange={(val) => console.log(val)} name='c3'>apple</Checkbox>
        <Checkbox value='two' onChange={(val) => console.log(val)} name='c3'>banana</Checkbox>
        <Checkbox value='three' onChange={(val) => console.log(val)} name='c3'>pear</Checkbox>
        <Checkbox value='four' onChange={(val) => console.log(val)} name='c3'>durian</Checkbox>
      </div>
    </div>
  )
}
```
:::

select all
:::demo
```js
constructor () {
  super()
  this.state = {
    list: [{
      text: 'BeiJing',
      value: 'bj'
    },{
      text: 'ShangHai',
      value: ' sh'
    },{
      text: 'ShenZhen'
    },{
      text: 'TianJin',
      disabled: true,
      checked: true
    }]
  }
}
render() {
  return (
    <div>
      <div>
        <Checkbox all='one' onChange={(list) => console.log(list)}>all</Checkbox>
        <div><Checkbox list={this.state.list} name='one'/></div>
        <br/>
      </div>
      <br/>
      <div>
        <Checkbox all='two' onChange={(list, target) => console.log(list, target)}> all</Checkbox>
        <div><Checkbox text='BeiJing' name='two'/></div>
        <div><Checkbox name='two' value='ShangeHai'>ShangHai</Checkbox></div>
        <div><Checkbox name='two' text='ShenZhen'/></div>
        <div><Checkbox name='two' text='TianJin'/></div>
        <br/>
      </div>
    </div>
  )
}
```
:::

### Attributes

| Attribute | Description | Type | Options | Default  |
| --------   | -----  | ----  |    ----  |   ----  |
| value |  checkbox value  |  string,number,boolean   | - | |
| trueValue |  checked value  |  string,number   | - | |
| falseValue |  Uncheck value  |  string,number   | - | |
| checked |   default checked  |  boolean   | true 或 false | false |
| disabled |   disabled  |  boolean   | true 或 false | false |
|  list |   multiple selection list |  array   | - |  |
|  all |   all check  |   string   | - |  |
|  name |   Sub-option identification in all-select or multi-select mode(all-select: The 'name' value is consistent with the 'all' value  multi-select: Peer name should be consistent)  |   string   | - |  |

### Events
| 参数       | 说明   |  类型  | 说明 |
| --------   | -----  | ----  |    ----  |
| onChange | triggers when the Checkbox changed   |   function  | - | 
