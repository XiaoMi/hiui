import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const prefix = 'stepper-vertical-icon'
const desc = '竖直方向只需传入属性 vertical=true'
const code = `
import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Stepper from '@hi-ui/hiui/es/stepper'\n
class Demo extends React.Component {
  render() {
    const list = [
      {
        title: '账号信息',
        text: '请输入账号信息',
        icon: <Icon name='user' />,
      },
      {
        title: '邮箱激活',
        text: '请输入邮箱',
        icon: <Icon name='time' />,
      },
      {
        title: '信息登记',
        text: '请输入个人信息',
        icon: <Icon name='list' />,
      },
    ]

    return (
      <div
        style={{height: '500px', width: '130px'}}
      >
        <Stepper
          list={list}
          current={1}
          vertical={true}
        />
      </div>
    )
  }
}`

const DemoVerticalIcon = () => (
  <DocViewer code={code} scope={{ Stepper, Icon }} prefix={prefix} desc={desc} />
)
export default DemoVerticalIcon
