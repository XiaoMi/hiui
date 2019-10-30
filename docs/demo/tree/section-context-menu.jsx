import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-contextmenu'
const desc = '通过contextMenu 进行自定义菜单设置'
const rightOptions = ['数组', '函数']
const code = [{
  code: `import React from 'react'
    import Tree from '@hi-ui/hiui/es/tree'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          treeData: [
            { id: 1, title: '小米快递',
              children: [
                { id: 3, title: '后端', onClick: data => {console.log('后端：', data)} },
                { id: 4, title: '运维' , disabled: true},
                { id: 5, title: '前端' }
              ]
            }
          ]
        }

      }
      render() {
        return (
          <div style={{width:500}}>
            <Tree
              defaultExpandAll
              apperance="line"
              editable={true}
              data={this.state.treeData}
              onSave={(saveNode, data) => {
                console.log(saveNode, data)
              }}
              onDelete={(deleteNode, data) => {
                console.log(deleteNode, data)
              }}
              contextMenu={
                [{
                  type: 'editNode'
                }, {
                  title: '自定义 Title-1',
                  onClick: (item) => {
                    alert(JSON.stringify(item))
                  }
                }, {
                  type: 'addSiblingNodeNode',
                  title: '自定义 Title-2'
                }, {
                  title: '自定义 Title-3',
                  type: 'deleteNode',
                  onClick: (item, node) => {
                    console.log('自定义事件')
                    node.editNode(item)
                  }
                }, {
                  title: '自定义 Title-4',
                  onClick: (item, node) => {
                    alert('自定义编辑节点事件')
                  }
                }]
              }
              onChange={data => {console.log('Tree data:', data)}}
              highlightable
            />
          </div>
        )
      }
  }`,
  opt: ['数组']
}, {
  code: `import React from 'react'
    import Tree from '@hi-ui/hiui/es/tree'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          treeData: [
            { id: 1, title: '小米快递',
              children: [
                { id: 3, title: '后端', onClick: data => {console.log('后端：', data)} },
                { id: 4, title: '运维' , disabled: true},
                { id: 5, title: '前端' },
                { id: 6, title: '点击右键', customData: 'Y' }
              ]
            }
          ]
        }

      }
      render() {
        return (
          <div style={{width:500}}>
            <Tree
              defaultExpandAll
              apperance="line"
              editable={true}
              data={this.state.treeData}
              onSave={(saveNode, data) => {
                console.log(saveNode, data)
              }}
              onDelete={(deleteNode, data) => {
                console.log(deleteNode, data)
              }}
              contextMenu={(currentItemData) => {
                if (currentItemData.customData === 'Y') {
                  return [{
                    type: 'addChildNode'
                  }]
                }
                return  [{
                  type: 'editNode'
                }, {
                  title: '自定义 Title-1',
                  onClick: (item) => {
                    alert(JSON.stringify(item))
                  }
                }, {
                  type: 'editNode',
                  title: '自定义 Title-2'
                }, {
                  title: '自定义 Title-3',
                  type: 'editNode',
                  onClick: (item, node) => {
                    console.log('执行内置事件')
                    node.editNode(item)
                  }
                }, {
                  title: '自定义 Title-4',
                  onClick: (item, node) => {
                    console.log('自定义编辑节点事件')
                  }
                }]
              }}
              onChange={data => {console.log('Tree data:', data)}}
              highlightable
            />
          </div>
        )
      }
  }`,
  opt: ['函数']
}]
const DemoEdit = () => <DocViewer code={code} scope={{ Tree }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
export default DemoEdit
