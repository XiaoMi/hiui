import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Icon from '../../../components/icon'
import Button from '../../../components/button'
const prefix = 'icon-nest'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Icon from '@hi-ui/hiui/es/icon'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Button type="success" icon="check" />
        <Button type="danger"><Icon name="close" /></Button>
        <Button type="line"><Icon name="edit" /> 编辑</Button>
      </div>
    )
  }
}`
const DemoNest = () => <DocViewer code={code} scope={{ Icon, Button }} prefix={prefix} />
export default DemoNest
