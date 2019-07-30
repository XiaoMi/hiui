import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-link'
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" appearance="link">突出链接</Button>
        <Button type="default" appearance="link">默认链接</Button>
        <Button type="success" appearance="link">成功链接</Button>
        <Button type="danger" appearance="link">危险链接</Button>
        <Button type="line" appearance="link" icon="edit" />
      </React.Fragment>
    )
  }
}`,
    opt: ['正常']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button disabled type="primary" appearance="link">突出链接</Button>
        <Button disabled type="default" appearance="link">默认链接</Button>
        <Button disabled type="success" appearance="link">成功链接</Button>
        <Button disabled type="danger" appearance="link">危险链接</Button>
        <Button disabled type="line" appearance="link" icon="edit" />
      </React.Fragment>
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoLink = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoLink
