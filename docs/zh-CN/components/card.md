<style scoped>
  p {
    margin: 0 !important;
  }
</style>

## Card 卡片

### 基础

:::demo

Card 组件

```js
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      <Card title="标题">
        <span>普通 Card</span>
      </Card>
      <br />
      <Card hoverable>
        <p>无标题</p>
        <p>鼠标移入悬浮效果</p>
        <p>其它额外内容</p>
      </Card>
      <br />
      <Card hoverable size='large' disabled title='标题'>
        <p>禁用状态</p>
      </Card>
      <br />
      <Card hoverable size='large' disabled>
        无标题,禁用状态
      </Card>
    </div>
  )
}
```

:::

### 不同大小

:::demo

Card 组件

```js
render() {
  return (
    <React.Fragment>
      <Card hoverable style={{width: 200}} title='标题内容-标题内容-标题内容'>
        <p>自定义宽度：200px</p>
        <p>其它额外内容</p>
      </Card>
      <br />
      <Card hoverable size='small'>
        <p>size = small</p>
        <p>无标题</p>
        <p>其它额外内容</p>
      </Card>
      <br />
      <Card hoverable size='middle'>
        <p>size = middle</p>
        <p>无标题</p>
        <p>其它额外内容</p>
      </Card>
      <br />
      <Card hoverable size='large'>
        <p>size = large</p>
        <p>无标题</p>
        <p>其它额外内容</p>
      </Card>
    </React.Fragment>
  )
}
```

:::

### 额外按钮

:::demo

Card 组件

```js
render() {
  return (
    <React.Fragment>
      <Card
        hoverable
        extra={[<Icon name='edit' key={1}/>, <Icon name='delete' key={2}/>]}
        extraShow='stay'
        title='这里是标题这里是标题这里是标题'
      >
        <p>包含额外扩展按钮</p>
        <p>扩展按钮常驻</p>
      </Card>
      <br />
      <Card
        hoverable
        extra={[<Icon name='edit' key={1} />, <Icon name='delete' key={2}/>]}
        extraShow='hover'
      >
        <p>有扩展按钮，无标题</p>
        <p>扩展按钮移入后显示</p>
        <p>其它剩余内容；其它剩余内容；其它剩余内容；其它剩余内容；其它剩余内容；</p>
      </Card>
    </React.Fragment>
  )
}
```

:::

### 图片卡片

:::demo

Card 组件

```js
render() {
  return (
    <React.Fragment>
      <Card
        hoverable
        cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
        title='图片展示'
        description='图片信息描述：size=small;width:276px'
        size='small'
      ></Card>
      <br />
      <Card
        hoverable
        cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
        title='图片展示'
        description='图片信息描述：size=middle;width:376px'
        size='middle'
      ></Card>

      <br />
      <Card
        hoverable
        cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
        title='图片展示'
        description='图片信息描述：size=large;width:576px'
        size='large'
      ></Card>
    </React.Fragment>
  )
}
```

:::

### 简易卡片

:::demo

Card 组件

```js
render() {
  return (
    <React.Fragment>
      <Card
          hoverable
          type='simple'
          size='small'
        >
          简易卡片
        </Card>
        <br/>
       <Card
          hoverable
          type='simple'
          size='middle'
        >
          简易卡片
        </Card>
        <br/>
        <Card
          hoverable
          type='simple'
          size='large'
          disabled
        >
          简易卡片
        </Card>
        <br/>
        <Card
          hoverable
          type='simple'
        >
          简易卡片
        </Card>
    </React.Fragment>
  )
}
```

:::

### 配合 Gird 布局 - 图片排版

:::demo

配合 Grid 布局实现更加简单

```js
render() {
  const {Row, Col} = Grid
  return (
    <React.Fragment>
       <Row gutter={true}>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
            title='图片展示'
            description='这是图片描述'
          ></Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}
```

:::

### 配合 Gird 布局 - 展示

:::demo

配合 Grid 布局实现更加简单

```js
render() {
  const {Row, Col} = Grid
  return (
    <React.Fragment>
      <Row gutter={true}>
        <Col span={4}>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}
```

:::

### 配合 Gird 布局 - 自定义展示

:::demo

配合 Grid 布局实现更加简单

```js
render() {
  const {Row, Col} = Grid
  const colors = ['#46bc99', '#37d5fa', '#b450de', '#fadb14']
  const cols = colors.map((color, index) => {
    return (
      <Col span={6} key={index}>
        <Card hoverable style={{borderLeft: `2px solid ${color}`,}}>
          <p>无标题</p>
          <p>鼠标移入悬浮效果</p>
          <p>其它额外内容</p>
        </Card>
      </Col>
    )
  })
  return (
    <React.Fragment>
      <Row gutter={true}>
        {cols}
      </Row>
    </React.Fragment>
  )
}
```

:::

### Props

| 参数      | 说明                         | 类型                | 可选值                   | 默认值  |
| --------- | ---------------------------- | ------------------- | ------------------------ | ------- |
| title     | 卡片标题                     | string \| ReactNode | -                        | -       |
| size      | 卡片大小                     | string              | small \| middle \| large | 100%    |
| type      | 卡片类型                     | string              | simple \| default        | default |
| hoverable | 鼠标移入卡片是否显示浮起效果 | Boolean             | true \| false            | false   |
| extra     | 卡片右上角的扩展             | ReactNode           | -                        | -       |
| url       | 图片卡片的封面               | string              | -                        | -       |
| content   | 图片卡片的信息描述           | string \| ReactNode | -                        | -       |
