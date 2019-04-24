## Dropdown

### 基础用法
:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: '电视'
    },{
      title: '手机'
    },{
      title: '电脑'
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown list={this.state.list} title="电子产品" onClick={(val) => console.log(val)}></Dropdown>
    </div>
  )
}
```
:::

### 触发方式

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

### 按钮菜单

:::demo
自定义前缀、后缀
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

### 拓展菜单

:::demo
传入 type 为 group，组件会将 title 执行对应的点击响应，点击箭头打开菜单项
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

#### Dropdown Attributes

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| list |  数据  |  Array   | 参见 List Options | - |
| title |   显示的文字内容<br/>传入"-"时代表分隔符  |   String \| Component   | - | - |
| type |   下拉按钮类型  |   String   | text \| button \| group | text |
| onClick |   点击回调函数  |   Function   | - | - |
| prefix |   前缀图标  |   String \| Component   | - | - |
| suffix |   后缀图标  |  String \| Component   | - | - |
| trigger |    触发方式  |   String \| array   | click \| contextmenu | click |

#### List Options
| 参数     | 说明   |  类型  | 可选值 | 默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| title |   显示文案  |   Element \| String   | 必需 | - |
| prefix |   文案前缀，选项中包含此值时将替换外部的 prefix  |   Element \| String   | - | - |
| suffix |   文案后缀，选项中包含此值时将替换外部的 suffix |   Element \| String   | - | - |
| disabled |    是否禁用  |   Boolean   | - | false |
| value |   点击后回调的值   |   String | Number   | - | - |
