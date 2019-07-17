import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Table from '../../../components/table'
import Loading from '../../../components/loading'
const prefix = 'loading-localControl'

const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Loading from '@hi-ui/hiui/es/loading'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
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
        <Loading visible={this.state.showLoading}>
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
}`
const DemoLocalControl = () => (
  <DocViewer code={code} scope={{ Button, Table, Loading }} prefix={prefix} />
)
export default DemoLocalControl
