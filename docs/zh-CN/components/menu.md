## Menu

### 水平排列

:::demo

水平排列

```js
  constructor () {
    super()
    this.state = {
      list: [{
        title: '菜单一'
      }, {
        title: '菜单二',
      }, {
        title: '菜单三'
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

### 竖直排列

:::demo

竖直排列

```js
  constructor () {
    super()
    this.state = {
      list: [{
        title: '菜单一'
      }, {
        title: '菜单二'
      }, {
        title: '菜单三'
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

### Menu Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| active | 是否激活 | Boolean | true \| false  | false |
| defaultActive | 默认激活（当  active 存在时，此项无效 | Boolean | true \| false | false |
| text | 文本 | String | - | - |
| value | 文本对应的值，可为空 | String | - |
| mode | 菜单排列模式 | String | horizontal \| vertical | vertical |

### Menu Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onOpen | 打开某菜单事件 | - |
| onClose | 关闭某菜单事件 | - |
