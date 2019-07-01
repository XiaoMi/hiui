import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const prefix = 'stepper-icon'
const code = `
import React from 'react'
import Icon from '@hiui/hiui/es/icon'
import Stepper from '@hiui/hiui/es/stepper'\n
class Demo extends React.Component {
  render() {
    const list = [
      {
        title: '账号信息',
        icon: <Icon name='user' />,
      },
      {
        title: '邮箱激活',
        icon: <Icon name='time' />
      },
      {
        title: '信息登记',
        icon: <Icon name='list' />
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
const DemoIcon = () => (
  <DocViewer
    code={code}
    scope={{ Stepper, Icon }}
    prefix={prefix}
  />
)
export default DemoIcon
