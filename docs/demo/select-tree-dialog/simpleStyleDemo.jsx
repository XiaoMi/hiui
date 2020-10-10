import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTreeDialog from '../../../components/select-tree-dialog'
const prefix = 'select-tree-dialog-simple-style-demo'
const desc = ''
const code = `import React from 'react'
import SelectTreeDialog from '@hi-ui/hiui/es/select-tree-dialog'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.options = {
        desTitle: '员工名称',
        // 在此处设置需要的组件风格样式，现只支持 'simple' or 'with-border'
        styleType: 'simple',
        dialogTitle: '选择员工'
      }
    
    this.treeData = [
      {
        id: 1,
        title: '应用平台部',
        children: [
          {
            id: 2,
            title: '物流平台'
          },
          {
            id: 3,
            title: '运输管理平台'
          },
          {
            id: 4,
            title: '海外业务部',
            children: [
              {
                id: 6,
                title: '售后部'
              },
              {
                id: 7,
                title: '研发一部'
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
          },
          {
            id: 5,
            title: '物流平台'
          }
        ]
      }
    ]
  }
  render () {
    return (
      <SelectTreeDialog
        {...this.options}
        data={this.treeData}
      />
    )
  }
}`

const Demo = () => <DocViewer desc={desc} code={code} scope={{ SelectTreeDialog }} prefix={prefix} />
export default Demo
