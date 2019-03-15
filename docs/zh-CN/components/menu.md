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
            <Menu.SubMenu title="小米">
              <Menu.Item id="xiaomi9">小米9</Menu.Item>
              <Menu.Item id="xiaomi8">小米8</Menu.Item>
              <Menu.Item id="xiaomi7">小米7</Menu.Item>
              <Menu.Item id="xiaomi6">小米6</Menu.Item>
              <Menu.Item id="xiaomi5">小米5</Menu.Item>
              <Menu.Item id="xiaomi4">小米4</Menu.Item>
              <Menu.Item id="xiaomi3">小米3</Menu.Item>
              <Menu.Item id="xiaomi2">小米2</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item id="hongmi">红米</Menu.Item>
            <Menu.SubMenu title="小米note">
              <Menu.Item id="xiaomi note7">小米 note7</Menu.Item>
              <Menu.Item id="xiaomi note6">小米 note6</Menu.Item>
              <Menu.Item id="xiaomi note5">小米 note5</Menu.Item>
              <Menu.Item id="xiaomi note4">小米 note4</Menu.Item>
              <Menu.Item id="xiaomi note3">小米 note3</Menu.Item>
              <Menu.Item id="xiaomi note2">小米 note2</Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
          <Menu.Item id="4">超长超长超长字符</Menu.Item>
        </Menu>
      </div>
    )
  }

```
:::


### 分组菜单

:::demo

分组菜单

```js
  render(){
    return(
      <div>
        <Menu mode="horizontal" activeId="1" onClick={(id, prevId)=>console.log('-----click', id, prevId)}>
          <Menu.Item id="1"><Icon name="pc"/>电视</Menu.Item>
          <Menu.Item id="2">小米MIX</Menu.Item>
          <Menu.SubMenu title={<span><Icon name="phone"/>手机</span>}>
            <Menu.ItemGroup title={<span><Icon name="phone"/>小米</span>}>
              <Menu.Item id="xiaomi9">小米9</Menu.Item>
              <Menu.Item id="xiaomi8">小米8</Menu.Item>
              <Menu.Item id="xiaomi7">小米7</Menu.Item>
              <Menu.Item id="xiaomi6">小米6</Menu.Item>
              <Menu.Item id="xiaomi5">小米5</Menu.Item>
              <Menu.Item id="xiaomi4">小米4</Menu.Item>
              <Menu.Item id="xiaomi3">小米3</Menu.Item>
              <Menu.Item id="xiaomi2">小米2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="红米">
              <Menu.Item id="hongmi1">红米1</Menu.Item>
              <Menu.Item id="hongmi2">红米2</Menu.Item>
              <Menu.Item id="hongmi3">红米3</Menu.Item>
              <Menu.Item id="hongmi4">红米4</Menu.Item>
              <Menu.Item id="hongmi5">红米5</Menu.Item>
              <Menu.Item id="hongmi6">
                <Tooltip title="红米6红米6红米6红米6红米6">红米6红米6红米6红米6红米6</Tooltip>
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="小米note">
              <Menu.Item id="xiaomi note7">小米 note7</Menu.Item>
              <Menu.Item id="xiaomi note6">小米 note6</Menu.Item>
              <Menu.Item id="xiaomi note5">小米 note5</Menu.Item>
              <Menu.Item id="xiaomi note4">小米 note4</Menu.Item>
              <Menu.Item id="xiaomi note3">小米 note3</Menu.Item>
              <Menu.Item id="xiaomi note2">小米 note2</Menu.Item>
            </Menu.ItemGroup>
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
