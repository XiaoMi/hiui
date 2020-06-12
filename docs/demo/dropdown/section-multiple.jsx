import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
const prefix = 'dropdown-multiple'
const desc = '菜单项不属于同一级别，可分层级展开使用'

const code = `import React from 'react'
import Dropdown from '@hi-ui/hiui/es/dropdown'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '移动至',
        children: [{
          title: '2019',
          children: [{
            title: 'Q1',
            children: [{
              title: '01'
            }, {
              title: '02'
            }, {
              title: '03'
            }]
          }, {
            title: 'Q2',
            disabled: true
          }, {
            title: 'Q3'
          }]
        }]
      }, {
        title: '复制至',
        children: [{
          title: '2019',
          children: [{
            title: 'Q1',
            disabled: true,
            children: [{
              title: '01'
            }, {
              title: '02'
            }, {
              title: '03'
            }]
          }, {
            title: 'Q2'
          }, {
            title: 'Q3'
          }]
        }]
      }, {
        title: '删除'
      }]
    }
  }
  render() {
    const { list } = this.state
    return (
      <Dropdown
        data={list}
        title='操作'
        width={120}
      />
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
