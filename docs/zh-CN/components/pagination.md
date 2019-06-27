## Pagination 分页

Pagination 分页

### 基础分页

:::demo

分页组件会根据项目数量自己处理翻页数量。

```js
constructor () {
  super()

  this.state = {
    current: 1
  }
}
render() {
  return (
    <div>
      <Pagination
        defaultCurrent={this.state.current}
        total={150}
        pageSize={30}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />
    </div>
  )
}
```

:::

### 简单分页

:::demo

```js
constructor () {
  super()

  this.state = {
    current: 1
  }
}
render() {
  return (
    <div>

      <Pagination
        mode='simple'
        defaultCurrent={this.state.current}
        total={150}
        pageSize={30}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />

    </div>
  )
}
```

:::

### 收缩型分页

:::demo

```js
constructor () {
  super()

  this.state = {
    current: 2
  }
}
render() {
  return (
    <div>

      <Pagination
        mode='shrink'
        defaultCurrent={this.state.current}
        showQuickJumper={true}
        total={250}
        pageSize={30}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />
    </div>
  )
}
```

:::

### 完整分页

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    current: 4,
    pageSize: 10,
    optionsList: [{
      text: '显示跳转至...',
      value: 'showQuickJumper',
      checked: true
    }, {
      text: '显示总数量',
      value: 'showTotal',
      checked: true
    }],
    showTotal: true,
    showQuickJumper: true
  }
}

render() {
  const pageSizeOptions = [{
    value: 10,
    title: '10'
  }, {
    value: 20,
    title: '20'
  }, {
    value: 50,
    title: '50'
  }, {
    value: 100,
    title: '100'
  }]
  const Row = Grid.Row
  const Col = Grid.Col
  const {showQuickJumper, showTotal, optionsList, pageSize, current} = this.state
  return (
    <div>
      <Row gutter={true}>
        <Col span={12}>
          <Checkbox
            list={optionsList}
            onChange={(val, isChecked) => {
              this.setState({
                [val]: !this.state[val]
              })
            }}
          />
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={24}>
          <Pagination
            total={60000}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            defaultCurrent={current}
            showTotal={showTotal}
            showQuickJumper={showQuickJumper}
            jumpEvent={(val) => {this.setState({current: val})}}
            sizeChangeEvent={(val, current) => {
                console.log('每页', val, '条', '当前第', current, '页')
                this.setState({pageSize: val})
              }
            }
            onChange={(page, prevPage, pageSize) => {
              console.log(page, prevPage, pageSize)
              this.setState({
                current: page,
              })
            }}
          />
         </Col>
      </Row>
    </div>
  )
}
```

:::

### Pagination Attributes

| 参数             | 说明                                                       | 类型                                                   | 可选值                      | 默认值  |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------ | --------------------------- | ------- |
| type             | 分页的类型                                                 | string                                                 | default \| simple \| shrink | default |
| defaultCurrent   | 默认的当前页数                                             | number                                                 | -                           | 1       |
| current          | 当前页数                                                   | number                                                 | -                           | -       |
| max              | 最大显示的页数，超过后新仓                                 | number                                                 | -                           | 2       |
| pageSize         | 每页条数                                                   | number                                                 | -                           | 10      |
| pageSizeOptions  | 指定每页可以显示多少条                                     | number []                                              | -                           | []      |
| total            | 数据总数                                                   | number                                                 | -                           | -       |
| autoHide         | 只有一页时是否隐藏分页器                                   | boolean                                                | true \| false               | false   |
| showJumper       | 是否显示跳转                                               | boolean                                                | true \| false               | false   |
| onChange         | 页码改变的回调）                                           | (current:number, prev:number, pageSize:number) => void | -                           | -       | - |
| onPageSizeChange | 每页显示条数改变的回调函数，返回改变后的每页条数及当前页数 | (current:number ,pageSize:number) => void              | -                           | -       | - |
