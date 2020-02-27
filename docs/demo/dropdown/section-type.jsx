import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import { Dropdown, Message } from '../../../components'
const prefix = 'dropdown-type'
const rightOptions = ['按钮样式', '按钮动作']
const desc = [
  '操作入口以 Button 样式展示，强调重要操作'
]

const code = [
  {
    code: `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '菜单一',
      }, {
        title: '菜单二'
      }, {
        title: '菜单三'
      }, {
        title: '-'
      }, {
        title: '链接一',
        href: 'https://www.mi.com',
        disabled: true
      }]
    }
  }
  render () {
    const { list } = this.state
    return (
      <Dropdown
        data={list}
        title="鼠标悬停"
      />
    )
  }
}`,
    opt: ['文字型']
  },
  {
    code: `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '菜单一',
      }, {
        title: '菜单二'
      }, {
        title: '菜单三'
      }, {
        title: '-'
      }, {
        title: '链接一',
        href: 'https://www.mi.com',
        disabled: true
      }]
    }
  }
  render () {
    const { list } = this.state
    return (
      <Dropdown
        data={list}
        type='button'
        title='鼠标悬停'
      />
    )
  }
}`,
    opt: ['按钮样式']
  },
  {
    code: `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '菜单一',
      }, {
        title: '菜单二'
      }, {
        title: '菜单三'
      }, {
        title: '-'
      }, {
        title: '链接一',
        href: 'https://www.mi.com',
        disabled: true
      }]
    }
  }
  render () {
    const { list } = this.state
    return (
      <Dropdown
        data={list}
        type='group'
        title='点击'
        onButtonClick={() => {
          Message.open({ title: '点击左侧按钮' })
        }}
      />
    )
  }
}`,
    opt: ['按钮动作']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown, Message }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoBase
