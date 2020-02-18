import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-group'
const desc = '用于将有并列关系的一组动作，以组的形式展示'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <Button.Group>
        <Button type="default">排序</Button>
        <Button type="default">求和</Button>
        <Button type="default">求平均值</Button>
      </Button.Group>
    )
  }
}`

const DemoGroup = () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} desc={desc} />
)
export default DemoGroup
