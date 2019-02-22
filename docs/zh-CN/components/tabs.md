## Tabs 标签


### 卡片式标签
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
        tabName: <span><Icon name="chat-group" />消息通知</span>,
        tabKey: 'tabKey-4'
      },
      {
        tabName: '购买资格',
        tabKey: 'tabKey-5'
      },
      {
        tabName: '团购通知',
        tabKey: 'tabKey-6'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-7'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-8'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-9'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-10'
      }
    ]
  }
}

render() {
  return (
    <div>
      <Tabs activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)}>
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
    </div>
  )
}
```
:::


### 新增和关闭标签
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
    </div>
  )
}
```
:::


### 竖直标签
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

render() {
  return (
    <div>
      <Tabs placement="left" activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)}>
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
    </div>
  )
}
```
:::


### 带描述信息的标签
:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    panes: [
      {
        tabName: '我的订单',
        tabKey: 'tabKey-1',
        tabDesc: '关于标签的描述信息'
      },
      {
        tabName: '团购订单',
        tabKey: 'tabKey-2',
        closable: false,
        tabDesc: '关于标签的描述信息'
      },
      {
        tabName: '以旧换新订单',
        tabKey: 'tabKey-3',
        tabDesc: '关于标签的描述信息'
      },
      {
        tabName: '消息通知',
        tabKey: 'tabKey-4',
        tabDesc: '关于标签的描述信息'
      }
    ]
  }
}

render() {
  return (
    <div>
      <Tabs type="desc" activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)}>
        {
          this.state.panes.map((pane, index) => {
            return (
              <Tabs.Pane 
                tabName={pane.tabName} 
                tabDesc={pane.tabDesc} 
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
    </div>
  )
}
```
:::




### 按钮式标签
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

render() {
  return (
    <div>
      <Tabs type="button" activeTabKey="1" onTabClick={(tab,e)=>console.log(tab,e)}>
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
    </div>
  )
}
```
:::



### Tabs Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 标签类型 | string | desc, card, button, editable | card |
| placement | 卡片式标签位置 | string | top, left | top |
| defaultActiveKey | 默认激活的标签 | string, number | - | 第一个选项卡 |
| showTabsNum | 显示的选项卡数，仅对type='card'并且placement='top'时生效| number | - | 6 |
| editable | 是否可以对标签增加删除，仅对type='editable'时生效 | bool | true, false | true |
| onTabClick | 点击标签页时触发 | func(tabKey, event) | - | - |
| onEdit | 标签新增删减时触发，仅对type='editable'时触发。参数：action为事件类型，值为add或者delete；index为操作选项卡对应的索引 | func(action, index, tabKey) | - | - |



### Tabs.Pane Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| tabName | 选项卡头显示文字 | string, node | - | - |
| tabDesc | 选项卡头描述文字，仅对type='desc'时生效 | string, node | - | - |
| tabKey | 每个标签的唯一标识 | string, number | - | - |
| closable | 标签是否可以关闭，仅对type='editable'时生效 | bool | true, false | true |
