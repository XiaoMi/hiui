import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Button from '../../../../components/button'
const prefix = 'button-size'
const leftOptions = ['链接']
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `import React from 'react'
import Button from '@hiui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="default" appearance="link">默认链接</Button>
        <Button type="primary" appearance="link">主要链接</Button>
        <Button type="success" appearance="link">成功链接</Button>
        <Button type="danger" appearance="link">危险链接</Button>
        <Button type="primary" appearance="link" icon="edit" />
      </React.Fragment>
    )
  }
}`,
    opt: ['链接', '正常']
  },
  {
    code: `import React from 'react'
import Button from '@hiui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="default" appearance="link" disabled>默认链接</Button>
        <Button type="primary" appearance="link" disabled>主要链接</Button>
        <Button type="success" appearance="link" disabled>成功链接</Button>
        <Button type="danger" appearance="link" disabled>危险链接</Button>
        <Button type="primary" appearance="link" icon="edit" disabled />
      </React.Fragment>
    )
  }
}`,
    opt: ['链接', '禁用']
  }
]

const DemoLink = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
    leftOptions={leftOptions}
    rightOptions={rightOptions}
  />
)
export default DemoLink
