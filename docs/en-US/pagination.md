## Pagination

Pagination

### 基础分页

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

### Control

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

      <Button type="primary" appearance="line" onClick={() => {this.setState({current: 5})}}>go 5</Button>

    </div>
  )
}
```
:::


### Full

:::demo

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
        total={600}
        pageSize={this.state.pageSize}
        current={this.state.current}
        showTotal={true}
        jumpEvent={(val) => {this.setState({current: val})}}
        sizeChangeEvent={(val, current) => {
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

| Attribute | Description | Type | Options |Default |
| --------   | -----  | ----  |  ----  | ----  |
| defaultCurrent | default current page number  | number | - | 1 |
| pageSize | page size  | number | - |  10 |
| total | total count  | number   | - | - |
| pageLink | If this parameter is set, `#/page={page}` will be added in the url | boolean | - | - |
| onChange | callback  | function | -  |  - | - |
| sizeChangeEvent |  size change callback  | function | - | - | - |
