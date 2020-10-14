import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTreeDialog, { SelectTreeDialogStyle } from '../../../components/select-tree-dialog'

const prefix = 'select-tree-dialog-base-demo'
const desc = ''

const rightOptionsMap = {
  SIMPLE: '简单风格',
  WITH_BORDER: '线框风格'
}

const codeGenerate = (styleType) => `
import React from 'react'
import SelectTreeDialog from '@hi-ui/hiui/es/select-tree-dialog'

class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      checkedIds: []
    }

    this.treeData = [
      {
        id: 1,
        title: '应用平台部',
        children: [
          {
            id: 2,
            title: '李梅',
            isLeaf: true
          },
          {
            id: 3,
            title: 'Lily',
            isLeaf: true
          },
          {
            id: 4,
            title: '海外业务部',
            children: [
              {
                id: 5,
                title: '阿姆斯特朗.托马斯',
                isLeaf: true
              },
              {
                id: 6,
                title: '研发二部',
                children: [
                  {
                    id: 7,
                    title: '徐辉煌',
                    isLeaf: true
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
        // 在此处设置需要的组件风格样式，现只支持 'simple' or 'with-border'
        styleType='${styleType}'
        dialogTitle='选择员工'
        data={this.treeData}
        checkedIds={this.state.checkedIds}
        onChange={this.onChangeDel.bind(this)}
      />
    )
  }
}`

const code = [
  {
    code: codeGenerate(SelectTreeDialogStyle.SIMPLE),
    opt: [rightOptionsMap.SIMPLE]
  },
  {
    code: codeGenerate(SelectTreeDialogStyle.WITH_BORDER),
    opt: [rightOptionsMap.WITH_BORDER]
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
