## 配色主题

支持的配色主题详见下表，默认为 **hiui-blue**

### 使用方法

通过 `ThemeContext` 使内部的组件可以通过 `props.theme` 获取到设置的主题，所以在页面根组件嵌套即可。

```js
import { ThemeContext } from '@hi-ui/hiui/es/context'

<ThemeContext.Provider value='hiui-blue'>
  <App />
</ThemeContext.Provider>
```

### 示例

:::demo

```js
render() {
  const Row = Layout.Row
  const Col = Layout.Col

  const stepperList = [
    {
      title: '账号信息',
    },
    {
      title: '邮箱激活',
    },
    {
      title: '信息登记',
    },
  ]

  return (
    <div>
      <Row gutter={true}>
        <Col span={12}>
          <Button type="primary">突出按钮</Button>
          <Button type="line">普通按钮</Button>
          <Button type="default">默认按钮</Button>
          <Button type="primary">确认</Button>
          <Button type="line">取消</Button>
        </Col>
        <Col span={12}>
          <DatePicker
            type='daterange'
            value={new Date()}
            onChange={(d) => {console.log('last', d)}}
          />
        </Col>
      </Row>

      <ThemeContext.Provider value='orange'>
        <Row gutter={true}>
          <Col span={12}>
            <Button type="primary">突出按钮</Button>
            <Button type="line">普通按钮</Button>
            <Button type="default">默认按钮</Button>
            <Button type="primary">确认</Button>
            <Button type="line">取消</Button>
          </Col>
          <Col span={12}>
            <DatePicker
              type='daterange'
              value={new Date()}
              onChange={(d) => {console.log('last', d)}}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <ThemeContext.Provider value='cyan'>
        <Row gutter={true}>
          <Col span={12}>
            <Button type="primary">突出按钮</Button>
            <Button type="line">普通按钮</Button>
            <Button type="default">默认按钮</Button>
            <Button type="primary">确认</Button>
            <Button type="line">取消</Button>
          </Col>
          <Col span={12}>
            <DatePicker
              type='daterange'
              value={new Date()}
              onChange={(d) => {console.log('last', d)}}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <ThemeContext.Provider value='blue'>
        <Row gutter={true}>
          <Col span={12}>
            <Button type="primary">突出按钮</Button>
            <Button type="line">普通按钮</Button>
            <Button type="default">默认按钮</Button>
            <Button type="primary">确认</Button>
            <Button type="line">取消</Button>
          </Col>
          <Col span={12}>
            <DatePicker
              type='daterange'
              value={new Date()}
              onChange={(d) => {console.log('last', d)}}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <ThemeContext.Provider value='purple'>
        <Row gutter={true}>
          <Col span={12}>
            <Button type="primary">突出按钮</Button>
            <Button type="line">普通按钮</Button>
            <Button type="default">默认按钮</Button>
            <Button type="primary">确认</Button>
            <Button type="line">取消</Button>
          </Col>
          <Col span={12}>
            <DatePicker
              type='daterange'
              value={new Date()}
              onChange={(d) => {console.log('last', d)}}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <Row gutter={true}>
        <Col span={24}>
          <Stepper
            list={stepperList}
            current={1}
          />
        </Col>
      </Row>

      <ThemeContext.Provider value='orange'>
        <Row gutter={true}>
          <Col span={24}>
            <Stepper
              list={stepperList}
              current={1}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <ThemeContext.Provider value='cyan'>
        <Row gutter={true}>
          <Col span={24}>
            <Stepper
              list={stepperList}
              current={1}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <ThemeContext.Provider value='blue'>
        <Row gutter={true}>
          <Col span={24}>
            <Stepper
              list={stepperList}
              current={1}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

      <ThemeContext.Provider value='purple'>
        <Row gutter={true}>
          <Col span={24}>
            <Stepper
              list={stepperList}
              current={1}
            />
          </Col>
        </Row>
      </ThemeContext.Provider>

    </div>
  )
}
```
:::

### 支持的主题
:::demo

```run
render() {
  return (
    <Table columns={[
      { title: '主题', dataIndex: 'language'},
      { title: 'value', dataIndex: 'theme'}
    ]} data={[
      {language: '品牌蓝', theme: 'hiui-blue'},
      {language: '橙', theme: 'orange'},
      {language: '青', theme: 'cyan'},
      {language: '蓝', theme: 'blue'},
      {language: '紫', theme: 'purple'},
    ]} />
  )
}
```
:::
