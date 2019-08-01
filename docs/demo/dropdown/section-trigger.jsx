import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Dropdown from '../../../components/dropdown'
import Icon from '../../../components/icon'
import Message from '../../../components/message'
const prefix = 'dropdown-trigger'
const desc = '使用左键或右键单击'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Dropdown from '@hi-ui/hiui/es/dropdown'
import Message from '../../../components/message'\n
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
          trigger={['click', 'contextmenu']}
          title="操作"
          width={100}
        >
        </Dropdown>
      </div>
    )
  }
}`
const DemoTrigger = () => (
  <DocViewer
    code={code}
    scope={{ Dropdown, Icon, Message }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoTrigger
