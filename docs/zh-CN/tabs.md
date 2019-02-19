## Tabs 切换


### 新增和删除标签
:::demo

```js
constructor(props) {
  super(props)
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
  this[`${action}Tab`](index, tabKey)
}

addTab() {
  const panes = this.state.panes

  this.setState({
    panes: panes.concat([{
      tabName: `新增标签${panes.length+1}`,
      tabKey: `tabKey-${panes.length+1}`
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

render() {
  return (
    <div>
      <Tabs activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)} editable onEdit={this.onEdit.bind(this)}>
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane 
                tabName={pane.tabName} 
                tabKey={pane.tabKey} 
                closable={pane.closable}
                key={index}
              >
                {pane.tabName} 
              </Tabs.Pane>
            )
          })
        }
      </Tabs>
    </div>
  )
}
```
:::