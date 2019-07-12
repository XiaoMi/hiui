import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
const prefix = 'stepper-base'
const code = `
import React from 'react'
import Stepper from '@hiui/hiui/es/stepper'\n
class Demo extends React.Component {
  render() {
    const list = [
      {
        title: '账号信息',
      },
      {
        title: '邮箱激活',
      },
      {
        title: '信息登记',
      },
    ]

    return (
      <div>
        <Stepper
          list={list}
          current={1}
        />
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Stepper }}
    prefix={prefix}
  />
)
export default DemoBase
