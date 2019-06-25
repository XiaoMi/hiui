## 评分

评分组件。

### 基础

:::demo

```js
render() {
  return (
    <Form labelWidth="80px" labelPosition="left">
      <FormItem label="基础">
        <Rate defaultValue={3} />
      </FormItem>
      <FormItem label="半星">
        <Rate allowHalf defaultValue={2.5} />
      </FormItem>
    </Form>
  )
}
```

:::

### 高级

:::demo

```js
constructor() {
  super()
  this.state = {
    value: 3
  }
  this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
}

render() {
  const { value } = this.state
  return (
    <Form labelWidth="80px" labelPosition="left">
      <FormItem label="任意数量">
        <Rate count={10} allowHalf defaultValue={9.5} />
      </FormItem>
      <FormItem label="提示">
        <Rate tooltips={this.tooltips} onChange={value => {
          this.setState({value})
        }} value={value} />
      </FormItem>
      <FormItem label="禁用">
        <Rate allowHalf disabled defaultValue={2.5} />
      </FormItem>
      <FormItem label="禁止清除">
        <Rate allowHalf allowClear={false} defaultValue={2.5} />
      </FormItem>
    </Form>
  )
}
```

:::

### 使用表情

:::demo

```js
constructor() {
  super()
  this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
}

render() {
  return (
    <Form labelWidth="80" labelPosition="left">
      <Alert type="warning" message="使用表情后将不可自定义数量，不可定义半星" closeable={false} />
      <br />
      <FormItem label="基础">
        <Rate defaultValue={3} useEmoji />
      </FormItem>
      <FormItem label="提示">
        <Rate defaultValue={3} useEmoji tooltips={this.tooltips} />
      </FormItem>
      <FormItem label="禁用">
        <Rate defaultValue={3} useEmoji disabled />
      </FormItem>
      <FormItem label="禁止清除">
        <Rate defaultValue={3} useEmoji allowClear={false} />
      </FormItem>
    </Form>
  )
}
```

:::

### Rate Attributes

| 参数         | 说明                      | 类型                    | 可选值 | 默认值 |
| ------------ | ------------------------- | ----------------------- | ------ | ------ |
| clearable    | 是否允许再次点击后清除    | boolean                 | -      | true   |
| allowHalf    | 是否允许半选              | boolean                 | -      | true   |
| useEmoji     | 是否使用表情              | boolean                 | -      | false  |
| className    | 自定义类名                | string                  | -      | -      |
| count        | star 数量，Emoji 时不可用 | number                  | -      | 5      |
| defaultValue | 默认值                    | number                  | -      | 0      |
| disabled     | 只读，无法进行交互        | boolean                 | -      | false  |
| style        | 自定义样式对象            | object                  | -      | -      |
| tooltips     | 自定义每项的提示信息      | string[]                | -      | -      |
| value        | 当前数，受控值            | number                  | -      | -      |
| onChange     | 选择时的回调              | (value: number) => void | -      | -      |
