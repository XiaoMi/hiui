import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const desc = '每个步骤可用图标明确表示含义，带来丰富生动的效果'
const prefix = 'stepper-icon'
const rightOptions = ['上下结构', '左右结构']
const code = [
  {
    code: `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Stepper from '@hi-ui/hiui/es/stepper'\n
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
      <Stepper
        data={list}
        current={1}
      />
    )
  }
}`,
    opt: ['左右结构']
  },
  {
    code: `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Stepper from '@hi-ui/hiui/es/stepper'\n
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
      <Stepper
        itemLayout="vertical"
        data={list}
        current={1}
      />
    )
  }
}`,
    opt: ['上下结构']
  }
]
const DemoIcon = () => (
  <DocViewer
    code={code}
    scope={{ Stepper, Icon }}
    rightOptions={rightOptions}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoIcon
