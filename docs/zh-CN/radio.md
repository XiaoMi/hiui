## 单选按钮

单选按钮

### 普通模式

:::demo

普通模式

```js
constructor () {
  super()
  this.state = {
    checked: 2,
    play : [{
      name: '手机',
      id: 101
    }, {
      name: '电视',
      id: 102
    }],
    product: [{
      name: '红米手机',
      id: 1,
      checked: true
    }, {
      name: '小米 MIX3',
      id: 2
    }, {
      name: '扫地机器人',
      id: 3,
      checked: true
    }, {
      name: '新风机',
      id: 4
    }],
    type: [{
      id: 1001,
      name: '电子产品'
    }, {
      id: 1002,
      name: '办公用品'
    }, {
      id: 1003,
      name: '家居用品'
    }]
  }
}
render() {
  return (
    <div>
        <p>简单数据 (通过数据索引设置默认选中)</p>
        <Radio 
          list={['北京', '上海', '重庆']} 
          checked={this.state.checked} 
          onChange={(data)=>{
            console.log(data)
          }}
        />
        <Button type='default' onClick={() => {this.setState({checked: 0})}}>点击</Button>
        <p>复杂数据结构 (通过数据索引设置默认选中)</p>
        <Radio 
          list={this.state.play} 
          onChange={(data)=>{
            console.log(data)
          }}
          checked={1}
          disabled={1}
        />
        <p>复杂数据结构 (通过列表项设置选中)</p>
        <Radio 
          list={this.state.product} 
          onChange={(data)=>{
            console.log(data)
          }}
          disabled={(item) => item.id === 1 || item.id === 3}
        />
        <p>复杂数据结构 (通过函数确定选中项)</p>
        <Radio 
          list={this.state.type} 
          onChange={(data)=>{
            console.log(data)
          }}
          checked={(item) => item.id === 1002}
        />
        <p>垂直布局</p>
          <Radio 
            list={['春', '夏', '秋']} 
            layout='vertical'
          />
          <br/>
    </div>
  )
}
```
:::

### 按钮模式

:::demo

按钮模式

```js
constructor () {
  super()
  this.state = {
    disableNum : 2
  }
}
render() {
  return (
    <div>
        <Radio 
          list={['手机类', '电脑类', '生活类', '其它']} 
          mode='button'
          checked={0}
          disabled={this.state.disableNum}
          onChange={(data) => console.log(data)}
        />
        <br/>
        
    </div>
  )
}
```
:::

### Radio Attributes

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| name |  单选组名称  | string   | - | 一般情况下无需传递，组件默认生成 |
| list |   选择项  |  array   | - | - |
| align |   label 对齐方式  | string   | left/right | right |
| checked |   应用于 list 内的数据项时为布尔值，表示该项是否被选中<br/>多个列表项均含有此属性时，会以最后一项为主<br/>---<br/>应用于组件属性时为数字或函数<br/>为数字时，代表被选中项的索引值，从0开始<br/>为函数时，函数返回当前项，通过比对后返回布尔值来决定该项是否被选中  | bool/number/func   | - | -1 |
| onChange |     选中事件  |   function  | - | - |
| disabled |     是否禁用（应用于数据源无效）  |    number/function  | - | - |
| mode |    单选按钮样式  |     string  | normal/button | normal |
| layout |     排列方式  |     string  | horizontal/vertical | horizontal |