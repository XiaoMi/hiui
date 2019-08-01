import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
import Icon from '../../../components/icon'
import Message from '../../../components/message'
const prefix = 'dropdown-extend'
const desc = '传入 type 为 group，组件会将 title 执行对应的点击响应，点击箭头打开菜单项'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'
import Message from '@hi-ui/hiui/es/message'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        title: '同步',
        prefix: <Icon name='synchronize'/>,
        onClick: () => {
          Message.open({ type: 'success', title: '同步成功', duration: 2000 })
        }
      },{
        title: '转为草稿',
        prefix: <Icon name='document'/>,
        disabled: true,
        onClick: () => {
          Message.open({ type: 'danger', title: '尚未发布', duration: 2000 })
        }
      },{
        title: '修改权限',
        prefix: <Icon name='list'/>,
        onClick: () => {
          console.log('页面跳转')
        }
      },{
        title: '-'
      },{
        title: '删除',
        prefix: <Icon name='delete'/>,
        value: 'other',
        onClick: () => {
          Message.open({ type: 'success', title: '删除成功', duration: 2000 })
        }
      }]
    }
  }
  render() {
    return (
      <div>
        <Dropdown
          data={this.state.list}
          title="发布"
          onClick={() => {
            Message.open({ type: 'success', title: '发布成功', duration: 2000 })
          }}
          type="group"
        />
      </div>
    )
  }
}`
const DemoExtend = () => (
  <DocViewer code={code} scope={{ Dropdown, Icon, Message }} prefix={prefix} desc={desc} />
)
export default DemoExtend
