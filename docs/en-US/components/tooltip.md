## Tooltip

Common text prompt component

### Basic usage

:::demo

Tooltip component

```js
render() {
  return (
    <div>
      <Tooltip title="tooltip top" defaultVisible style={{margin: '0 10px'}}>
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

| Attribute | Description              | Type   | Options                        | Default |
| --------- | ------------------------ | ------ | ------------------------------ | ------- |
| title     | prompt text content      | String | -                              | -       |
| placement | tooltip display position | String | top \| right \| bottom \| left | top     |

### Tooltip API

#### `Tooltip.open({ target, title, placement })`

| Argument  | Description              | Type        | Options                        | Default |
| --------- | ------------------------ | ----------- | ------------------------------ | ------- |
| target    | attached node            | HTMLElement | -                              | -       |
| title     | display title            | String      | -                              | -       |
| placement | tooltip display position | String      | top \| right \| bottom \| left | top     |
