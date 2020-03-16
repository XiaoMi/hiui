import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-size'

const desc = '不同的展示区域选择相应尺寸的按钮'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" size="large">大号按钮</Button>
        <Button type="primary" size="default">中号按钮</Button>
        <Button type="primary" size="small">小号按钮</Button>
      </React.Fragment>
    )
  }
}`

const DemoAux = () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} desc={desc} />
)
export default DemoAux
