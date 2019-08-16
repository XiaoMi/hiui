import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-edit'
const desc = '通过树的节点进行新增、删除、编辑等操作'
const code = `import React from 'react'
import Tree from '@hi-ui/hiui/es/tree'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [
        { id: 1, title: '小米快递',
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
            { id: 22, title: '技术',
              children: [
                { id: 33, title: '后端' },
                { id: 44, title: '运维' },
                { id: 55, title: '前端' }
              ]
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
          defaultExpandAll
          showLine
          editable={true}
          data={this.state.treeData}
          onSave={(saveNode, data) => {
            console.log(saveNode, data)
          }}
          onDelete={(deleteNode, data) => {
            console.log(deleteNode, data)
          }}
          onChange={data => {console.log('Tree data:', data)}}
          highlightable
        />
      </div>
    )
  }
}`
const DemoEdit = () => <DocViewer code={code} scope={{ Tree }} prefix={prefix} desc={desc} />
export default DemoEdit
