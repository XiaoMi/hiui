import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
const prefix = 'dropdown-type'
const rightOptions = ['左下', '左上', '右下', '右上']
const desc = '通过 placement 属性切换菜单显示位置'

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
        placement='bottom-start'
        type='button'
        title='鼠标悬停'
      />
    )
  }
}`,
    opt: ['左下']
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
        placement='top-start'
        title='鼠标悬停'
      />
    )
  }
}`,
    opt: ['左上']
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
        placement='bottom-end'
        title='鼠标悬停'
      />
    )
  }
}`,
    opt: ['右下']
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
        placement='top-end'
        title='鼠标悬停'
      />
    )
  }
}`,
    opt: ['右上']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoBase
