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

### Props

| 参数      | 说明             | 类型                   | 可选值                 | 默认值     |
| --------- | ---------------- | ---------------------- | ---------------------- | ---------- |
| data      | 选择项           | DataItem []            | -                      | -          |
| autoFocus | 是否自动获取焦点 | boolean                | true \| false          | false      |
| placement | 放置方式         | string                 | vertical \| horizontal | horizontal |
| checked   | 选中项           | string                 | vertical \| horizontal | horizontal |
| onChange  | 选中事件         | (value:string) => void | -                      | -          |
| disabled  | 是否禁用         | boolean                | -                      | -          |
| type      | 类型             | string                 | default \| button      | default    |

### Type

**_DataItem_**

| 参数     | 说明     | 类型    | 可选值 | 默认值 |
| -------- | -------- | ------- | ------ | ------ |
| content  | 选择项   | string  | -      | -      |
| id       | 选择项值 | string  | -      | -      |
| disabled | 是否禁用 | boolean | -      | -      |
