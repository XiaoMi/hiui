## Checkbox 多选框

### 基础

:::demo
```js
render() {
  return (
    <div>
      <p><Checkbox value='one' onChange={(val, isCheck) => console.log(val, isCheck)}>未选中项</Checkbox></p>
      <p><Checkbox disabled>未选中失效</Checkbox></p>
      <p><Checkbox checked onChange={(val, isCheck) => console.log(val, isCheck)}>选中项</Checkbox></p>
      <p><Checkbox disabled checked>选中失效</Checkbox></p>
    </div>
  )
}
```
:::

### 自定义选中值
:::demo
```js
render() {
  return (
    <div>
      <p>通过 trueValue 与 falseValue 设置选中与未选中对应的值。属性不存在时会查找 value 属性，value 属性不存在会返回文字内容。<br/>(优先级： trueValue | falseValue  > value > content)</p>
      <p><Checkbox  trueValue='打篮球' falseValue='不打篮球' onChange={(val, isCheck) => console.log(val, isCheck)}>篮球</Checkbox>--同时含有 trueValue 与 falseValue</p>
      <p><Checkbox  value='踢足球' falseValue='不踢足球' onChange={(val, isCheck) => console.log(val, isCheck)}>足球</Checkbox>--同时含有 value 与 falseValue</p>
      <p><Checkbox  falseValue='不玩排球'  onChange={(val, isCheck) => console.log(val, isCheck)}>排球</Checkbox>--只含有 falseValue</p>
    </div>
  )
}
```
:::

### 多选
:::demo
```js
constructor () {
  super()
  this.state = {
    list: ['足球', '篮球', '排球'],
    list2: [{
      text: '北京',
      value: 'BeiJint',
      trueValue: 'BJ',
      falseValue: ' 北',
      checked: true
    },{
      text: '上海',
      value: ' ShangHai'
    },{
      text: '深圳'
    },{
      text: '天津',
      disabled: true,
      checked: true
    }]
  }
}
render() {
  return (
    <div>
      <p>多选模式下，需子选项 name 相同</p>
      <br/>
      <p>list 项为普通字符串</p>
      <div><Checkbox list={this.state.list} onChange={(list) => console.log(list)} name="c1"/></div>
      <br/>
      <p>list 项为对象</p>
      <div><Checkbox list={this.state.list2} onChange={(list) => console.log(list)} name="c2"/></div>
      <br/>
      <p>也可使用多个 checkbox，实现多选效果，可放置于任意位置</p>
      <div>
        <Checkbox value='one' onChange={(val) => console.log(val)} name='c3'>苹果</Checkbox>
        <Checkbox value='two' onChange={(val) => console.log(val)} name='c3'>香蕉</Checkbox>
        <Checkbox value='three' onChange={(val) => console.log(val)} name='c3'>梨</Checkbox>
        <Checkbox value='four' onChange={(val) => console.log(val)} name='c3'>榴莲</Checkbox>
      </div>
    </div>
  )
}
```
:::

全选
:::demo
```js
constructor () {
  super()
  this.state = {
    list: [{
      text: '北京',
      value: 'BeiJing'
    },{
      text: '上海',
      value: ' ShangHai'
    },{
      text: '深圳'
    },{
      text: '天津',
      disabled: true,
      checked: true
    }]
  }
}
render() {
  return (
    <div>
      <div>
        <Checkbox all='one' onChange={(list) => console.log(list)}>全选</Checkbox>
        <div><Checkbox list={this.state.list} name='one'/></div>
        <br/>
      </div>
      <br/>
      <div>
        <Checkbox all='two' onChange={(list, target) => console.log(list, target)}> 全选</Checkbox> <span>(子选项可放置于任何位置，只需 name 相同)</span>
        <div><Checkbox text='北京' name='two'/></div>
        <div><Checkbox name='two' value='ShangeHai'>上海</Checkbox></div>
        <div><Checkbox name='two' text='深圳'/></div>
        <div><Checkbox name='two' text='天津'/></div>
        <br/>
      </div>
    </div>
  )
}
```
:::

### Attributes

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| value |  选中的值  |  string,number,boolean   | - | |
| trueValue |  选中时的值  |  string,number   | - | |
| falseValue |  取消选中时的值  |  string,number   | - | |
| checked |   是否默认选中  |  boolean   | true 或 false | false |
| disabled |   是否禁用  |  boolean   | true 或 false | false |
|  list |   多选  |  array   | - |  |
|  all |   全选框标识（用于全选框属性））  |   string   | - |  |
|  name |   全选或多选模式下子选项标识（用于全选或多选模式，且 name 值与 all 值保持一致，当没有全选框时，同级选项 name 应保持一致））  |   string   | - |  |

### Events
| 参数       | 说明   |  类型  | 说明 |
| --------   | -----  | ----  |    ----  |
| onChange | 选择回调函数   |   function  | 当单个选择框时，返回点击的 value 及是否被选择<br/>当多选时，返回被选中的数组 | 
