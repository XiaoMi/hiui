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
        current={this.state.current}
        total={150}
        pageSize={30} 
        defaultCurrent={1}
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
        current={this.state.current}
        total={250}
        pageSize={30}
        defaultCurrent={1}
        onChange={(page, prevPage, pageSize)=>{console.log(page, prevPage, pageSize)}}
      />

      <hr />

      <Button type="line" onClick={() => {this.setState({current: 5})}}>切到第5页</Button>

    </div>
  )
}
```
:::


### 完整分页

:::demo

Pagination 分页代码说明
pageLink用于

```js
constructor(props) {
  super(props)
  this.state = {
    current: 4,
    pageSize: 10
  }
}

render() {
  return (
    <div>
      <Pagination
        total={60000}
        pageSize={this.state.pageSize}
        current={this.state.current}
        showTotal={true}
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
    </div>
  )
}
```
:::

### Pagination Attributes

| 参数       | 说明   |  类型  | 可选值 | 默认值  |
| --------   | -----  | ----  |  ----  | ----  |
| defaultCurrent | 默认的当前页数  | number | - | 1 |
| pageSize | 每页条数  | number | - |  10 |
| total | 数据总数  | number   | - | - |
| pageLink | 如果设置该参数，则在url中会添加`#/page={page}` | boolean | - | - |
| onChange | 页码改变的回调，参数为当前页（page），前一页（prevPage），每页条数（pageSize）  | function | -  |  - | - |
| sizeChangeEvent |  每页条数改变的回调函数，返回 改变后的每页条数 及 当前页数  | function | - | - | - |
