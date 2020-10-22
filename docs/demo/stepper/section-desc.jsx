import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Stepper from '../../../components/stepper'
import Icon from '../../../components/icon'
const prefix = 'stepper-desc'
const desc = '步骤名称不足以表达明确用意，用辅助信息进一步说明'
const rightOptions = ['基础', '图标']
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
        icon: <Icon name='bars' />
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
}`,
    opt: ['图标']
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
    }`,
    opt: ['基础']
  }
]
const DemoUpDownIcon = () => (
  <DocViewer code={code} scope={{ Stepper, Icon }} rightOptions={rightOptions} prefix={prefix} desc={desc} />
)
export default DemoUpDownIcon
