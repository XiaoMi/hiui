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

  return (
    <div>
      <Pagination
        total={60000}
        showTotal
        pageSize={this.state.pageSize}
        pageSizeOptions={pageSizeOptions}
        defaultCurrent={this.state.current}
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



### 上一页下一页

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
        mode='pn'
        defaultCurrent={this.state.current}
        total={250}
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

### Pagination Attributes

| 参数       | 说明   |  类型  | 可选值 | 默认值  |
| --------   | -----  | ----  |  ----  | ----  |
| mode | 分页模式  | string | normal, simple, pn | normal |
| defaultCurrent | 默认的当前页数  | number | - | 1 |
| pageBufferSize | 超过时隐藏页数  | number | - |  2 |
| pageSize | 每页条数  | number | - |  10 |
| pageSizeOptions | 指定每页可以显示多少条 | array | - |  [] |
| total | 数据总数  | number   | - | - |
| showQuickJumper | 是否显示跳转  | boolean   | true, false | false |
| onChange | 页码改变的回调，参数为当前页（page），前一页（prevPage），每页条数（pageSize）  | function | -  |  - | - |
| sizeChangeEvent |  每页条数改变的回调函数，返回 改变后的每页条数 及 当前页数  | function | - | - | - |
| itemRender |  自定义分页样式  | function(page, text) | - | - | - |
