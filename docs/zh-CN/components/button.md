## Button按钮

常用的操作按钮。

### 标准按钮

:::demo

- 突出按钮：用于重要的功能，需要强烈引导用户点击的功能操作；
- 普通按钮：用于较重要的功能，不需要太引导用户点击的功能操作；
- 默认按钮：用于不重要的功能，不需要太引导用户点击的功能操作。

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary">突出按钮</Button>
          <Button type="line">普通按钮</Button>
          <Button type="default">默认按钮</Button>
          <Button type="primary">确认</Button>
          <Button type="line">取消</Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="primary" disabled>突出按钮</Button>
          <Button type="line" disabled>普通按钮</Button>
          <Button type="default" disabled>默认按钮</Button>
          <Button type="primary" disabled>确认</Button>
          <Button type="line" disabled>取消</Button>

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

      <Button type="success">通过</Button>
      <Button type="success" disabled>通过</Button>
      <Button type="danger">驳回</Button>
      <Button type="danger" disabled>驳回</Button>

    </div>
  )
}
```
:::

### 按钮类型

:::demo

按钮可设置大小及内部图标。

- 尺寸：可设置为 `large`、`small`，默认为 `default`；
- 图标：可设置为内部 Icon。

```js
render() {
  return (
    <div>

      <Button type="primary" size="large">大按钮</Button>
      <Button type="primary" size="large" disabled>大按钮</Button>
      <Button type="primary" size="normal">默认</Button>
      <Button type="primary" size="normal" disabled>默认</Button>
      <Button type="primary" size="small">小号</Button>
      <Button type="primary" size="small" disabled>小号</Button>
      <Button type="primary" icon="plus" />
      <Button type="line" icon="download" >下载</Button>
    </div>
  )
}
```
:::

### 链接按钮

:::demo

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>

      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link">默认链接</Button>
          <Button type="primary" appearance="link">主要链接</Button>
          <Button type="success" appearance="link">成功链接</Button>
          <Button type="danger" appearance="link">危险链接</Button>
          <Button type="primary" appearance="link"><Icon name="edit" /></Button>

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>

          <Button type="default" appearance="link" disabled>默认链接</Button>
          <Button type="primary" appearance="link" disabled>主要链接</Button>
          <Button type="success" appearance="link" disabled>成功链接</Button>
          <Button type="danger" appearance="link" disabled>危险链接</Button>
          <Button type="primary" appearance="link" disabled><Icon name="edit" /></Button>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### 按钮组合

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
            <Button type="default">动作A</Button>
            <Button type="default">动作B</Button>
            <Button type="default" disabled>动作C</Button>
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
| type | 设置按钮类型 | String | primary \| line \| success \| danger \| default | default |
| appearance | 按钮显示类型（按钮或链接）  | String  | button \| link | button |
| size | 设置按钮大小 | String | large \| normal \| small | normal |
| icon | 设置按钮图标，设置后忽略子元素只渲染对应图标 | String | 详见 `<Icon />` 组件 | - |
| className | 自定义class | String | - | - |

### Button Events
| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| onClick | 点击回调函数   |   Function  | -   | - |
