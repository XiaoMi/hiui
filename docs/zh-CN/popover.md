## Popover气泡卡片

Popover气泡卡片

### 基础

:::demo 

Popover 组件

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
        <Button type="primary" appearance="line">Top & click触发</Button>
      </Popover>
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="right" trigger="hover">
        <Button type="success" appearance="line">Right & hover触发</Button>
      </Popover>
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="bottom" trigger="focus">
        <Button type="info" appearance="line">Bottom & focus触发</Button>
      </Popover>
      <Popover title={title} content={content} style={{margin: '10px 10px'}} placement="left" trigger="click">
        <Button type="danger" appearance="line">Popover Left</Button>
      </Popover>
    </div>
  )
}
```
:::

### API

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------- | ------- | ------- | ------- |
| title | 提示文字内容 | string | 字符串 | -- |
| content | popover内容 | string, Node, React.Component | -- | -- |
| placement | popover显示的位置 | string | top,right,bottom,left | top |
| trigger | popover触发方式 | string | click, focus, hover | click |
