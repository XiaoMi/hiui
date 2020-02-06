import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-disabled'
const desc = ['暂不可操作的状态，可通过其它方式开启']
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button disabled type="primary">主要按钮</Button>
        <Button disabled type="line">普通按钮</Button>
        <Button disabled type="success">安全按钮</Button>
        <Button disabled type="danger">危险按钮</Button>
        <Button disabled type="default">幽灵按钮</Button>
      </React.Fragment>
    )
  }
}`

const DemoStandard = () => (
  <DocViewer code={code} scope={{ Button }} prefix={prefix} desc={desc} />
)
export default DemoStandard
