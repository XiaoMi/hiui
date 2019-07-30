import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-multiple'
const code = `import React from 'react'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)

    this.columns = [

      {
        title: 'name',
         dataIndex: 'name',
         key: '1',
         width: '200px'
      },
      {
        dataIndex: 'age',
        key: '2',
         width: '150px',
        sorter(pre,next){
          return pre.age - next.age
        }
      },
      { title: 'Column 1', dataIndex: 'address', key: '3', width: '200px'},
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

    const data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i + 1,
        name: \`Don Diablo \${i}\`,
        age: \`\${i}\`,
        address: \`EDC Las Vegas no. \${i}\`,
      });
    }

    this.state =  {
       selectedRowKeys: [], // Check here to configure the default column
       data
     }
  }

  render(){
    const { selectedRowKeys ,data} = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys,rows)=>{
        this.setState({selectedRowKeys})
      },
      dataName:'age'
    }
    return <Table bordered columns={this.columns} data={data} rowSelection={rowSelection} />
  }
}`

const DemoMultiple = () => (
  <DocViewer
    code={code}
    scope={{ Table }}
    prefix={prefix}
  />
)
export default DemoMultiple
