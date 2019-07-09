import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-normal'
const code = `
import React from 'react'
import Tree from '@hiui/hiui/es/tree'\n
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
          editable={true}
          data={this.state.treeData}
          defaultCheckedKeys={[2]}
          onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
          onChange={data => {console.log('Tree data:', data)}}
          openIcon='down'
          closeIcon='up'
          highlightable
          onNodeClick={(item) => console.log('------click node', item)}
        />
      </div>
    )
  }
}`
const DemoNormal = () => (
  <DocViewer
    code={code}
    scope={{ Tree }}
    prefix={prefix}
  />
)
export default DemoNormal
