import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-editable'
const desc = '可以自定义标签的增加和关闭'

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
          disabled:true
        },
        {
          tabTitle: '以旧换新订单',
          tabId: 'tabId-3',
          closeable: false,
        },
        {
          tabTitle: '消息通知',
          tabId: 'tabId-4'
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
  
    return  <Tabs type="editable" onTabClick={(tab,e)=>console.log(tab,e)} editable onDelete={this.deleteTab.bind(this)} onAdd={this.addTab.bind(this)} onBeforeDelete={this.beforeDelete.bind(this)}>
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
   
  }
}`

const Demo = () => (
  <DocViewer code={code} scope={{ Tabs }} desc={desc} prefix={prefix} />
)
export default Demo
