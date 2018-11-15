## Popover


### Basic

:::demo 


```js
render() {
  const title = <span>Popover Title</span>
  const content = (
    <div>
      <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
    </div>
  )

  return (
    <div>
      <Popover title={title} content={content} style={{margin: '10px 10px'}}>
        <Button type="primary" appearance="line">Top & click</Button>
      </Popover>
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="right" trigger="hover">
        <Button type="success" appearance="line">Right & hover</Button>
      </Popover>
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="bottom" trigger="focus">
        <Button type="info" appearance="line">Bottom & focus</Button>
      </Popover>
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="left" trigger="click">
        <Button type="danger" appearance="line">Popover Left</Button>
      </Popover>
    </div>
  )
}
```
:::

### Popover Attributes

| Attribute | Description | Type | Options | Default |
| ------- | ------- | ------- | ------- | ------- |
| title | Title content | String | -- | -- |
| content | Popover content | string, Node, React.Component | -- | -- |
| placement | Popover position | string | top,right,bottom,left | top |
| trigger | Popover trigger mode| string | click, focus, hover | click |
