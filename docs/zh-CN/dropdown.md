## Dropdown

### Demo
普通
:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'one'
    },{
      title: 'two'
    },{
      title: 'three'
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown list={this.state.list} title="下拉菜单" onClick={(val) => console.log(val)}></Dropdown>
    </div>
  )
}
```
:::

点击、右键点击触发 <br/>
<br/>
:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: '小米手机',
      onClick: () => {
        console.log('one')
      }
    },{
      title: '小米电视',
      prefix: <Icon name='list'/>,
      disabled: true
    },{
      title: '小米生态链相关产品',
      prefix: <Icon name='list'/>,
      suffix: <Icon name='truck'/>
    },{
      title: '-'
    },{
      title: '其它',
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
        title="左键或右键点击"
        width={160}
      >
      </Dropdown>
    </div>
  )
}
```
:::

按钮菜单<br/>
统一的 prefix 或 suffix
:::demo

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
        title="按钮菜单"
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

拓展菜单<br/>
传入 type 为 group，组件会将 title 执行对应的点击响应，点击箭头打开菜单项
:::demo

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
        title="按钮菜单"
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

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| list |  数据项  |  array   | - | - |
| title |   显示的文字内容<br/>传入"-"时代表分隔符  |   string/Component   | - | - |
| type |   下拉按钮类型  |   string   | button/group | text |
| onClick |   点击回调函数  |   func   | - | - |
| prefix |   前缀图标  |   string/Component   | - | - |
| suffix |   后缀图标  |  string/Component   | - | - |
| trigger |    触发方式  |   string/array   | click/contextmenu | click |

