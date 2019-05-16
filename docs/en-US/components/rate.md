## Rate

The rate component.

### Basic

:::demo

```js
render() {
  return (
    <Form labelWidth="120" labelPosition="left">
      <FormItem label="Basic">
        <Rate defaultValue={3} />
      </FormItem>
      <FormItem label="Half star">
        <Rate allowHalf defaultValue={2.5} />
      </FormItem>
    </Form>
  )
}
```

:::

### Advanced

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
    <Form labelWidth="120" labelPosition="left">
      <FormItem label="Custom amount">
        <Rate count={10} allowHalf defaultValue={9.5} />
      </FormItem>
      <FormItem label="Tool tip">
        <Rate tooltips={this.tooltips} onChange={value => {
          this.setState({value})
        }} value={value} />
      </FormItem>
      <FormItem label="Disabled">
        <Rate allowHalf disabled defaultValue={2.5} />
      </FormItem>
      <FormItem label="Forbid clear">
        <Rate allowHalf allowClear={false} defaultValue={2.5} />
      </FormItem>
    </Form>
  )
}
```

:::

### Use emoji

:::demo

```js
constructor() {
  super()
  this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
}

render() {
  return (
    <Form labelWidth="120" labelPosition="left">
      <Alert type="warning" message="Can not use half start and star count when use emoji" closeable={false} />
      <br />
      <FormItem label="Basic">
        <Rate defaultValue={3} useEmoji />
      </FormItem>
      <FormItem label="Tool tip">
        <Rate defaultValue={3} useEmoji tooltips={this.tooltips} />
      </FormItem>
      <FormItem label="Disabled">
        <Rate defaultValue={3} useEmoji disabled />
      </FormItem>
      <FormItem label="Forbid clear">
        <Rate defaultValue={3} useEmoji allowClear={false} />
      </FormItem>
    </Form>
  )
}
```

:::

### Rate Attributes

| Property     | Description                             | Type                    | Options | Default |
| ------------ | --------------------------------------- | ----------------------- | ------- | ------- |
| allowClear   | whether to allow clear when click again | boolean                 | -       | true    |
| allowHalf    | whether to allow semi selection         | boolean                 | -       | true    |
| useEmoji     | whether to use emoji                    | boolean                 | -       | false   |
| className    | custom class name of rate               | string                  | -       | -       |
| count        | star count, not work whem use emoji     | number                  | -       | 5       |
| defaultValue | default value                           | number                  | -       | 0       |
| disabled     | read only, unable to interact           | boolean                 | -       | false   |
| style        | custom style object of rate             | object                  | -       | -       |
| tooltips     | custom tooltip by each character        | string[]                | -       | -       |
| value        | current value                           | number                  | -       | -       |
| onChange     | callback when select value              | (value: number) => void | -       | -       |
