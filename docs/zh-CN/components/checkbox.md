## Checkbox 多选框

### 基础

:::demo
```js
render() {
  return (
    <div>
      <Checkbox value='default' onChange={(val, isCheck) => console.log(val, isCheck)}>Checkbox</Checkbox>
      <Checkbox disabled>Checkbox(disabled)</Checkbox>
      <Checkbox checked onChange={(val, isCheck) => console.log(val, isCheck)}>Checkbox</Checkbox>
      <Checkbox disabled checked>Checkbox(checked)</Checkbox>
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
    list: ['手机', '电脑', '智能'],
    list2: [{
      text: '手机',
      value: 'Phone',
      checked: true
    },{
      text: '电脑',
      value: 'Computer'
    },{
      text: '智能'
    },{
      text: '出行',
      disabled: true,
      checked: true
    }]
  }
  this.onChange = this.onChange.bind(this)
}
onChange(list, value, isChecked) {
  console.log(list, value, isChecked)
}
render() {
  return (
    <div>
      <p>基础 list 数据</p>
      <div><Checkbox list={this.state.list} onChange={this.onChange} name="c1"/></div>
      <br/>
      <p>复杂 list 数据</p>
      <div><Checkbox list={this.state.list2} onChange={this.onChange} name="c2"/></div>
      <br/>
      <p>多个 checkbox，实现多选</p>
      <div>
        <Checkbox value='phone' onChange={this.onChange} name='c3'>手机</Checkbox>
        <Checkbox value='computer' onChange={this.onChange} name='c3'>电脑</Checkbox>
        <Checkbox value='smart' onChange={this.onChange} name='c3'>智能</Checkbox>
        <Checkbox value='travel' onChange={this.onChange} name='c3'>出行</Checkbox>
      </div>
       <br/>
      <i>多选模式下，子选项 name 需相同</i>
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
    title: 'aaa',
    checked: false,
    list: [{
      text: '手机',
      value: 'phone'
    },{
      text: '电脑',
      value: 'computer'
    },{
      text: '智能',
      checked: true
    },{
      text: '出行',
      disabled: true,
      checked: true
    }]
  }
  this.onChange = this.onChange.bind(this)
}
onChange() {

}
render() {
  return (
    <div>
      <div>
        <p>通过 all 与 name 的对应关系决定全选框与选择框的关系</p>
        <Checkbox all='one' onChange={this.onChange}>全选</Checkbox>
        <div><Checkbox list={this.state.list} name='one'/></div>
        <br/>
        <p>多个选择框组成全选功能</p>
        <div>
          <Checkbox all='two' onChange={this.onChange}> 全选</Checkbox>
          <div><Checkbox name='two' text='手机'/></div>
          <div><Checkbox name='two' value='computer'>电脑</Checkbox></div>
          <div><Checkbox name='two' text='智能'/></div>
          <div><Checkbox name='two' checked={true} text='出行'/></div>
          <br/>
        </div>
      </div>
      <br/>
      
    </div>
  )
}
```
:::

### Checkbox Attributes

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| value |  Checkbox 的值;含有 value 属性时，选中回调将返回该值，否则返回对应文本内容  |  string,number,boolean   | - | |
| text |   Checkbox 显示的文本;当含有 text 属性时将忽略 Checkbox 子元素  |  string,number,boolean   | - | |
| checked |   是否默认选中  |  boolean   | true 或 false | false |
| disabled |   是否默认禁用  |  boolean   | true 或 false | false |
|  list |   多选数据  |  array   |  参见 List Options |  |
|  all |   全选框标识，标明该项为全选checkobx，文本将标示为「全选」  |   string   | - |  |
|  name |   子选项标识<br/> 仅用于全选模式下的子选项 或 多选模式<br/> 全选模式：name 值需与 all 的值相同<br/>多选模式：同级子选项 name 相同  |   string   | - |  |


#### List Options
| 参数     | 说明   |  类型  | 可选值 | 默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| text |   显示文本  |  String   | 必需 | - |
|  value |   选项的值  |   String \| Number \| Boolean   | - | - |
| checked |   是否选中 |    Boolean   | - | false |
| disabled |    是否禁用  |   Boolean   | - | false |

### Checkbox Events
| 参数       | 说明   |  类型  | 
| --------   | -----  | ----  |   
| onChange | 选择回调函数   |   function  | 当单个选择框时，返回点击的 value 及是否被选择<br/>当多选时，返回被选中的数组 
