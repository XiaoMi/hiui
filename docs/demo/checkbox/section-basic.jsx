import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-basic'
const rightOptions = ['正常', '禁用']
const code = [
  {
    code: `
import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Checkbox autoFocus>Checkbox</Checkbox>
        <Checkbox defaultChecked>默认勾选</Checkbox>
      </React.Fragment>
    )
  }
}`,
    opt: ['正常']
  },
  {
    code: `import React from 'react'
import Checkbox from '@hiui/hiui/es/checkbox'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Checkbox diabled>Checkbox</Checkbox>
        <Checkbox diabled defaultChecked>默认勾选</Checkbox>
      </React.Fragment>
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc='基础用法'
  />
)
export default DemoBasic
