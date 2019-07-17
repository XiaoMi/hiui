import Tabs from '../../../components/tabs'
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
const prefix = 'tabs-editable'
const desc = '需要新增、删除标签时使用'

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
          tabName: '消息通知',
          tabKey: 'tabKey-4'
        }
      ]
    }
  }
  onEdit(action, index, tabKey) {
    console.log('----------onEdit', action, index, tabKey)
    this[\`\${action}Tab\`](index, tabKey)
  }
  addTab() {
    const panes = this.state.panes;
    this.setState({
      panes: panes.concat([{
        tabName: \`新增标签\${panes.length + 1}\`,
      tabKey: \`tabKey-\${panes.length + 1}\`
      }])
    })
  }

  deleteTab(index, tabKey) {
    const panes = this.state.panes.slice()
    panes.splice(index, 1)

    this.setState({
      panes
    })
  }

  render () {
    return (
      <Tabs type="editable" activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)} editable onEdit={this.onEdit.bind(this)}>
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
