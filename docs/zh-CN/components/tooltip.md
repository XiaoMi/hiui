## Tooltip 文字提示

常用的文字提示组件

### 基础

:::demo

Tooltip 组件

```js
render() {
  return (
    <div>
      <Tooltip title="tooltip top" style={{margin: '0 10px'}}>
        <Button type="line">Tooltip Top</Button>
      </Tooltip>
      <Tooltip title="tooltip right" style={{margin: '0 10px'}} placement="right">
        <Button type="success">Tooltip Right</Button>
      </Tooltip>
      <Tooltip title="tooltip bottom" style={{margin: '0 10px'}} placement="bottom">
        <Button type="warning">Tooltip Bottom</Button>
      </Tooltip>
      <Tooltip title="tooltip left" style={{margin: '0 10px'}} placement="left">
        <Button type="danger">Tooltip Left</Button>
      </Tooltip>
    </div>
  )
}
```

:::

### API

#### `Tooltip.open({ target, title, placement })`

:::demo

```js
constructor() {
  super()
  Object.assign(this, {
    state: {
      showTooltip: false,
    },
    closure: undefined,
    toggleTooltip: () => {
      !this.state.showTooltip ?
        this.closure = Tooltip.open({ target: this.node, title: 'Click again to hide me.',  placement: 'right' }) :
        this.closure.close()
      this.setState(({ showTooltip }) => ({
        showTooltip: !showTooltip
      }))
    }
  })
}

render() {
  return (
    <div>
      <Button type="line" onClick={this.toggleTooltip}>{this.state.showTooltip ? 'Hide' : 'Show'} tooltip</Button>
      <p />
      <span ref={node => this.node = node}>
        <Button disabled>Show tooltip on me</Button>
      </span>
    </div>
  )
}
```

:::

### Tooltip Attributes

| 参数      | 说明               | 类型   | 可选值                         | 默认值 |
| --------- | ------------------ | ------ | ------------------------------ | ------ |
| title     | 提示文字内容       | String | 字符串                         | --     |
| placement | tooltip 显示的位置 | String | top \| right \| bottom \| left | top    |

### Tooltip API

#### `Tooltip.open({ target, title, placement })`

| 参数      | 说明                  | 类型        | 可选值                         | 默认值 |
| --------- | --------------------- | ----------- | ------------------------------ | ------ |
| target    | 要显示 tooptip 的元素 | HTMLElement | -                              | -      |
| title     | 提示文字内容          | String      | -                              | -      |
| placement | tooltip 显示的位置    | String      | top \| right \| bottom \| left | top    |
