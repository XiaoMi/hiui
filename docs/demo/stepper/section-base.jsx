import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
const prefix = 'stepper-base'
const desc =
  '一个复杂任务需要拆分多个步骤完成，步骤数量不宜过多，4-7个为宜'
const code = `import React from 'react'
import Stepper from '@hi-ui/hiui/es/stepper'\n
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
      <Stepper
        data={list}
        current={1}
      />
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Stepper }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
