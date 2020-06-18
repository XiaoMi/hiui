import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-editable'
const desc = '实现 Tabs 拖拽功能'

const code = `import Tabs from '@hi-ui/hiui/es/tabs'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      panes: [
        {
          tabTitle: '我的订单',
          tabId: 'tabId-1'
        },
        {
          tabTitle: '团购订单',
          tabId: 'tabId-2',
          closeable: false
        },
        {
          tabTitle: '以旧换新订单',
          tabId: 'tabId-3'
        },
        {
          tabTitle: '消息通知',
          tabId: 'tabId-4'
        }
      ]
    }
  }
 

  render () {
    return (
      <Tabs type="editable" draggable={true}>
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabTitle={pane.tabTitle}
                tabId={pane.tabId}
                closeable
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

const Demo = () => (
  <DocViewer code={code} scope={{ Tabs }} desc={desc} prefix={prefix} />
)
export default Demo
