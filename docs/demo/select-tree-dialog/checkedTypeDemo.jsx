import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTreeDialog, { SelectTreeDialogCheckedType } from '../../../components/select-tree-dialog'

const prefix = 'select-tree-dialog-checked-type-demo'
const desc = ''

const rightOptionsMap = {
  ALL: '所有节点',
  CHILD: '仅叶节点',
  PARENT: '裁剪节点'
}

const codeGenerate = (checkedType) => `
import React from 'react'
import SelectTreeDialog from '@hi-ui/hiui/es/select-tree-dialog'

class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkedIds: []
    }
    // 数据结构节点都未标明 isLeaf 值，凭借 children 来标明叶节点
    this.treeData = [
      {
        id: 1,
        title: '应用平台部',
        children: [
          {
            id: 2,
            title: '李梅'
          },
          {
            id: 3,
            title: 'Lily'
          },
          {
            id: 4,
            title: '海外业务部',
            children: [
              {
                id: 5,
                title: '阿姆斯特朗.托马斯'
              },
              {
                id: 6,
                title: '研发二部',
                children: [
                  {
                    id: 7,
                    title: '徐辉煌'
                  },
                  {
                    id: 8,
                    title: '王祚'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }

  onChangeDel(newCheckedIds){
    console.log('>>> checked leaf ids >>>')
    console.log(newCheckedIds)
    this.setState({checkedIds: newCheckedIds})
  }

  render () {
    return (
      <SelectTreeDialog
        title='员工名称'
        styleType='with-border'
        checkedType='${checkedType}'
        dialogTitle='选择员工'
        data={this.treeData}
        checkedIds={this.state.checkedIds}
        onChange={this.onChangeDel.bind(this)}
        style={{
          width: '480px'
        }}
      />
    )
  }
}`

const code = [
  {
    code: codeGenerate(SelectTreeDialogCheckedType.ALL),
    opt: [rightOptionsMap.ALL]
  },
  {
    code: codeGenerate(SelectTreeDialogCheckedType.CHILD),
    opt: [rightOptionsMap.CHILD]
  },
  {
    code: codeGenerate(SelectTreeDialogCheckedType.PARENT),
    opt: [rightOptionsMap.PARENT]
  }
]
const Demo = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ SelectTreeDialog }}
    prefix={prefix}
    rightOptions={Object.values(rightOptionsMap)}
  />
)
export default Demo
