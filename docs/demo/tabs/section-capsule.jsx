import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-capsule'
const desc = '胶囊样式'

const code = `import Tabs from '@hi-ui/hiui/es/tabs'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      panes: [
        {
          tabTitle: '我的订单',
          tabId: 'tabId-1',
          tabDesc: '关于标签的描述信息'
        },
        {
          tabTitle: '团购订单',
          tabId: 'tabId-2',
          closable: false,
          tabDesc: '关于标签的描述信息'
        },
        {
          tabTitle: '以旧换新订单',
          tabId: 'tabId-3',
          tabDesc: '关于标签的描述信息'
        },
        {
          tabTitle: '消息通知',
          tabId: 'tabId-4',
          tabDesc: '关于标签的描述信息'
        }
      ]
    }
  }
  render () {
    return (
      <Tabs type="button" onTabClick={(tab,e)=>console.log(tab,e)}>
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabTitle={pane.tabTitle}
                tabId={pane.tabId}
                closable={pane.closable}
                key={index}
              >
                <div style={{padding: '16px'}}>{pane.tabTitle}</div>
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
