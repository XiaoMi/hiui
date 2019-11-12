import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-async'
const desc = '点击展开异步加载树的子节点'
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
                { id: 3, title: '后端', onClick: data => {console.log('后端：', data)} },
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
          loadTreeNode={id=>{
            const obj = {
              method:'get',
              headers:{'Content-Type': 'application/x-www-form-urlencoded'},
              data:{},
              params:{id:id},
              url:'http://yapi.demo.qunar.com/mock/26534/hiui/async-tree',
              transformResponse:(res)=>{return res.data}
            }
            return obj
          }}
          defaultExpandAll
          editable={true}
          data={this.state.treeData}
          onChange={data => {console.log('Tree data:', data)}}
          highlightable
          onClick={(item) => console.log('------click node', item)}
        />
      </div>
    )
  }
}`
const DemoAsync = () => <DocViewer code={code} scope={{ Tree }} prefix={prefix} desc={desc} />
export default DemoAsync
