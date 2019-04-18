## Modal


### Basic
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
    console.log("customize event")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>Open</Button>
        <Modal 
          title="tips"
          show={this.state.show}
          backDrop={true}
          onConfirm={()=>{console.log('customize event')}}
          onCancel={this.cancelEvent.bind(this)}
        >
          <span>some message</span>
          <span>some message</span>
        </Modal>
        
      </div>
    )
  }


```
:::

### Customize button
> Customize the bottom button with footers<br/>
> Cancel the close button via 'closeBtn'<br/>

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
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>Open</Button>
        <Modal 
          title="提示消息"
          closeBtn={false}
          show={this.state.show}
          backDrop={true}
          onConfirm={()=>{console.log('customize event')}}
          onCancel={this.cancelEvent.bind(this)}
          // width={800}
          footers={[
            <Button type="primary" key={1} onClick={() => console.log(1)}>button</Button>,
            <Button type="info" key={2} onClick={() => console.log(2)}>button</Button>,
            <Button type="success" key={3} onClick={() => console.log(3)}>button</Button>,
            <Button type="danger" key={4} onClick={this.cancelEvent.bind(this)}>button</Button>
          ]}
        >
          <span>message</span>
          <span>message</span>
        </Modal>
        
      </div>
    )
  }


```
:::

### Other
:::demo

```js
  constructor (props) {
    super(props)
    this.state = {
      show: false
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
    console.log("close event")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>Open</Button>
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
        </Modal>
        
      </div>
    )
  }


```
:::

### Attribute

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| confirmType | confirm button type | string（Same as the type property of the button component） | - | primary |
| cancelType | cancel button type | string（Same as the type property of the button component）| - | default |
| title | Title | string <br/> Node <br/> React.Component | - | none |
| onConfirm | confirm callback function | function | - | none |
| onCancel | cancel callback function | function | - | none |
| confirmText | confirm text | string | - | Confirm |
| cancelText | cancel text | string | - | Cancel |
| backDrop | Click on the black background section to hide the modal | boolean | true / false | true |
| width |  custom modal width |  number <br/> string | - | 540px |
| closeBtn |   whether to display the close button |   bool | - | true |
| footers |    customize the bottom button array (passing in an empty array will cancel the bottom button) |    array | - | - |
| show | show |     bool | true / false | false |
