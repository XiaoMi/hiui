import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
import Icon from '../../../components/icon'
const desc = 'DataItem 传入 disabled 属性可禁用菜单单项'
const prefix = 'dropdown-button'

const code = `import React from 'react'
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
}`

const DemoButton = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown, Icon }}
    prefix={prefix}
    desc={desc}
  />
)

export default DemoButton
