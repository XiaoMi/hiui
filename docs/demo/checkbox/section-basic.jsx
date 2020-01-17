import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
const prefix = 'section-basic'
const rightOptions = ['正常', '禁用']
const desc = '展示所有备选项，数量不宜超出10个'
const code = [
  {
    code: `import React from 'react'
import Checkbox from '@hi-ui/hiui/es/checkbox'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox defaultChecked>Checkbox</Checkbox>
      </React.Fragment>
    )
  }
}`,
    opt: ['正常']
  },
  {
    code: `import React from 'react'
import Checkbox from '@hi-ui/hiui/es/checkbox'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Checkbox disabled>Checkbox</Checkbox>
        <Checkbox disabled defaultChecked>Checkbox</Checkbox>
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
    desc={desc}
  />
)
export default DemoBasic
