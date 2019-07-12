import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
import Tooltip from '../../../components/tooltip'
const prefix = 'table-sort'
const code = `
import React from 'react'
import Tooltip from '@hiui/hiui/es/tooltip'
import Table from '@hiui/hiui/es/table'\n
class Demo extends React.Component {
  constructor(props){
    super(props)

    this.columns = [

      {
        title: <Tooltip
           title="long long long long long long long long long long tex"
           style={{margin: '0 10px'}}>
           短文本
         </Tooltip>,
         dataIndex: 'name', key: '1',
      },
      {
        dataIndex: 'age',
        key: '2',
        sorter(pre,next){
          return pre.age - next.age
        }
      },
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
        key: i,
        name: \`Don Diablo \${i}\`,
        age: \`\${i}\`,
        address: \`EDC Las Vegas no. \${i}\`,
      });
    }
  }
  render() {
    return <Table size='small' name={'sorter'} columns={this.columns} data={this.data} name='sorter'/>
  }
}`

const DemoSort = () => (
  <DocViewer
    code={code}
    scope={{ Table, Tooltip }}
    prefix={prefix}
  />
)
export default DemoSort
