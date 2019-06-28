## Checkbox 多选框

### 基础用法

:::demo
复选框基础用法。

```js
constructor() {
  super()
  this.state = {
    checked: true
  }
}
render() {
  return (
    <React.Fragment>
      <Checkbox autoFocus>Checkbox</Checkbox>
      <Checkbox defaultChecked>默认勾选</Checkbox>
    </React.Fragment>
  )
}
```

:::

### 禁用

:::demo
禁用状态。

```js
render() {
  return (
    <React.Fragment>
      <Checkbox disabled>Checkbox</Checkbox>
      <Checkbox defaultChecked disabled>Checkbox</Checkbox>
    </React.Fragment>
  )
}
```

:::

### 受控

:::demo
添加 `checked` 变为受控模式。

```js
constructor() {
  super()
  this.state = {
    checked: true
  }
}
render() {
  return (
    <React.Fragment>
      <Checkbox checked={this.state.checked} onChange={(event) => {
        this.setState({
          checked: event.target.checked
        })
      }}>受控</Checkbox>
      <Button type='primary' size='small' onClick={() => {
        this.setState(({ checked }) => ({
          checked: !checked
        }))
      }}>切换</Button>
    </React.Fragment>
  )
}
```

:::

### 分组

:::demo
分组选择。

```js
render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <CheckboxGroup
        name='strategy'
        data={['手机', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={console.log} />
      <p />
      <CheckboxGroup
        name='strategy'
        disabled
        data={['手机', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={console.log} />
    </React.Fragment>
  )
}
```

:::

### 受控分组

:::demo
分组添加 `value` 属性变为受控模式。

```js
constructor() {
  super()
  this.state = {
    value: ['AI']
  }
}

render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <CheckboxGroup
        value={this.state.value}
        data={['手机', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={value => {
          this.setState({ value })
        }} />
    </React.Fragment>
  )
}
```

:::

### 复杂数据

:::demo
复杂数据类型，变化时回调值为选择项的 id 集合。

```js
constructor() {
  super()
  this.data = [{
    content: '手机',
    id: 0,
    disabled: true
  }, {
    content: 'AI',
    id: 1
  }, {
    content: 'IOT',
    id: 2
  }]
}

render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <CheckboxGroup
        data={this.data}
        defaultValue={[0]}
        onChange={console.log} />
    </React.Fragment>
  )
}
```

:::

### 全选

:::demo
用 `indeterminate` 属性控制不全选的状态。

```js
constructor() {
  super()
  this.data = ['手机', 'AI', 'IOT']
  this.state = {
    value: ['AI'],
    checkAll: false
  }
  this.getIndeterminate = () => {
    const len = this.state.value.length
    return len < 3 && len > 0
  }
  this.handleCheckAllChange = () => {
    const len = this.state.value.length
    if (len < 3) {
      this.setState({
        checkAll: true,
        value: this.data
      })
    } else {
      this.setState({
        checkAll: false,
        value: []
      })
    }
  }
  this.handleGroupChange = (value) => {
    this.setState({
      value,
      checkAll: value.length === 3
    })
  }
}

render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <Checkbox
        indeterminate={this.getIndeterminate()}
        onChange={this.handleCheckAllChange}
        checked={this.state.checkAll}>全选</Checkbox>
      <hr />
      <CheckboxGroup
        value={this.state.value}
        data={this.data}
        onChange={this.handleGroupChange} />
    </React.Fragment>
  )
}
```

:::

### Checkbox Attributes

| 参数           | 说明             | 类型                                                 | 可选值        | 默认值 |
| -------------- | ---------------- | ---------------------------------------------------- | ------------- | ------ |
| autoFocus      | 是否自动获取焦点 | boolean                                              | true \| false | false  |
| checked        | 是否选中         | boolean                                              | true \| false | false  |
| className      | 自定义类名       | string                                               | -             | -      |
| defaultChecked | 是否默认选中     | boolean                                              | true \| false | false  |
| disabled       | 是否禁用         | boolean                                              | true \| false | false  |
| indeterminate  | 不全选的样式控制 | boolean                                              | true \| false | false  |
| onChange       | 变化时的回调     | (event: React.ChangeEvent<HTMLInputElement>) => void | -             | -      |

### Checkbox Group Attributes

| 参数         | 说明                                                         | 类型                                        | 可选值        | 默认值 |
| ------------ | ------------------------------------------------------------ | ------------------------------------------- | ------------- | ------ |
| className    | 自定义类名                                                   | string                                      | -             | -      |
| data         | 指定可选项                                                   | string[] \| number[] \| DataItem[]          | -             | []     |
| defaultValue | 默认选中的项                                                 | string[] \| number[]                        | -             | []     |
| disabled     | 是否禁用                                                     | boolean                                     | true \| false | false  |
| name         | `CheckboxGroup` 下所有 `input[type="checkbox"]` 的 name 属性 | string                                      | -             | -      |
| onChange     | 变化时的回调                                                 | (checkedList: string[] \| number[]) => void | -             | -      |
| style        | 自定义样式                                                   | CSSProperties                               | -             | -      |
| value        | 指定选中的项                                                 | string[] \| number[]                        | -             | -      |

### Type

#### _DataItem_

| 参数     | 说明         | 类型             |
| -------- | ------------ | ---------------- |
| id       | 数据唯一标识 | string \| number |
| content  | 数据显示内容 | string \| number |
| disabled | 是否禁用该项 | boolean          |
