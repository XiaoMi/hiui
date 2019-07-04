import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const prefix = 'stepper-vertical'
const desc = '竖直方向只需传入属性 vertical=true'
const code = `
import React from 'react'
import Icon from '@hiui/hiui/es/icon'
import Stepper from '@hiui/hiui/es/stepper'\n
class Demo extends React.Component {
  render() {
    const list = [
      {
        title: '账号信息',
        text: '请输入账号信息',
      },
      {
        title: '邮箱激活',
        text: '请输入邮箱',
      },
      {
        title: '信息登记',
        text: '请输入个人信息',
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

const DemoVertical = () => <DocViewer code={code} scope={{ Stepper, Icon }} prefix={prefix} desc />
export default DemoVertical
