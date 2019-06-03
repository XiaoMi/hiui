import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Button from '../../../../components/button'
const prefix = 'button-aux'
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `import React from 'react'
import Button from '@hiui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="success">通过</Button>
        <Button type="danger">驳回</Button>
        <Button type="success" icon="play" />
        <Button type="danger" icon="delete" />
      </React.Fragment>
    )
  }
}`,
    opt: ['正常']
  },
  {
    code: `import React from 'react'
import Button from '@hiui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="success" disabled>通过</Button>
        <Button type="danger" disabled>驳回</Button>
        <Button type="success" icon="play" disabled />
        <Button type="danger" icon="delete" disabled />
      </React.Fragment>
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoAux = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoAux
