## Menu

### 水平排列

:::demo

水平排列

```js
  render(){
    return(
      <div>
        <Menu mode="horizontal" activeId="1" onClick={(id, prevId)=>console.log('-----click', id, prevId)}>
          <Menu.Item id="1">电视</Menu.Item>
          <Menu.Item id="2">小米MIX</Menu.Item>
          <Menu.SubMenu title="手机">
            <Menu.Item id="xiaomi">小米</Menu.Item>
            <Menu.Item id="hongmi">红米</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item id="4">超长超长超长字符</Menu.Item>
        </Menu>
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
| active | 是否激活 | boolean | true / false  | false |
| defaultActive | 默认激活（当  active 存在时，此项无效 | boolean | true / false | false |
| text | 文本 | string | - | - |
| value | 文本对应的值，可为空 | - | - |
| mode | 菜单排列模式 | string | horizontal / vertical | vertical |

### Menu Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onOpen | 打开某菜单事件 | - |
| onClose | 关闭某菜单事件 | - |
