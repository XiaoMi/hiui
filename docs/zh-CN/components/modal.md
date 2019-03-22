## Modal

模态对话框

### 基础用法
:::demo

```js
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }
  cancelEvent () {
    this.setState({
      show: false
    })
    console.log("自定义关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>打开</Button>
        <Modal 
          title="提示消息"
          show={this.state.show}
          onConfirm={()=>{console.log('自定义确定事件')}}
          onCancel={this.cancelEvent.bind(this)}
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Modal>
        
      </div>
    )
  }
```
:::

### 自定义尺寸


:::demo

- 通过 size 自定义尺寸，可使用 `large`、`nomal`、`small`，默认为 `normal`

```js
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      size: 'normal',
      sizeList: [
        {
          name: '标准',
          id: 'normal'
        },
        {
          name: '大',
          id: 'large'
        },
        {
          name: '小',
          id: 'small'
        }
      ],
      sizeListActive: 0
    }
  }
  cancelEvent () {
    this.setState({
      show: false
    })
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Radio
          list={this.state.sizeList}
          checked={this.state.sizeListActive}
          onChange={(data, index) => {
            this.setState({
              size: data,
              sizeListActive: index
            })
          }}
        />
        <Button type="primary" onClick={() => this.setState({show: true})}>打开</Button>
        <Modal
          title="窗口大小演示"
          size={this.state.size}
          show={this.state.show}
          onCancel={this.cancelEvent.bind(this)}
          footers={[
            <Button type="default" key={3} onClick={this.cancelEvent.bind(this)}>关闭</Button>
          ]}
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Modal>

      </div>
    )
  }


```
:::

### 自定义按钮


:::demo

- 通过 footers自定义底部的按钮，并执行对应自定义事件
- 通过 closeBtn 取消右上角关闭按钮

```js
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }
  cancelEvent () {
    this.setState({
      show: false
    })
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>打开</Button>
        <Modal 
          title="提示消息"
          closeBtn={false}
          show={this.state.show}
          onConfirm={()=>{console.log('自定义确定事件')}}
          onCancel={this.cancelEvent.bind(this)}
          footers={[
            <Button type="primary" key={0} onClick={() => console.log(1)}>自定义按钮1</Button>,
            <Button type="success" key={1} onClick={() => console.log(2)}>自定义按钮2</Button>,
            <Button type="danger" key={2} onClick={() => console.log(3)}>自定义按钮3</Button>,
            <Button type="default" key={3} onClick={this.cancelEvent.bind(this)}>关闭</Button>
          ]}
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Modal>
        
      </div>
    )
  }


```
:::

### 嵌套用法

:::demo

- 未传入title 及 closeBtn 为 false，可取消 title 部分
- footers 传入空数组，可取消底部按钮

```js
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      singleList: [
        { name:'手机', id:'2' },
        { name:'电视', id:'3', disabled: true },
        { name:'笔记本', id:'4', disabled: true },
        { name:'生活周边', id:'5' },
        { name:'办公', id:'6' },
      ]
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
    }]
    this.data = [{
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
    }]
  }
  clickEvent () {
    this.setState({
      show: false
    })
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>打开</Button>
        <Modal 
          closeBtn={false}
          show={this.state.show}
          onConfirm={this.clickEvent.bind(this)}
          onCancel={this.clickEvent.bind(this)}
          footers={[]}
        >
          <Table
            columns={this.columns}
            data={this.data}
          />
          <Select
            mode='single'
            list={this.state.singleList}
            placeholder='请选择品类'
            style={{width: '200px'}}
            value={'3'}
            onChange={(item) => {
                console.log('单选结果', item)
            }}
          />
        </Modal>
        
      </div>
    )
  }
```
:::

### Modal Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| title | 标题 | String \| Element | - | 无 |
| onConfirm | 点击确定的回调 | Function | - | 无 |
| onCancel | 点击遮罩或者右上角取消或者取消按钮的回调 | Function | - | 无 |
| confirmText | 确定按钮文字 | String | - | 确定 |
| cancelText | 取消按钮文字 | String | - | 取消 |
| backDrop | 点击黑色背景部分是否隐藏弹框 | Boolean | - | true |
| size |  定义弹窗尺寸 | String | normal \| large \| small | normal |
| width |  自定义弹窗宽度 |  number <br/> String | - | 600px |
| closeBtn |   是否显示右上角关闭按钮 |   Boolean | - | true |
| footers |    自定义底部按钮数组（传入空数组将取消底部按钮） |    Array | - | - |
| show | 弹窗是否显示 |     Boolean | - | false |
