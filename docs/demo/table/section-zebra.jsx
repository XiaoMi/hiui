import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-zebra'
const code = `
import React from 'react'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)

    this.columns = [

      { title: 'Column 1', dataIndex: 'name', key: '1'},
      { title: 'Column 1', dataIndex: 'age', key: '2'},
      { title: 'Column 1', dataIndex: 'address', key: '3'},
      {
        title: ()=><div>自定义标题</div>,
        dataIndex: 'address', key: '4',
        render(text,record,index){
        return (
          <div>
              {text} --- {index} --- 自定义渲染
          </div>
        )
      }},
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
        // key: i,
        name: \`Don Diablo \${i}\`,
        age: \`\${i}\${i}\`,
        address: \`EDC Las Vegas no. \${i}\`,
      });
    }
  }
  render() {
    return <Table striped columns={this.columns} data={this.data} name='base'  checked={(item) => item.id === 1 || item.id === 3} />
  }
}`

const DemoZebra = () => <DocViewer code={code} scope={{ Table }} prefix={prefix} />
export default DemoZebra
