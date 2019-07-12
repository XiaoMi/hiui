import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-row'
const code = `
import React from 'react'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)

    this.columns = [

      { title: 'Column 1', dataIndex: 'address', key: '1',fixed:'left' },
      { title: 'Column 2', dataIndex: 'address', key: '2',  },
      { title: 'Column 3', dataIndex: 'address', key: '3', },
      { title: 'Column 4', dataIndex: 'address', key: '4', },
        { title: 'Column 1', dataIndex: 'address', key: '5', },
        { title: 'Column 2', dataIndex: 'address', key: '6',  },
        { title: 'Column 3', dataIndex: 'address', key: '7', },
        { title: 'Column 4', dataIndex: 'address', key: '8', },
      {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: () => <a href="javascript:;">action</a>,
      },
    ]



    this.data = []
    for (let i = 0; i < 10; i++) {
      this.data.push({
        key: i+1,
        name: \`Don Diablo \${i}\`,
        age: \`\${i}\${i}\`,
        address: \`EDC Las Vegas no. \${i}\`,
      });
    }
  }
  render() {
    return (
      <div >
       <Table
         columns={this.columns}
         data={this.data}
         scrollX
         fixTop={56}
         name='fixcol'
       />
      </div>
    )
  }
}`
const DemoRow = () => <DocViewer code={code} scope={{ Table }} prefix={prefix} />
export default DemoRow
