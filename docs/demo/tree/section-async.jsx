import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-async'
const desc = '打开下一级时从服务端调取节点数据'
const code = `import React from 'react'
import Tree from '@hi-ui/hiui/es/tree'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [
        { id: 1, title: '小米',
          children: [
            { id: 2, title: '技术',
              children: [
                { id: 3, title: '后端' },
                { id: 4, title: '运维' },
                { id: 5, title: '前端' }
              ]
            },
            { id: 6, title: '产品' }
          ]
        },
        { id: 11, title: '小米',
          children: [
            { id: 22, title: '技术'
            },
            { id: 66, title: '产品' }
          ]
        },
      ]
    }

  }

  render() {
    return (
      <div style={{width:500}}>
        <Tree
          onLoadChildren={node=>{
            const obj = {
              method:'get',
              data:{},
              params:{id:node.id},
              url:'https://my-json-server.typicode.com/hiui-group/db/conditiondata',
              transformResponse:(res)=>{
                let data = JSON.parse(res)
                if(data[0]) {
                  data[0].id = Math.random()
                }

                return data
              }
            }
            return obj
          }}
          defaultExpandAll
          editable={true}
          data={this.state.treeData}
          onChange={data => {console.log('Tree data:', data)}}
          onSelect={(item) => console.log('select node', item)}
        />
      </div>
    )
  }
}`
const DemoAsync = () => <DocViewer code={code} scope={{ Tree }} prefix={prefix} desc={desc} />
export default DemoAsync
