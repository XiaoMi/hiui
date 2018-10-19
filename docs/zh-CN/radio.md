## 单选按钮

单选按钮

### 普通模式

:::demo

普通模式

```js
constructor () {
  super()
  this.state = {
    play : [{
      name: '手机',
      id: 101
    }, {
      name: '电视',
      id: 102
    }],
    people: [{
      name: '张某某',
      id: 1,
      checked: true
    }, {
      name: '李某某',
      id: 2
    }, {
      name: '王某某',
      id: 3,
      checked: true
    }, {
      name: '赵某某',
      id: 4
    }],
    address: [{
      id: 1001,
      name: '中国'
    }, {
      id: 1002,
      name: '俄罗斯'
    }, {
      id: 1003,
      name: '美国'
    }]
  }
}
render() {
  return (
    <div>
        <p>简单数据 (通过数据索引设置默认选中)</p>
        <Radio 
          list={['北京', '上海', '重庆']} 
          checked={2} 
          onChange={(data)=>{
            console.log(data)
          }}
        />
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
          list={this.state.people} 
          onChange={(data)=>{
            console.log(data)
          }}
          disabled={(item) => item.id === 1 || item.id === 3}
        />
        <p>复杂数据结构 (通过函数确定选中项)</p>
        <Radio 
          list={this.state.address} 
          onChange={(data)=>{
            console.log(data)
          }}
          checked={(item) => item.id === 1002}
        />
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
        <p>垂直布局</p>
        <Radio 
          list={['春', '夏', '秋']} 
          layout='vertical'
        />
        <br/>
        <p>按钮式</p>
        <Radio 
          list={['北京', '上海', '重庆']} 
          mode='button'
          checked={0}
          disabled={this.state.disableNum}
          onChange={(data) => console.log(data)}
        />
        <br/>
        <p>按钮式垂直布局</p>
        <Radio 
          list={['北京', '上海', '重庆']} 
          mode='button'
          checked={0}
          disabled={0}
          onChange={(data) => console.log(data)}
          layout='vertical'
        />
    </div>
  )
}
```
:::

### Attributes

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