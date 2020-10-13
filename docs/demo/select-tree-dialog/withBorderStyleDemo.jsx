import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTreeDialog from '../../../components/select-tree-dialog'
const prefix = 'select-tree-dialog-with-border-style-demo'
const desc = ''
const code = `import React from 'react'
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
                id: 7,
                title: '阿姆斯特朗.托马斯',
                isLeaf: true
              },
              {
                id: 8,
                title: '研发二部',
                children: [
                  {
                    id: 9,
                    title: '徐辉煌',
                    isLeaf: true
                  },
                  {
                    id: 10,
                    title: '王祚',
                    isLeaf: true
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
        desTitle='员工名称'
        // 在此处设置需要的组件风格样式，现只支持 'simple' or 'with-border'
        styleType='with-border'
        checkedType='parent'
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

const Demo = () => <DocViewer desc={desc} code={code} scope={{ SelectTreeDialog }} prefix={prefix} />
export default Demo
