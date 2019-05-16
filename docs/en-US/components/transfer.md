## Transfer

### Basic

:::demo

Basic

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
      content: 'Option '+i,
      disabled: i%3 === 0
    })
  }
  return arr
}
onChange ( movedKeys) {
  this.setState({
    targetKeys: movedKeys
  })
}
render () {
  return (
    <Transfer 
      mode='basic'
      emptyContent={['Null', 'Empty']}
      title={['Left Title', 'Right Title']}
      targetKeys={this.state.targetKeys}
      data={this.state.datas}
      onChange={this.onChange.bind(this)}
    />
  )
}
```
:::


### Batch

:::demo

Batch

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
      content: 'Option '+i,
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
        title={['Batch']}
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

### All Select

:::demo

All Select

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
      content: 'Option '+i
    })
  }
  return arr
}
onChange ( movedKeys) {
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


### Search 

:::demo

Search 

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
      content: 'Option '+i
    })
  }
  return arr
}
onChange ( movedKeys) {
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


### Target Limit

:::demo

Target Limit

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
      content: 'Option '+i
    })
  }
  return arr
}
onChange ( movedKeys) {
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

### Target Drag

:::demo

Target Drag

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
      content: 'Option '+i
    })
  }
  return arr
}
onChange ( movedKeys) {
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

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| mode | Type | String | basic \| multiple | basic |
| showAllSelect |  Specifies whether to display the all-select |  Boolean | true  \| false | false |
| title | Title    | Array[String \| Element] | - | '' |
| searchable |   Specifies whether it screenable |  Boolean | true  \| false | false |
| emptyContent |  Display content when the data is empty | Array[String \| Element] | - | Empty |
| draggable |  Whether to allow drag and drop sorting within the target box | Boolean | true  \| false |  false |
| targetKeys | The set of element ids in the target box | Array | - | - |
| data |  Datas | Array | - |  参见 Data Options |
| targetLimit |  Target frame data limit |  Number | - |  null |



### Data Options
| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| id |   id | Number | - | - |
| content |  Content | String \| Element | - | - |
| disabled |   disabled | Boolean | true  \| false |  false |

### Alert Events

| Event Name       | Description   |  Parameters
| ------- | ------- | ------- |
| onChange | callabck | The id collection of the elements in the target box，eg.[2,3,4] |
