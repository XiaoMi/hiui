import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-group'
const code = `
import React from 'react'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)


    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: '1',
      // width: 100,

      filters: [{
        text: 'Joe',
        value: 'Joe'
      }, {
        text: 'John',
        value: 'John'
      }],
      onFilter: (value, record) => record.name.indexOf(value) === 0
    }, {
      title: 'Other',

      children: [{
        title: 'Age',
        dataIndex: 'age',
        // key: 'age',
        // width: 200,
        key:2,
        sorter: (a, b) => a.age - b.age
      }, {
        title: 'Address',

        children: [{
          title: 'Street',
          dataIndex: 'street',
          key: '3'
          // width: 200,
        }, {
          title: 'Block',
          children: [{
            title: 'Building',
            dataIndex: 'building',
            key: '4'
            // width: 100,
          }, {
            title: 'Door No.',
            dataIndex: 'number',
            key: '5'
            // width: 100,
          }]
        }]
      }]
    }, {
      title: 'Company',
      key: '6',
      children: [{
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: '7'
      }, {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: '8'
      }]
    }, {
      title: 'Gender',
      dataIndex: 'gender',
      key: '9'
      // width: 60,

    }]

    const data = []
    for (let i = 0; i < 6; i++) {
      data.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M'
      })
    }
    this.data = data
  }
  render() {
    return <Table columns={this.columns} data={this.data} fixTop={56} name='headergroup'/>
  }
}`

const DemoGroup = () => <DocViewer code={code} scope={{ Table }} prefix={prefix} />
export default DemoGroup
