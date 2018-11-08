## Menu

### Horizontal

:::demo

Horizontal

```js
  constructor () {
    super()
    this.state = {
      list: [{
        title: 'Menu one'
      }, {
        title: 'Menu two',
      }, {
        title: 'Menu three'
      }]
    }
  }
  render(){
    return(
      <div>
        <Menu list={this.state.list} mode="horizontal"/>
      </div>
    )
  }

```
:::

### Vertical

:::demo

Vertical

```js
  constructor () {
    super()
    this.state = {
      list: [{
        title: 'Menu one'
      }, {
        title: 'Menu two',
      }, {
        title: 'Menu three'
      }]
    }
  }
  render(){
    return(
      <div style={{width: 250}}>
        <Menu list={this.state.list} mode="vertical"/>
      </div>
    )
  }

```
:::


<!-- - 水平菜单
  - 折叠
    - 子级菜单
    - 分组菜单
  - 不折叠
    - 展开溢出

- 垂直菜单
  - 分组
  - 嵌套子菜单
  - 弹出子菜单
  - 子菜单对齐 -->

### Attributes

| Attribute | Description | Type | Options | Default |
| -------- | ----- | ---- | ---- | ---- |
| active | is active | boolean | true / false  | false |
| defaultActive | default active（This item is invalid when active is present | boolean | true / false | false |
| text | text | string | - | - |
| value | value | - | - |
| mode | 
6/5000
Càidān páiliè móshì
Menu arrangement mode | string | horizontal / vertical | vertical |

### Events

| Attribute | Description | Callback Params |
| -------- | ----- | ---- |
| onOpen | 打开某菜单事件 | - |
| onClose | 关闭某菜单事件 | - |
