import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
import Notification from '../../../components/notification'
const prefix = 'tree-edit'
const desc = '通过树的节点进行新增、删除、编辑等操作'
const rightOptions = ['基础', '自定义菜单']
const code = [
  {
    code: `import React from 'react'
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
                { id: 4, title: '运维' , disabled: true},
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
                { id: 33, title: '后端', other: 1 },
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
          apperance={'line'}
          data={this.state.treeData}
          onBeforeSave={(saveNode, data, level) => {
            console.log(saveNode, data,level)
            return true
          }}
          onSave={(saveNode, data) => {

            console.log(saveNode, data)
          }}
          onBeforeDelete={(deleteNode, data, level) => {
            console.log(deleteNode, data,level)
            return true
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
}`,
    opt: ['基础']
  },
  {
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
              searchable
              defaultExpandAll
              editable={true}
              data={this.state.treeData}
              onSave={(saveNode, data, level) => {
                if (level === 0) {
                  Notification.open({
                    title:'保存失败',
                    type:'error'
                  })
                  return false
                } else {
                  return true
                }
                console.log(saveNode, data,level)

              }}

              onDelete={(deleteNode, data) => {
                console.log(deleteNode, data)
              }}
              contextMenu={(currentItemData, level) => {
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
    opt: ['自定义菜单']
  }
]
const DemoEdit = () => (
  <DocViewer code={code} scope={{ Tree, Notification }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoEdit
