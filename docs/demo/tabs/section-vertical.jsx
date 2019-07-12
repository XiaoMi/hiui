import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-vertical'
const desc = '建议标签数量在 10 个以上时使用'

const code = `import Tabs from '@hi-ui/hiui/es/tabs'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      panes: [
        {
          tabName: '我的订单',
          tabKey: 'tabKey-1'
        },
        {
          tabName: '团购订单',
          tabKey: 'tabKey-2',
          closable: false
        },
        {
          tabName: '以旧换新订单',
          tabKey: 'tabKey-3'
        },
        {
          tabName: <span>消息通知</span>,
          tabKey: 'tabKey-4'
        },
        {
          tabName: '购买资格',
          tabKey: 'tabKey-5'
        },
        {
          tabName: '团购通知',
          tabKey: 'tabKey-6'
        },
        {
          tabName: '订单详情',
          tabKey: 'tabKey-7'
        },
        {
          tabName: '订单详情',
          tabKey: 'tabKey-8'
        },
        {
          tabName: '订单详情',
          tabKey: 'tabKey-9'
        },
        {
          tabName: '订单详情',
          tabKey: 'tabKey-10'
        }
      ]
    }
  }
  render () {
    return (
      <Tabs placement="left" activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)}>
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabName={pane.tabName}
                tabKey={pane.tabKey}
                closable={pane.closable}
                key={index}
              >
                <div style={{padding: '16px'}}>{pane.tabName}</div>
              </Tabs.Pane>
            )
          })
        }
      </Tabs>
    )
  }
}`

const Demo = () => <DocViewer code={code} scope={{ Tabs }} desc={desc} prefix={prefix} />
export default Demo
