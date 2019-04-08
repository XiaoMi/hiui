## Dropdown

### Basic
:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'TV'
    },{
      title: 'Phone'
    },{
      title: 'Other'
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown list={this.state.list} title="Electronic product" onClick={(val) => console.log(val)}></Dropdown>
    </div>
  )
}
```
:::

### Trigger mode <br/>
<br/>
:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'Mi Phone',
      onClick: () => {
        console.log('one')
      }
    },{
      title: 'Mi TV',
      prefix: <Icon name='list'/>,
      disabled: true
    },{
      title: 'Mi Ecological',
      prefix: <Icon name='list'/>,
      suffix: <Icon name='truck'/>
    },{
      title: '-'
    },{
      title: 'Other',
      value: 'other'
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown
        list={this.state.list}
        trigger={['click', 'contextmenu']}
        onClick={(val) => {console.log(val)}}
        title="Left click or right click"
        width={160}
      >
      </Dropdown>
    </div>
  )
}
```
:::

### Button Menu

:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'one'
    },{
      title: 'two',
      prefix: <Icon name='add'/>
    },{
      title: 'three',
      suffix: <Icon name='truck'/>
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown 
        list={this.state.list}
        title="Button Menu"
        type="button"
        // trigger={['click']}
        onClick={(val) => console.log(val)}
        prefix={<Icon name='list'/>}
      />
    </div>
  )
}
```
:::

### Extended menu

:::demo
Pass the type to group, the component will perform the corresponding click response for the title, click the arrow to open the menu item.
```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'one'
    },{
      title: 'two',
      prefix: <Icon name='add'/> // 此 prefix 将会被替换为外部的 prefix
    },{
      title: 'three',
      suffix: <Icon name='truck'/>
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown 
        list={this.state.list}
        title="Button Menu"
        type="group"
        // trigger={['click']}
        onClick={(val) => console.log(val)}
        prefix={<Icon name='list'/>}
      />
    </div>
  )
}
```
:::

### Dropdown

#### Attributes

| Attribute | Description | Type | Options |Default |
| --------   | -----  | ----  |    ----  |   ----  |
| list |  datas  |  array   | - | - |
| title |   text content<br/>"-" represents the separator  |   string/Component   | - | - |
| type |   dropdown type  |   string   | button/group | text |
| onClick |   callback  |   func   | - | - |
| prefix |   prefix icon  |   string/Component   | - | - |
| suffix |   suffix icon  |  string/Component   | - | - |
| trigger |    trigger mode  |   string/array   | click/contextmenu | click |

