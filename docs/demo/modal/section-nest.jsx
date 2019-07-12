import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
import Select from '../../../components/select'
import Table from '../../../components/table'
const desc = '未传入 title 及 closable 为 false，可取消 title 部分，footer 为 null，可取消底部按钮'
const prefix = 'modal-nest'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'
import Select from '@hi-ui/hiui/es/select'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
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
      visible: false
    })
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          closable={false}
          visible={this.state.visible}
          onConfirm={this.clickEvent.bind(this)}
          onCancel={this.clickEvent.bind(this)}
          footer={null}
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
}`
const DemoNest = () => (
  <DocViewer code={code} scope={{ Button, Modal, Select, Table }} prefix={prefix} desc={desc} />
)
export default DemoNest
