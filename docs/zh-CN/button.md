## Button按钮

常用的操作按钮。

### 标准按钮

:::demo

- 突出按钮：用于重要的功能，需要强烈引导用户点击的功能操作；
- 普通按钮：用于较重要的功能，不需要太引导用户点击的功能操作；
- 幽灵按钮：用于不重要的功能，不需要太引导用户点击的功能操作。

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary">突出按钮</Button>
          <Button type="primary" appearance="line">普通按钮</Button>
          <Button type="default" appearance="line">幽灵按钮</Button>
          <Button type="primary">确认</Button>
          <Button type="primary" appearance="line">取消</Button>
          <Button type="default" appearance="line" className="custom-class" onClick={()=>alert("Clicked!")} title="On Click Event">点击事件</Button>


        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary" disabled>突出按钮</Button>
          <Button type="primary" appearance="line" disabled>普通按钮</Button>
          <Button type="default" appearance="line" disabled>幽灵按钮</Button>
          <Button type="primary" disabled>确认</Button>
          <Button type="primary" appearance="line" disabled>取消</Button>
          <Button type="default" appearance="line" disabled onClick={()=>alert("Click!")} title="On Click Event">点击事件</Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### 辅助按钮

:::demo

- 辅助按钮用于对产品的开启、停止等操作，不同颜色对用户的警示作用不同；
- 红色：停止等警示性操作；
- 绿色：开启等操作。

```js
render() {
  return (
    <div>

      <Button type="success" appearance="line">通过</Button>
      <Button type="success" appearance="line" disabled>通过</Button>
      <Button type="danger" appearance="line">驳回</Button>
      <Button type="danger" appearance="line" disabled>驳回</Button>

    </div>
  )
}
```
:::

### 按钮类型

:::demo

按钮可设置大小。

- 尺寸：可设置为 `large`、`small`，默认为 `default`。

```js
render() {
  return (
    <div>

      <Button type="primary" size="large">大按钮</Button>
      <Button type="primary" size="large" disabled>大按钮</Button>
      <Button type="primary" size="default">默认</Button>
      <Button type="primary" size="default" disabled>默认</Button>
      <Button type="primary" size="small">小号</Button>
      <Button type="primary" size="small" disabled>小号</Button>

    </div>
  )
}
```
:::

### 按钮组合

:::demo

按钮可与图标进行组合，并可设置大小。

- 尺寸：可设置为 `large`、`small`，默认为 `default`。

```js
render() {
  return (
    <div>

      <Button type="primary" appearance="line"><Icon name="edit" /></Button>
      <Button type="primary" appearance="line" disabled><Icon name="edit" /></Button>
      <Button type="success" appearance="line"><Icon name="check" /> 通过</Button>
      <Button type="success" appearance="line" disabled><Icon name="check" /> 通过</Button>
      <Button type="danger" appearance="line"><Icon name="delete" /> 删除</Button>
      <Button type="danger" appearance="line" disabled><Icon name="delete" /> 删除</Button>

    </div>
  )
}
```
:::

### 链接按钮

:::demo

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col
  return (
    <div>
      
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link">默认按钮</Button>
          <Button type="primary" appearance="link">主要按钮</Button>
          <Button type="success" appearance="link">成功按钮</Button>
          <Button type="danger" appearance="link">危险按钮</Button>
          <Button type="primary" appearance="link"><Icon name="edit" /></Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link" disabled>默认按钮</Button>
          <Button type="primary" appearance="link" disabled>主要按钮</Button>
          <Button type="success" appearance="link" disabled>成功按钮</Button>
          <Button type="danger" appearance="link" disabled>危险按钮</Button>
          <Button type="primary" appearance="link" disabled><Icon name="edit" /></Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### 按钮组

:::demo 

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button.Group>
            <Button type="default" appearance="line">动作A</Button>
            <Button type="default" appearance="line">动作B</Button>
            <Button type="default" appearance="line" disabled>动作C</Button>
          </Button.Group>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Button Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值  |
| -------- | ----- | ----  | ----  |   ----  |
| type | 设置按钮类型 | string | primary，success，info，warning，danger |  |
| appearance | 按钮显示类型  | string  | line, link | default |
| size | 设置按钮大小 | string | large, small | - |
| className | 自定义class | string | - | - |


### Button Events
| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| onClick | 点击回调函数   |   function  | -   | - |
