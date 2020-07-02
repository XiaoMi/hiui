import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'

const prefix = 'tabs-default'
const desc = '基础标签页'
const rightOptions = ['水平方向', '垂直方向']

const code = [
  {
    code: `import Tabs from '@hi-ui/hiui/es/tabs'
import React from 'react'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      panes:  [{
        tabTitle: '我的订单',
        tabId: 'tabId-1',
        disabled:true
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
        tabTitle: <span>消息通知</span>,
        tabId: 'tabId-4'
      },
      {
        tabTitle: '购买资格',
        tabId: 'tabId-5'
      },
      {
        tabTitle: '团购通知',
        tabId: 'tabId-6'
      },
      {
        tabTitle: '订单详情',
        tabId: 'tabId-7'
      },
      {
        tabTitle: '订单详情',
        tabId: 'tabId-8'
      },
      {
        tabTitle: '订单详情',
        tabId: 'tabId-9'
      },
      {
        tabTitle: '订单详情',
        tabId: 'tabId-10'
      }]
    }
  }
  render () {
    return (
      <Tabs defaultActiveId='tabId-2' onTabClick={(tab,e) => console.log(tab,e)} type="line">
      {
        this.state.panes.map((pane, index) => {
          return (
            <Tabs.Pane
              tabTitle={pane.tabTitle}
              tabId={pane.tabId}
              closeable={pane.closeable}
              key={index}
              disabled={pane.disabled}
            >
              <div style={{padding: '16px'}}>{pane.tabTitle}</div>
            </Tabs.Pane>
          )
        })
      }
  </Tabs>
    )
  }
}`,
    opt: ['水平方向']
  },
  {
    code: `import Tabs from '@hi-ui/hiui/es/tabs'
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
      <Tabs defaultActiveId='tabId-2' onTabClick={(tab,e) => console.log(tab,e)} placement='vertical' type="line">
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
}`,
    opt: ['垂直方向']
  }
]

const Demo = () => (
  <DocViewer
    code={code}
    scope={{ Tabs }}
    desc={desc}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default Demo
