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
        }
      ]
    }
  }
 
  addTab() {
    const panes = this.state.panes;
   
    this.setState({
      panes: panes.concat([{
        tabTitle: \`新增标签\${panes.length + 1}\`,
      tabId: \`tabId-\${panes.length + 1}\`
      }])
    })
  }

  deleteTab(item,index) {
    const panes = this.state.panes.slice()
    panes.splice(index, 1)

    this.setState({
      panes
    })
  }

  beforeDelete(item){
    console.log(item)
    return true
  }

  render () {
    return  <Tabs type="editable" onTabClick={(tab,e)=>console.log(tab,e)} editable onDelete={this.deleteTab.bind(this)} onAdd={this.addTab.bind(this)} onBeforeDelete={this.beforeDelete.bind(this)} canScroll={true}>
      {
        this.state.panes.map((pane, index) => {
          return (
            <Tabs.Pane
              tabTitle={pane.tabTitle}
              tabId={pane.tabId}
              closeable
              key={index}
              disabled={pane.disabled}
            >
              <div style={{padding: '16px'}}>{pane.tabTitle}</div>
            </Tabs.Pane>
          )
        })
      }
    </Tabs>
  }
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tabs }} desc={desc} prefix={prefix} />
)
export default Demo
