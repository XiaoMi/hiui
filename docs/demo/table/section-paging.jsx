import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/item'
const prefix = 'table-paging'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Form from '@hi-ui/hiui/es/form/index'
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
      { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
      { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
      { title: 'Column 1', dataIndex: 'address', key: '1' ,width:120,},
      { title: 'Column 2', dataIndex: 'address', key: '2' ,width:120,},
      { title: 'Column 3', dataIndex: 'address', key: '3' ,width:120,},
      { title: 'Column 4', dataIndex: 'address', key: '4' ,width:120,},
      { title: 'Column 5', dataIndex: 'address', key: '5' ,width:120,},
      { title: 'Column 6', dataIndex: 'address', key: '6' ,width:120,},
      { title: 'Column 7', dataIndex: 'address', key: '7' ,width:120,},
      { title: 'Column 8', dataIndex: 'address', key: '8' }
    ]
    this.state = {
      pageSize: 10,
      total: 100,
      current :2,
      data: []
    }
  }

  set(current){
    let {pageSize} = this.state
    let data = []
    for(let i=pageSize*(current-1);i<pageSize*current;i++) {
      data.push({
        key: i,
        name: 'data-' + i,
        age: i + 1,
        address: 'address-' + i
      })
    }
    this.setState({data,current})
  }

  componentDidMount(){
    this.set(this.state.current)
  }

  render() {
    return <Table
          columns={this.columns}
          data={this.state.data} 
          pagination={{
            pageSize: this.state.pageSize,
            total:this.state.total,
            current: this.state.current,
            onChange:(page,pre,size)=>{
              this.set(page)
            },
            position : 'center',

          }}
          />
  }
}`
const DemoPaging = () => (
  <DocViewer
    code={code}
    scope={{ Table, Input, Form, FormItem, Button }}
    prefix={prefix}
  />
)
export default DemoPaging
