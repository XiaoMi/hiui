import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const prefix = 'stepper-up-down'
const desc = '上下结构只需加入 itemLayout="vertical"；只有上下结构有 text 描述'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Stepper from '@hi-ui/hiui/es/stepper'\n
class Demo extends React.Component {
  render() {
    const list = [
      {
        title: '账号信息',
        content: '请输入账号信息',
      },
      {
        title: '邮箱激活',
        content: '请输入邮箱',
      },
      {
        title: '信息登记',
        content: '请输入个人信息',
      },
    ]

    return (
      <Stepper
        data={list}
        current={2}
        itemLayout='vertical'
      />
    )
  }
}`
const DemoUpDown = () => (
  <DocViewer code={code} scope={{ Stepper, Icon }} prefix={prefix} desc={desc} />
)
export default DemoUpDown
