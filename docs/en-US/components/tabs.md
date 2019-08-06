## Tabs


### Card Tabs
:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    panes: [
      {
        tabName: 'Tab - 1',
        tabKey: 'tabKey-1'
      },
      {
        tabName: 'Tab - 2',
        tabKey: 'tabKey-2',
        closeable: false
      },
      {
        tabName: 'Tab - 3',
        tabKey: 'tabKey-3'
      },
      {
        tabName: <span><Icon name="chat-group" />Tab</span>,
        tabKey: 'tabKey-4'
      },
      {
        tabName: 'Tab - 4',
        tabKey: 'tabKey-5'
      },
      {
        tabName: 'Tab - 5',
        tabKey: 'tabKey-6'
      },
      {
        tabName: 'Tab - 6',
        tabKey: 'tabKey-7'
      },
      {
        tabName: 'Tab - 7',
        tabKey: 'tabKey-8'
      },
      {
        tabName: 'Tab - 8',
        tabKey: 'tabKey-9'
      },
      {
        tabName: 'Tab - 9',
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
                closeable={pane.closeable}
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


### Add & Close
:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    panes: [
      {
        tabName: 'Tab - 1',
        tabKey: 'tabKey-1'
      },
      {
        tabName: 'Tab - 2',
        tabKey: 'tabKey-2',
        closeable: false
      },
      {
        tabName: 'Tab - 3',
        tabKey: 'tabKey-3'
      },
      {
        tabName: 'Tab - 4',
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
      tabName: `New Tab - ${panes.length+1}`,
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
                closeable={pane.closeable}
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


### Vertical
:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    panes: [
      {
        tabName: 'Tab - 1',
        tabKey: 'tabKey-1'
      },
      {
        tabName: 'Tab - 2',
        tabKey: 'tabKey-2',
        closeable: false
      },
      {
        tabName: 'Tab - 3',
        tabKey: 'tabKey-3'
      },
      {
        tabName: 'Tab - 4',
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
                closeable={pane.closeable}
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


### Description
:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    panes: [
      {
        tabName: 'Tab - 1',
        tabKey: 'tabKey-1',
        tabDesc: 'Description'
      },
      {
        tabName: 'Tab - 2',
        tabKey: 'tabKey-2',
        closeable: false,
        tabDesc: 'Description'
      },
      {
        tabName: 'Tab - 3',
        tabKey: 'tabKey-3',
        tabDesc: 'Description'
      },
      {
        tabName: 'Tab - 4',
        tabKey: 'tabKey-4',
        tabDesc: 'Description'
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
                closeable={pane.closeable}
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




### Button Tab
:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    panes: [
      {
        tabName: 'Tab - 1',
        tabKey: 'tabKey-1'
      },
      {
        tabName: 'Tab - 2',
        tabKey: 'tabKey-2',
        closeable: false
      },
      {
        tabName: 'Tab - 3',
        tabKey: 'tabKey-3'
      },
      {
        tabName: 'Tab - 4',
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
                closeable={pane.closeable}
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

| Attribute | Description | Type | Options |Default |
| -------- | ----- | ---- | ---- | ---- |
| type | Type | String | desc \| card \| button \| editable | card |
| placement | Label location | String | top \| left | top |
| defaultActiveKey | Default activated tag | String \| number | - | First tab |
| showTabsNum | Number of tabs displayed | number | - | 6 |
| editable | Whether it can be added or deleted，Only valid for type='editable' | Boolean | true \| false | true |
| onTabClick | Triggered when clicking on a tab | func(tabKey , event) | - | - |
| onEdit | Triggered when the tag is newly added，Only valid for type='editable' | func(action, index, tabKey) | - | - |



### Tabs.Pane Attributes

| Attribute | Description | Type | Options |Default |
| -------- | ----- | ---- | ---- | ---- |
| tabName | tabname | String \| Element | - | - |
| tabDesc | description | String \| Element | - | - |
| tabKey | key | String \| Number | - | - |
| closeable | Whether the tag can be closed, only valid for type='editable' | Boolean | true \| false | true |
