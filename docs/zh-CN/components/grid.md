## Grid 栅格组件

24 栏栅格系统

### 基础用法

:::demo

水平排布无间隔

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


### 区块间隔

:::demo

水平排布有间隔

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


### 左右偏移

:::demo

水平排布有左右偏移

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


### 嵌套

:::demo

水平排布嵌套

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

水平排布嵌套

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


### Grid Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| gutter | 属于 &#60;Row> 的属性，Row 里面元素之间是否有外边距 | boolean | false | - |
| span | 属于 &#60;Col> 的属性， Col 元素占多少个栅格 | number | - | - |
| offset | 属于 &#60;Col> 的属性， Col 元素偏移多少个栅格 | number | - | - |
| justify | 属于 &#60;Row> 和 &#60;Col> 的属性，里面的元素排布方式 | string | flex-start, flex-end, center, space-around, space-between | - |
