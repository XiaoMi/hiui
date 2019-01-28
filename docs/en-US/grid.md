## Grid

### Basic

:::demo

Horizontal -No gap

```js
render(){
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '.8',}}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '.8',}}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
          </Col>
        </Row>
      </div>
    )
  }
```
:::


### Block gap

:::demo

Horizontal

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col

  return (
    <Row gutter={true}>
      <Col span={6}>
        <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
      </Col>
      <Col span={6}>
        <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
      </Col>
      <Col span={6}>
        <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
      </Col>
      <Col span={6}>
        <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
      </Col>
    </Row>
  )
}
```
:::


### Offset

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col

  return (
    <div>
      <Row gutter={true}>
        <Col span={8}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-8</div>
        </Col>
        <Col span={6} offset={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={4}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-4</div>
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={4}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-4</div>
        </Col>
        <Col span={6} offset={4}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={4}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-4</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
      </Row>
    </div>
  )
}
```
:::


### Nest

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col

  return (
    <Row gutter={true}>
      <Col span={16} style={{outline: '1px dotted #999'}}>
        <Row gutter={true}>
          <Col span={24}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-16</div>
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={12}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '0.8'}}>col-12</div>
          </Col>
          <Col span={12}>
            <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center', opacity: '0.8'}}>col-12</div>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-8</div>
      </Col>
    </Row>
  )
}
```
:::


### Justify

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col

  return (
    <div>
      <Row justify='center' gutter={true}>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
      </Row>

      <Row justify='space-between'>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
        <Col span={6}>
          <div style={{backgroundColor: '#4284F5', width: '100%', padding: '10px 0', textAlign: 'center'}}>col-6</div>
        </Col>
      </Row>
      </div>
  )
}
```
:::


### Attributes

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| gutter | An attribute belonging to &#60;Row>, whether there is a margin between the elements in Row | boolean | false | - |
| span | Attributes belonging to &#60;Col>, how many grids does the Col element occupy | number | - | - |
| offset | Attributes belonging to &#60;Col>, how many grids are offset by the Col element | number | - | - |
| justify | Attributes belonging to &#60;Row> and &#60;Col>, the way the elements are arranged | string | flex-start, flex-end, center, space-around, space-between | - |
