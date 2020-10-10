import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTreeDialog from '../../../components/select-tree-dialog'
const prefix = 'select-tree-dialog-with-border-style-demo'
const desc = ''
const code = `import React from 'react'
import SelectTreeDialog from '@hi-ui/hiui/es/select-tree-dialog'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.options = {
        desTitle: '员工名称',
        // 在此处设置需要的组件风格样式，现只支持 'simple' or 'with-border'
        styleType: 'with-border'
      }
  }
  render () {
    return (
      <SelectTreeDialog
        {...this.options}
      />
    )
  }
}`

const Demo = () => <DocViewer desc={desc} code={code} scope={{ SelectTreeDialog }} prefix={prefix} />
export default Demo
