import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const prefix = 'stepper-up-down-icon'
const desc = '上下结构的图标用法需要加入 itemLayout="vertical"，并在添加 Icon'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Stepper from '@hi-ui/hiui/es/stepper'\n
class Demo extends React.Component {
  render() {
    const list = [
      {
        title: '账号信息',
        content: '请输入账号信息',
        icon: <Icon name='user' />
      },
      {
        title: '邮箱激活',
        content: '请输入邮箱',
        icon: <Icon name='time' />
      },
      {
        title: '信息登记',
        content: '请输入个人信息',
        icon: <Icon name='list' />
      },
    ]

    return (
      <div>
        <Stepper
          data={list}
          current={1}
          itemLayout='vertical'
        />
      </div>
    )
  }
}`
const DemoUpDownIcon = () => (
  <DocViewer code={code} scope={{ Stepper, Icon }} prefix={prefix} desc={desc} />
)
export default DemoUpDownIcon
