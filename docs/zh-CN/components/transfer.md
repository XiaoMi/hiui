## Transfer

### 基础用法

:::demo

基础用法

```js
constructor () {
  super()
  this.state = {
    datas: this.randomDatas(),
    targetKeys: [2, 3]
  }
}
randomDatas () {
  const arr = []
  for (let i=1;i<16; i++) {
    arr.push({
      id: i,
      content: '选项'+i,
      disabled: i%3 === 0
    })
  }
  return arr
}
onChange (movedKeys) {
  this.setState({
    targetKeys: movedKeys
  })
}
render () {
  return (
    <Transfer 
      mode='basic'
      emptyContent={['空', '无数据']}
      title={['左标题', '右标题']}
      targetKeys={this.state.targetKeys}
      data={this.state.datas}
      onChange={this.onChange.bind(this)}
    />
  )
}
```
:::


### 批量

:::demo

批量

```js
constructor () {
  super()
  this.state = {
    datas: this.randomDatas(),
    targetKeys: [],
    disabled: false
  }
}
randomDatas () {
  const arr = []
  for (let i=1;i<16; i++) {
    arr.push({
      id: i,
      content: '选项'+i,
      disabled: i%3 === 0
    })
  }
  return arr
}
onChange (movedKeys) {
  this.setState({
    targetKeys: movedKeys,
    disabled: movedKeys.length > 5
  })
}
render () {
  return (
    <div>
      <Transfer 
        mode='multiple'
        title={['批量']}
        disabled={this.state.disabled}
        targetKeys={this.state.targetKeys}
        data={this.state.datas}
        onChange={this.onChange.bind(this)}
      />
    </div>
  )
}
```
:::

### 全选

:::demo

全选

```js
constructor () {
  super()
  this.state = {
    datas: this.randomDatas(),
    targetKeys: [2, 3]
  }
}
randomDatas () {
  const arr = []
  for (let i=1;i<16; i++) {
    arr.push({
      id: i,
      content: '选项'+i
    })
  }
  return arr
}
onChange (movedKeys) {
  this.setState({
    targetKeys: movedKeys
  })
}
render () {
  return (
    <Transfer 
      mode='multiple'
      showAllSelect
      targetKeys={this.state.targetKeys}
      data={this.state.datas}
      onChange={this.onChange.bind(this)}
    />
  )
}
```
:::


### 搜索

:::demo

搜索

```js
constructor () {
  super()
  this.state = {
    datas: this.randomDatas(),
    targetKeys: [2, 3]
  }
}
randomDatas () {
  const arr = []
  for (let i=1;i<16; i++) {
    arr.push({
      id: i,
      content: '选项'+i
    })
  }
  return arr
}
onChange (movedKeys) {
  this.setState({
    targetKeys: movedKeys
  })
}
render () {
  return (
    <Transfer 
      mode='multiple'
      showAllSelect
      searchable
      targetKeys={this.state.targetKeys}
      data={this.state.datas}
      onChange={this.onChange.bind(this)}
    />
  )
}
```
:::


### 目标数量上限

:::demo

目标数量上限

```js
constructor () {
  super()
  this.state = {
    datas: this.randomDatas(),
    targetKeys: []
  }
}
randomDatas () {
  const arr = []
  for (let i=1;i<16; i++) {
    arr.push({
      id: i,
      content: '选项'+i
    })
  }
  return arr
}
onChange (movedKeys) {
  this.setState({
    targetKeys: movedKeys
  })
}
render () {
  return (
    <Transfer 
      mode='multiple'
      showAllSelect
      targetLimit={4}
      targetKeys={this.state.targetKeys}
      data={this.state.datas}
      onChange={this.onChange.bind(this)}
    />
  )
}
```
:::

### 目标区域拖拽

:::demo

目标区域拖拽

```js
constructor () {
  super()
  this.state = {
    datas: this.randomDatas(),
    targetKeys: [2, 3, 4, 6, 9]
  }
}
randomDatas () {
  const arr = []
  for (let i=1;i<16; i++) {
    arr.push({
      id: i,
      content: '选项'+i
    })
  }
  return arr
}
onChange (movedKeys) {
  this.setState({
    targetKeys: movedKeys
  })
}
render () {
  return (
    <Transfer 
      mode='multiple'
      showAllSelect
      draggable
      targetKeys={this.state.targetKeys}
      data={this.state.datas}
      onChange={this.onChange.bind(this)}
    />
  )
}
```
:::


### Alert Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| mode | 类型 | String | basic \| multiple | basic |
| showAllSelect |  是否显示全选按钮 |  Boolean | true  \| false | false |
| title | 标题  <br/> 数组长度1或2位，1位时左右标题将相同，2位时将使用对应索引标题  | Array[String \| Element] | - | '' |
| searchable |  是否可筛选 |  Boolean | true  \| false | false |
| emptyContent |  数据为空时的显示内容 <br/> 数组长度1或2位，1位时左右内容将相同，2位时将使用对应索引内容| Array[String \| Element] | - | 暂无数据 |
| draggable |  是否允许目标框内拖拽排序 | Boolean | true  \| false |  false |
| targetKeys | 目标框内的元素id集合 | Array | - | - |
| data |  数据集合 | Array | - |  参见 Data Options |
| targetLimit |  目标框数据上限 |  Number | - |  null |



### Data Options
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| id |  唯一 id | Number | - | - |
| content |  元素内容 | String \| Element | - | - |
| disabled |   该元素是否被禁用 | Boolean | true  \| false |  false |

### Alert Events

| 参数 | 说明 | 回调参数
| ------- | ------- | ------- |
| onChange | 选中元素被移动到目标框内后触发的事件函数 | 目标框内元素的 id 集合，如[2,3,4] |
