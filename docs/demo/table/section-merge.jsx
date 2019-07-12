import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-merge'
const code = `
import React from 'react'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {}
    }
    if (index === 4) {
      obj.props.colSpan = 0
    }
    return obj
  }

    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      render: (text, row, index) => {
        console.log(index, '---index---')
        if (index < 4) {
          return <a href='javascript:;'>{text}</a>
        }
        return {
          children: <a href='javascript:;'>{text}</a>,
          props: {
            colSpan: 5
          }
        }
      },
      key:1
    }, {
      title: 'Age',
      dataIndex: 'age',
      render: renderContent,
      key:2
    }, {
      title: 'Home phone',
      colSpan: 2,
      dataIndex: 'tel',
      key:3,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        }
        if (index === 2) {
          obj.props.rowSpan = 2
        }
        // These two are merged into above cell
        if (index === 3) {
          obj.props.rowSpan = 0
        }
        if (index === 4) {
          obj.props.colSpan = 0
        }
        return obj
      }
    }, {
      title: 'Phone',
      colSpan: 0,
      dataIndex: 'phone',
      render: renderContent,
      key:4
    }, {
      title: 'Address',
      dataIndex: 'address',
      render: renderContent,
      key:5
    }]

    this.data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      tel: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1 Lake Park'
    }, {
      key: '2',
      name: 'Jim Green',
      tel: '0571-22098333',
      phone: 18889898888,
      age: 42,
      address: 'London No. 1 Lake Park'
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Sidney No. 1 Lake Park'
    }, {
      key: '4',
      name: 'Jim Red',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'London No. 2 Lake Park'
    }, {
      key: '5',
      name: 'Jake White',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park'
    }]
  }
  render() {
    return <Table columns={this.columns} data={this.data} fixTop={56} name='merge'/>
  }
}`

const DemoMerge = () => <DocViewer code={code} scope={{ Table }} prefix={prefix} />
export default DemoMerge
