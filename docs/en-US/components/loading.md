## Loading


### Basic

:::demo 

```js
render () {
  return <div style={{display:'flex', height: 100}}>
    <Loading size="small"/>
    <Loading />
    <Loading size="large"/>
  </div>
}
```
:::

### partial control
:::demo 

```js
constructor () {
  super()
  this.state = {
    showLoading: false,
    btnText: 'Start loading, simulate 3 seconds return data',
    list: []
  }
  this.columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, row, index) => {
      return <a href="javascript:;">{text}</a>
    }
  }, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },{
  title: 'Action',
  key: 'action',
  render: (text, record) => (
      <span>
        <a href="javascript:;">Action 一 {record.name}</a>
      </span>
    ),
  }];
}
mockTableData () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([{
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      }])
    }, 3000)
  })
}
clickEvent () {
  this.setState({
    showLoading: true
  })
  this.mockTableData().then(res => {
    this.setState({
      showLoading: false, 
      list: res,
      btnText: 'Reload, simulate 3 seconds return data'
    })
  })
}
render () {
  return <div>
    <div style={{width: 500, height:260, border: '1px solid gray'}}>
      <Loading tip='Desperately loading' show={this.state.showLoading}>
        <Table
          columns={this.columns}
          data={this.state.list}
        />
        <div style={{textAlign: 'center'}}>
          <Button type="primary" onClick={this.clickEvent.bind(this)}>{this.state.btnText}</Button>
        </div>
      </Loading>
    </div>
    
  </div>
}
```
:::

### Page
:::demo 

```js
constructor () {
  super()
  this.state = {
    open: false
  }
}
clickEvent () {
  this.setState({open: true})
  setTimeout(() => {
    this.setState({open: false})
  }, 3000)
}
render () {
  return <div>
    <Button type="primary" onClick={this.clickEvent.bind(this)}>Full page mask, automatically closed in 3 seconds</Button>
    {this.state.open && <Loading full={true} size='large'/>}
  </div>
}
```
:::

### Attributes

| Attribute | Description | Type | Options | Default |
| --------   | -----  | ----  |    ----  |   ----  |
| size |   Size  |  string   | large default small | default |
| tip |   Text  |  string   | - | |
| full |   Whether full screen  |   bool   | - | false |
| show |    Whether to display the loading animation  |  boolean   | true false | false |
