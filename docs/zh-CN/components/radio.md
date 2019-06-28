# 单选按钮

单选按钮

## 基础用法

:::demo

```js
render() {
  return <React.Fragment>
    <Radio autoFocus>Radio</Radio>
    <Radio defaultChecked>默认选择</Radio>
  </React.Fragment>
}
```

:::

## 受控

:::demo

```js
constructor() {
  super()
  this.state = {
    checked: true
  }
}
render() {
  return <React.Fragment>
    <Radio checked={this.state.checked} onChange={(event) => {
      this.setState({
        checked: event.target.checked
      })
    }}>Radio</Radio>
    <Button type='primary' onClick={() => {
      this.setState(({ checked }) => ({
        checked: !checked
      }))
    }}>切换</Button>
  </React.Fragment>
}
```

:::

## 禁用状态

:::demo

```js
render() {
  return <React.Fragment>
    <Radio disabled>Radio</Radio>
    <Radio defaultChecked disabled>默认选择</Radio>
  </React.Fragment>
}
```

:::

## 分组

:::demo

```js
render() {
  return <React.Fragment>
    <Radio.Group defaultValue='AI' data={['手机', 'AI', 'IOT']} onChange={console.log} />
    <p />
    <Radio.Group defaultValue='AI' data={['手机', 'AI', 'IOT']} disabled />
  </React.Fragment>
}
```

:::

## 受控分组

:::demo

```js
constructor() {
  super()
  this.state = {
    value: 'AI'
  }
}

render() {
  return <React.Fragment>
    <Radio.Group value={this.state.value} data={['手机', 'AI', 'IOT']} onChange={(value) => {
      this.setState({ value })
    }} />
  </React.Fragment>
}
```

:::

## 复杂数据

:::demo

```js
constructor() {
  super()
  this.data = [{
    id: 0,
    content: '手机',
    disabled: true
  }, {
    id: 1,
    content: 'AI'
  }, {
    id: 2,
    content: 'IOT'
  }]
  this.state = {
    value: 1
  }
}

render() {
  return <React.Fragment>
    <Radio.Group value={this.state.value} data={this.data} onChange={(value) => {
      this.setState({ value })
    }} />
  </React.Fragment>
}
```

:::

## 按钮模式

:::demo

```js
constructor() {
  super()
  this.data = [{
    id: 0,
    content: '手机',
    disabled: true
  }, {
    id: 1,
    content: 'AI'
  }, {
    id: 2,
    content: 'IOT'
  }]
}

render() {
  return <React.Fragment>
    <Radio.Group type='button' defaultValue='AI' data={['手机', 'AI', 'IOT']} />
    <p />
    <Radio.Group type='button' defaultValue='AI' data={['手机', 'AI', 'IOT']} disabled />
    <p />
    <Radio.Group type='button' defaultValue={1} data={this.data} />
  </React.Fragment>
}
```

:::

## Radio Attributes

| 参数           | 说明             | 类型                                                 | 可选值                | 默认值    |
| -------------- | ---------------- | ---------------------------------------------------- | --------------------- | --------- |
| autoFocus      | 是否自动获取焦点 | boolean                                              | true \| false         | false     |
| checked        | 是否选中         | boolean                                              | true \| false         | false     |
| defaultChecked | 是否默认选中     | boolean                                              | true \| false         | false     |
| disabled       | 是否禁用         | boolean                                              | true \| false         | false     |
| type           | 按钮形状         | string                                               | 'default' \| 'button' | 'default' |
| onChange       | 变化时的回调     | (event: React.ChangeEvent<HTMLInputElement>) => void | -                     | -         |

## Radio.Group Attributes

| 参数         | 说明                                                    | 类型                                     | 可选值        | 默认值 |
| ------------ | ------------------------------------------------------- | ---------------------------------------- | ------------- | ------ |
| data         | 指定可选项                                              | string[] \| number[] \| DataItem[]       | -             | []     |
| defaultValue | 默认选中的项                                            | string \| number                         | -             | []     |
| disabled     | 是否禁用                                                | boolean                                  | true \| false | false  |
| name         | `Radio.Group` 下所有 `input[type="radio"]` 的 name 属性 | string                                   | -             | -      |
| value        | 指定选中的项                                            | string \| number                         | -             | -      |
| onChange     | 变化时的回调                                            | (checkedValue: string \| number) => void | -             | -      |

## Type

### _DataItem_

| 参数     | 说明         | 类型             |
| -------- | ------------ | ---------------- |
| id       | 数据唯一标识 | string \| number |
| content  | 数据显示内容 | string \| number |
| disabled | 是否禁用该项 | boolean          |
