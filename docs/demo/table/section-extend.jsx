import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
const prefix = 'table-extend'
const code = `
import React from 'react'
import Form from '@hi-ui/hiui/es/form/index'
import Button from '@hi-ui/hiui/es/button'
import FormItem from '@hi-ui/hiui/es/form/item'
import Input from '@hi-ui/hiui/es/input'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)

    this.columns = [


      {
        type: 'expand',
        key:'expand',
        width:'50',
        fixed: 'left',
        render (text, record, index) {
          return (
            <div>
              <br/>
              <Form labWidth="100" width={500} labelWidth={100}>

                <FormItem label="age">
                    <Input value={record.age} />
                </FormItem>
                <FormItem label="">
                    <Input value={record.name} />
                </FormItem>
                <FormItem>
                    <Button>修改</Button>
                </FormItem>

              </Form>
            </div>
          )
        }
      },
      { title: 'Full Name', width: 150, dataIndex: 'name', key: 'name', fixed: 'left' },
      { title: 'Age', width: 150, dataIndex: 'age', key: 'age', fixed: 'left' },
      { title: 'Column 1', dataIndex: 'address', key: '1'},
      { title: 'Column 2', dataIndex: 'address', key: '2' },
      { title: 'Column 3', dataIndex: 'address', key: '3'},
      { title: 'Column 4', dataIndex: 'address', key: '4'},
      { title: 'Column 5', dataIndex: 'address', key: '5'},
      { title: 'Column 6', dataIndex: 'address', key: '6'},
      { title: 'Column 7', dataIndex: 'address', key: '7'},
      // { title: 'Column 8', dataIndex: 'address', key: '8' }
    ]

    this.data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York Park'
    }, {
      key: '2',
      name: 'Jim Green',
      age: 40,
      address: 'London Park'
    }]
  }
  render() {
    return <Table columns={this.columns} data={this.data} fixTop={56}/>
  }
}`
const DemoExtend = () => (
  <DocViewer
    code={code}
    scope={{ Table, Input, Form, FormItem, Button }}
    prefix={prefix}
  />
)
export default DemoExtend
