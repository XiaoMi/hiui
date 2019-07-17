import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-base'
const code = `
import React from 'react'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)

    this.columns = [

      { title: '姓名', dataIndex: 'name', key: '1'},
      { title: '年龄', dataIndex: 'age', key: '2',type:'number'},
      { title: '地址', dataIndex: 'address', key: '3'},
      {
        title: ()=><div>自定义标题</div>,
        dataIndex: 'address', key: '4',
        width: '500px',
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
    for (let i = 0; i < 5; i++) {
      this.data.push({
        // key: i,
        name: \`Don Diablo \${i}\`,
        age: i,
        address: \`EDC Las Vegas no. \${i}\`,
      });
    }
  }
  render() {
    return <Table
     height="250px" 
     columns={this.columns} 
     data={this.data} 
     name='advance' 
     advance={{
      sum:true,
      avg:true,
      prefix:[{
        name: 'hiui',
        age: 2,
        address: 'beijing',
      },
      {
        name: 'hiui2',
        age: 1.5,
        address: 'beijing',
      }],
      suffix:[{
        name: 'xiaomi',
        age: 9,
        address: 'BJ',
      }]
     }}
      />
  }
  
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Table }}
    prefix={prefix}
  />
)
export default DemoBase
