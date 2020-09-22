import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-line'
const desc = '定义不同样式的树节点，满足多样性的业务场景'
const leftOptions = ['线型', '文件夹型']
const code = [
  {
    code: `import React from 'react'
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
          apperance='line'
          defaultExpandAll
          data={this.state.treeData}
          onChange={data => {console.log('Tree data:', data)}}
          highlightable
          onSelect={(item) => console.log('select node', item)}
        />
      </div>
    )
  }
}`,
    opt: ['线型']
  },
  {
    code: `import React from 'react'
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
          apperance='folder'
          defaultExpandAll
          data={this.state.treeData}
          onChange={data => {console.log('Tree data:', data)}}
          highlightable
          onClick={(item) => console.log('------click node', item)}
        />
      </div>
    )
  }
}`,
    opt: ['文件夹型']
  }
]
const DemoLine = () => <DocViewer desc={desc} code={code} scope={{ Tree }} prefix={prefix} leftOptions={leftOptions} />
export default DemoLine
