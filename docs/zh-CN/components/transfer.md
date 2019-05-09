## Transfer


### 基础用法

:::demo

基础用法

```js
constructor () {
  super()
  this.state = {
    datas1: this.randomDatas(),
    datas2: this.randomDatas(),
    datas3: this.randomDatas(),
    datas4: this.randomDatas(),
    datas5: this.randomDatas(),
    targetKeys1: [2, 3],
    targetKeys2: [],
    targetKeys3: [],
    targetKeys4: [],
    targetKeys5: []
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
onChange (d, movedKeys) {
  this.setState({
    [d]: movedKeys
  })
}
render () {
  return (
    <div>
      普通：
      <Transfer 
        mode='basic'
        targetKeys={this.state.targetKeys1}
        data={this.state.datas1}
        onChange={this.onChange.bind(this, 'targetKeys1')}
      />
      <br/>
      无全选：
      <Transfer 
        mode='multiple'
        targetKeys={this.state.targetKeys2}
        data={this.state.datas2}
        onChange={this.onChange.bind(this, 'targetKeys2')}
      />
      <br/>
      显示全选：
      <Transfer 
        mode='multiple'
        showAllSelect
        targetKeys={this.state.targetKeys3}
        data={this.state.datas3}
        onChange={this.onChange.bind(this, 'targetKeys3')}
      />
      <br/>
      带搜索：
      <Transfer 
        mode='multiple'
        showAllSelect
        searchable
        targetKeys={this.state.targetKeys4}
        data={this.state.datas4}
        onChange={this.onChange.bind(this, 'targetKeys4')}
      />
      <br/>
      带搜索：
      <Transfer 
        mode='multiple'
        showAllSelect
        searchable
        targetKeys={this.state.targetKeys4}
        data={this.state.datas4}
        onChange={this.onChange.bind(this, 'targetKeys4')}
      />
      
      <br/>
      目标数量上限：
      <Transfer 
        mode='multiple'
        showAllSelect
        searchable
        targetLimit={5}
        targetKeys={this.state.targetKeys5}
        data={this.state.datas5}
        onChange={this.onChange.bind(this, 'targetKeys5')}
      />
      
    </div>
  )
}
```
:::



### Alert Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 类型 | String | info \| success \| error \| warning | info |
| message | 提示内容 | String | - | - |
| title | 提示标题 | String | - | - |
| size | 弹框大小类型 | String | small \| middle \| large | middle |
| closeable | 是否显示关闭按钮 | Boolean | true  \| false | true |
| autoClose |  是否自动关闭（closeable 为 false 时生效） | Boolean | true  \| false |  false |
| autoCloseTime | 自动关闭时间，单位为毫秒 | Number | - | 3000 |


### Alert Events

| 参数 | 说明 | 回调参数
| ------- | ------- | ------- |
| onClose | 关闭时触发的事件 | - |
