## Tooltip

Common text prompt component

### Basis

:::demo 

Tooltip component

```js
render() {
  return (
    <div>
      <Tooltip title="tooltip top" style={{margin: '0 10px'}}><Button type="primary" appearance="line">Tooltip Top</Button></Tooltip>
      <Tooltip title="tooltip right" style={{margin: '0 10px'}} placement="right"><Button type="success" appearance="line">Tooltip Right</Button></Tooltip>
      <Tooltip title="tooltip bottom" style={{margin: '0 10px'}} placement="bottom"><Button type="info" appearance="line">Tooltip Bottom</Button></Tooltip>
      <Tooltip title="tooltip left" style={{margin: '0 10px'}} placement="left"><Button type="danger" appearance="line">Tooltip Left</Button></Tooltip>
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
