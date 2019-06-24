## Checkbox 多选框

### 基础

:::demo

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
      <Checkbox checked={this.state.checked}>受控</Checkbox>
      <Button size='small' type='primary' onClick={() => {
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

```js
constructor() {
  super()
  this.data = [{
    label: '手机',
    value: 0,
    disabled: true
  }, {
    label: 'AI',
    value: 1
  }, {
    label: 'IOT',
    value: 2
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

| 参数           | 说明             | 类型                       | 可选值        | 默认值 |
| -------------- | ---------------- | -------------------------- | ------------- | ------ |
| autoFocus      | 是否自动获取焦点 | boolean                    | true \| false | false  |
| checked        | 是否选中         | boolean                    | true \| false | false  |
| className      | 自定义类名       | string                     | -             | -      |
| defaultChecked | 是否默认选中     | boolean                    | true \| false | false  |
| disabled       | 是否禁用         | boolean                    | true \| false | false  |
| indeterminate  | 不全选的样式控制 | boolean                    | true \| false | false  |
| onChange       | 变化时的回调     | function(checked: boolean) | -             | -      |
| style          | 自定义样式       | CSSProperties              | -             | -      |

### Checkbox Group Attributes

| 参数         | 说明                                                         | 类型                                                                  | 可选值        | 默认值 |
| ------------ | ------------------------------------------------------------ | --------------------------------------------------------------------- | ------------- | ------ |
| className    | 自定义类名                                                   | string                                                                | -             | -      |
| data         | 指定可选项                                                   | Array<string \| number \| { label: string, value: string \| number, disabled?: boolean }> | -             | []     |
| defaultValue | 默认选中的项                                                 | Array<string \| number>                                               | -             | []     |
| disabled     | 是否禁用                                                     | boolean                                                               | true \| false | false  |
| name         | `CheckboxGroup` 下所有 `input[type="checkbox"]` 的 name 属性 | string                                                                | -             | -      |
| onChange     | 变化时的回调                                                 | function(checkedList: Array<string \| number>)                        | -             | -      |
| style        | 自定义样式                                                   | CSSProperties                                                         | -             | -      |
| value        | 指定选中的项                                                 | Array<string \| number>                                               | -             | -      |
