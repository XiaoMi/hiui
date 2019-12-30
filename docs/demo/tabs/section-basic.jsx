import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-basic'
const desc = '常应用于页面、弹窗等区域，水平方向适用标签数量较少的情况'

const code = `import Tabs from '@hi-ui/hiui/es/tabs'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      panes: [{
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
      },{
        tabTitle: '购买资格',
        tabId: 'tabId-5'
      },]
    }
  }
  render () {
    return (
      <Tabs defaultActiveId='tabId-2' onTabClick={(tab,e) => console.log(tab,e)}>
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabTitle={pane.tabTitle}
                tabId={pane.tabId}
                closeable={pane.closeable}
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
