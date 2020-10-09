import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTreeDialog from '../../../components/select-tree-dialog'
const prefix = 'select-tree-dialog-test-demo'
const desc = ''
const code = `import React from 'react'
import SelectTreeDialog from '@hi-ui/hiui/es/select-tree-dialog'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.options = {
        desTitle: '选择员工'
      }
  }
  render () {
    return (
      <SelectTreeDialog
        {...this.options}
      >
      </SelectTreeDialog>
    )
  }
}`

const TestDemo = () => <DocViewer desc={desc} code={code} scope={{ SelectTreeDialog }} prefix={prefix} />
export default TestDemo
