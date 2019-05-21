## Loading 动效加载

常用的动态加载提示组件

### 基础用法

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

### 局部控制

:::demo

```js
constructor () {
  super()
  this.state = {
    showLoading: false,
    btnText: '开始加载，模拟3秒返回数据',
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
  // 模拟数据接口
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
      btnText: '重新加载，模拟3秒返回数据'
    })
  })
}
render () {
  return (
    <div style={{width: 500, height:260, border: '1px solid gray', position: 'reletive'}}>
      <Loading show={this.state.showLoading}>
        <Table
          columns={this.columns}
          data={this.state.list}
        />
        <div style={{textAlign: 'center'}}>
          <Button type="primary" onClick={this.clickEvent.bind(this)}>{this.state.btnText}</Button>
        </div>
      </Loading>
    </div>
  )
}
```

:::

### 整页

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
    <Button type="primary" onClick={this.clickEvent.bind(this)}>整页遮罩，3秒自动关闭</Button>
    {this.state.open && <Loading full={true} show size='large' tip='加载中' />}
  </div>
}
```

:::

### 接口调用

:::demo

```js
constructor () {
  super()
  this.state = {
    open: false
  }
  this.el = null
}

demoEvent1 () {
  const l = Loading.open()
  setTimeout(() => {
    l.close()
  }, 3000)
}
demoEvent2 () {
  const l = Loading.open({
    target: this.el,
    tip: '加载中'
  })
  setTimeout(() => {
    l.close()
  }, 3000)
}
render () {
  return <div>
    <Button type="primary" onClick={this.demoEvent1.bind(this)}>整页，3秒后关闭</Button>
    <Button type="primary" onClick={this.demoEvent2.bind(this)}>指定目标，3秒后关闭</Button>
    <div ref={(el) => {this.el = el}} style={{margin: 20}}>
      <Panel
        title={
          <div>
            <i className="hi-icon icon-user" style={{marginRight: '5px'}}></i>
            我是标题
          </div>
        }
      >
        <p>Panel content</p>
      </Panel>
    </div>
  </div>
}
```

:::

### Loading Attributes

| 参数   | 说明                                                | 类型    | 可选值                    | 默认值  |
| ------ | --------------------------------------------------- | ------- | ------------------------- | ------- |
| size   | 组件大小                                            | String  | large \| default \| small | default |
| tip    | 自定义的旋转动画下的文字                            | String  | -                         | -       |
| full   | 是否全屏                                            | Boolean | true \| false             | false   |
| show   | 是否显示加载动画                                    | Boolean | true \| false             | false   |
| target | 用于指令调用时,Loading 遮罩的元素，为空时将整页遮罩 | Element | -                         | -       |
