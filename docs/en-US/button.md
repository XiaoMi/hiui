## Button

Commonly used button

### Normal Button

:::demo 

Button component provides 7 themes by default. Defined by the `type` attribute，default is `default`。

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default">default</Button>
          <Button type="primary">primary</Button>
          <Button type="success">success</Button>
          <Button type="info">info</Button>
          <Button type="warning">warning</Button>
          <Button type="danger">danger</Button>
          <Button type="primary"><Icon name="edit" /></Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" disabled>default</Button>
          <Button type="primary" disabled>primary</Button>
          <Button type="success" disabled>success</Button>
          <Button type="info" disabled>info</Button>
          <Button type="warning" disabled>warning</Button>
          <Button type="danger" disabled>danger</Button>
          <Button type="primary" disabled><Icon name="edit" /></Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Line

:::demo

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="line">default</Button>
          <Button type="primary" appearance="line">primary</Button>
          <Button type="success" appearance="line">success</Button>
          <Button type="info" appearance="line">info</Button>
          <Button type="warning" appearance="line">warning</Button>
          <Button type="danger" appearance="line">danger</Button>
          <Button type="primary" appearance="line"><Icon name="edit" /></Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="line" disabled>default</Button>
          <Button type="primary" appearance="line" disabled>primary</Button>
          <Button type="success" appearance="line" disabled>success</Button>
          <Button type="info" appearance="line" disabled>info</Button>
          <Button type="warning" appearance="line" disabled>warning</Button>
          <Button type="danger" appearance="line" disabled>danger</Button>
          <Button type="primary" appearance="line" disabled><Icon name="edit" /></Button>

        </Col>
      </Row>
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

          <Button type="default" appearance="link">default</Button>
          <Button type="primary" appearance="link">primary</Button>
          <Button type="success" appearance="link">success</Button>
          <Button type="info" appearance="link">info</Button>
          <Button type="warning" appearance="link">warning</Button>
          <Button type="danger" appearance="link">danger</Button>
          <Button type="primary" appearance="link"><Icon name="edit" /></Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link" disabled>default</Button>
          <Button type="primary" appearance="link" disabled>primary</Button>
          <Button type="success" appearance="link" disabled>success</Button>
          <Button type="info" appearance="link" disabled>info</Button>
          <Button type="warning" appearance="link" disabled>warning</Button>
          <Button type="danger" appearance="link" disabled>danger</Button>
          <Button type="primary" appearance="link" disabled><Icon name="edit" /></Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Button Status

:::demo 

All forms of Button components are available in three sizes, disabled, icons, etc.

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary" size="large">Large Button</Button>
          <Button type="primary" appearance="line" size="small">Small Button</Button>
          <Button type="primary" appearance="line"><Icon name="edit" />Edit</Button>
          <Button type="danger" appearance="line" disabled>Disabled</Button>
          <Button type="default" className="someCustomClass" onClick={()=>alert("onClick!")} title="description">Click Event</Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Button Group

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
            <Button type="default" appearance="line">Action A</Button>
            <Button type="default" appearance="line">Action B</Button>
            <Button type="default" appearance="line" disabled>Action C</Button>
          </Button.Group>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Attributes

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ----  | ----  |   ----  |
| type | button type | string | primary，success，info，warning，danger |  |
| appearance | display type  | string  | line, link | default |
| size | button size | string | large, small | - |
| className | customer class | string | - | - |


### Events
| Event Name       | Description   |  Parameters
| --------   | -----  | ----  
| onClick | triggers when the Button clicked   |   -
