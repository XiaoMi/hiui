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

      { title: 'Column 1', dataIndex: 'address', key: 'a',fixed:'left' },
      { title: 'Column 2', dataIndex: 'address', key: 'b',  },
      { title: 'Column 3', dataIndex: 'address', key: 'c', },
      { title: 'Column 4', dataIndex: 'address', key: 'd', },
        { title: 'Column 1', dataIndex: 'address', key: 'e', },
        { title: 'Column 2', dataIndex: 'address', key: 'f',  },
         { title: 'Column 1', dataIndex: 'address', key: 'g', },
        { title: 'Column 2', dataIndex: 'address', key: 'h',  },
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
      <div style={{maxWidth: '1080px'}}>
         <Table  
           columns={this.columns}
           data={this.data}
           scrollX
           fixTop={64}
           height="300px"
         /> 
      </div>
     
    )
  }
}`
const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Table }}
    prefix={prefix}
  />
)
export default DemoRow
