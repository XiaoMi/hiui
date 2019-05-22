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

| 参数                        | 说明                                                                           | 类型     | 可选值                     | 默认值 |
| --------------------------- | ------------------------------------------------------------------------------ | -------- | -------------------------- | ------ |
| mode (1.4 新增)             | 分页模式                                                                       | String   | normal \| simple \| shrink | normal |
| defaultCurrent              | 默认的当前页数                                                                 | Number   | -                          | 1      |
| pageBufferSize (1.4 新增)   | 超过时隐藏页数                                                                 | Number   | -                          | 2      |
| pageSize                    | 每页条数                                                                       | Number   | -                          | 10     |
| pageSizeOptions (1.4 新增)  | 指定每页可以显示多少条                                                         | Array    | -                          | []     |
| total                       | 数据总数                                                                       | Number   | -                          | -      |
| hideOnSinglePage (1.4 新增) | 只有一页时是否隐藏分页器                                                       | Boolean  | true \| false              | false  |
| showQuickJumper (1.4 新增)  | 是否显示跳转                                                                   | Boolean  | true \| false              | false  |
| pageLink (1.4 废弃)         | 如果设置该参数，则在 url 中会添加`/page={page}`                                | boolean  | -                          | -      |
| onChange                    | 页码改变的回调，参数为当前页（page），前一页（prevPage），每页条数（pageSize） | Function | -                          | -      | - |
| sizeChangeEvent             | 每页条数改变的回调函数，返回 改变后的每页条数 及 当前页数                      | Function | -                          | -      | - |
