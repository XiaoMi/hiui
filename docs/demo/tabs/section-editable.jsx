import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-editable'
const desc = '需要新增、删除标签时使用'

const code = `import Tabs from '@hiui/hiui/es/tabs'
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
          closable: false
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
  onEdit(action, index, tabId) {
    console.log('----------onEdit', action, index, tabId)
    this[\`\${action}Tab\`](index, tabId)
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

  deleteTab(index, tabId) {
    const panes = this.state.panes.slice()
    panes.splice(index, 1)

    this.setState({
      panes
    })
  }

  render () {
    return (
      <Tabs type="editable" onTabClick={(tab,e)=>console.log(tab,e)} editable onEdit={this.onEdit.bind(this)}>
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
