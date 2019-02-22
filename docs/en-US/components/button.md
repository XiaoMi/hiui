## Button

Commonly used button

### Standard Button

:::demo 

Button component provides 7 themes by default. Defined by the `type` attribute, default is `default`。

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary">Primary</Button>
          <Button type="line">Line</Button>
          <Button type="default">Default</Button>
          <Button type="primary">Confirm</Button>
          <Button type="line">Cancel</Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary" disabled>Primary</Button>
          <Button type="line" disabled>Line</Button>
          <Button type="default" disabled>Default</Button>
          <Button type="primary" disabled>Confirm</Button>
          <Button type="line" disabled>Cancel</Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Status Button

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <div>

            <Button type="success">Approve</Button>
            <Button type="success" disabled>Approve</Button>
            <Button type="danger">Decline</Button>
            <Button type="danger" disabled>Decline</Button>

          </div>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Button Size

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary" size="large">Large</Button>
          <Button type="primary" size="large" disabled>Large</Button>
          <Button type="primary" size="normal">Normal</Button>
          <Button type="primary" size="normal" disabled>Normal</Button>
          <Button type="primary" size="small">Small</Button>
          <Button type="primary" size="small" disabled>Small</Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### Link Button

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>

      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link">Link</Button>
          <Button type="primary" appearance="link">Primary</Button>
          <Button type="success" appearance="link">Success</Button>
          <Button type="danger" appearance="link">Danger</Button>
          <Button type="primary" appearance="link"><Icon name="edit" /></Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link" disabled>Link</Button>
          <Button type="primary" appearance="link" disabled>Primary</Button>
          <Button type="success" appearance="link" disabled>Success</Button>
          <Button type="danger" appearance="link" disabled>Danger</Button>
          <Button type="primary" appearance="link" disabled><Icon name="edit" /></Button>

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
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button.Group>
            <Button type="default">Action A</Button>
            <Button type="default">Action B</Button>
            <Button type="default" disabled>Action C</Button>
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
| type | button type | string | primary，line, success，danger, default | default |
| appearance | display type | string  | button, link | button |
| size | button size | string | large, normal, small | normal |
| className | custom class | string | - | - |


### Events
| Event Name       | Description   |  Parameters
| --------   | -----  | ----  
| onClick | triggers when the Button clicked   |   -
