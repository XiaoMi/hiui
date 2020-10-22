import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-overSrcoll'
const desc = '标签数量增多展示滚动条'

const code = `import Tabs from '@hi-ui/hiui/es/tabs'
import Grid from '@hi-ui/hiui/es/grid'
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
          closeable: false,
          disabled:true
        },
        {
          tabTitle: '以旧换新订单',
          tabId: 'tabId-3'
        },
        {
          tabTitle: '消息通知',
          tabId: 'tabId-4'
        },
        {
          tabTitle: '新建标签5',
          tabId: 'tabId-5'
        },
        {
          tabTitle: '新建标签6',
          tabId: 'tabId-6',
        },
        {
          tabTitle: '新建标签7',
          tabId: 'tabId-7',
        },
        {
          tabTitle: '新建标签8',
          tabId: 'tabId-8',
        },
        {
          tabTitle: '新建标签9',
          tabId: 'tabId-9',
        },
        {
          tabTitle: '新建标签10',
          tabId: 'tabId-10',
        },
        {
          tabTitle: '新建标签11',
          tabId: 'tabId-11',
        },
        {
          tabTitle: '新建标签12',
          tabId: 'tabId-12',
        },
        {
          tabTitle: '新建标签13',
          tabId: 'tabId-13',
        },
        {
          tabTitle: '新建标签14',
          tabId: 'tabId-14',
        },
        {
          tabTitle: '新建标签15',
          tabId: 'tabId-15',
        },
        {
          tabTitle: '新建标签16',
          tabId: 'tabId-16',
        },
        {
          tabTitle: '新建标签17',
          tabId: 'tabId-17',
        },
        {
          tabTitle: '新建标签18',
          tabId: 'tabId-18',
        },
        {
          tabTitle: '新建标签19',
          tabId: 'tabId-19',
        },
        {
          tabTitle: '新建标签20',
          tabId: 'tabId-20',
        },
        {
          tabTitle: '新建标签21',
          tabId: 'tabId-21',
        },
        {
          tabTitle: '新建标签22',
          tabId: 'tabId-22',
        }
      ]
    }
  }

  render () {
    return (
      <Tabs 
        type="line"
        canScroll={true} 
        onTabClick={(tab,e)=>console.log(tab)} 
      >
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabTitle={pane.tabTitle}
                tabId={pane.tabId}
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
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tabs }} desc={desc} prefix={prefix} />
)
export default Demo
