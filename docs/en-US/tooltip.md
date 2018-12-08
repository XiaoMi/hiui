## Tooltip

Common text prompt component

### Basis

:::demo 

Tooltip component

```js
render() {
  return (
    <div>
      <Tooltip title="tooltip top" style={{margin: '0 10px'}}><Button type="line">Tooltip Top</Button></Tooltip>
      <Tooltip title="tooltip right" style={{margin: '0 10px'}} placement="right"><Button type="success">Tooltip Right</Button></Tooltip>
      <Tooltip title="tooltip bottom" style={{margin: '0 10px'}} placement="bottom"><Button type="warning">Tooltip Bottom</Button></Tooltip>
      <Tooltip title="tooltip left" style={{margin: '0 10px'}} placement="left"><Button type="danger">Tooltip Left</Button></Tooltip>
    </div>
  )
}
```
:::

### API

| Attribute | Description | Type | Options | Default |
| ------- | ------- | ------- | ------- | ------- |
| title | prompt text content | string | - | - |
| placement | tooltip display position | string | top/right/bottom/left | top |
