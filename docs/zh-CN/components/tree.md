## Tree控件

树形菜单


### 普通用法

普通用法

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    treeData: [
      { id: 1, title: '小米',
        children: [
          { id: 2, title: '技术',
            children: [
              { id: 3, title: '后端', onClick: data => {console.log('后端：', data)} }, 
              { id: 4, title: '运维' },
              { id: 5, title: '前端' }
            ]
          },
          { id: 6, title: '产品' }
        ]
      },
      { id: 11, title: '小米',
        children: [
          { id: 22, title: <a>技术</a>,
            children: [
              { id: 33, title: '后端' }, 
              { id: 44, title: '运维' },
              { id: 55, title: '前端' }
            ]
          },
          { id: 66, title: '产品' }
        ]
      },
    ]
  }

}
clickEvent () {
  const data = this.state.treeData
  data.push({
    id: 2,
    title: '其它'
  })
  this.setState({
    treeData: data
  })
}
render() {
  return (
    <div style={{width:300}}>
      <Tree
        defaultExpandAll
        data={this.state.treeData}
        defaultCheckedKeys={[2]}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={data => {console.log('Tree data:', data)}}
        openIcon='down'
        closeIcon='up'
        highlightable
        onNodeClick={(item) => console.log('------click node', item)}
      />
      <Button onClick={this.clickEvent.bind(this)}>点击</Button>
    </div>
  )
}
```
:::


### checkbox

:::demo

checkbox

```js
constructor(props) {
  super(props)
  this.treeData = [
    { id: 1, title: '小米',
      children: [
        { id: 2, title: '技术',
          children: [
            { id: 3, title: '后端',disabled:true }, 
            { id: 4, title: '运维' },
            { id: 5, title: '前端' }
          ]
        },
        { id: 6, title: '产品' }
      ]
    },
    { id: 11, title: '小米2',
      children: [
        { id: 22, title: '技术2', expand: true,
          children: [
            { id: 33, title: '后端2' }, 
            { id: 44, title: '运维2' },
            { id: 55, title: '前端2' }
          ]
        },
        { id: 66, title: '产品2' }
      ]
    },
  ]
  this.state = {
    checkedKeys: [5]
  }
}

render() {
  return (
    <div style={{width:300}}>
      <Tree
        checkable
        data={this.treeData}
        checkedKeys={this.state.checkedKeys}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={(checkedKeys, title, bool, semi) => {
          console.log('Tree data:', checkedKeys, title, bool ,semi)
          this.setState({
            checkedKeys
          })
        }}
        highlightable
        onClick={data=>{console.log('tree node click',data)}}
        withLine
      />
    </div>
  )
}
```
:::


### Tree Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------- | ------- | ------- | ------- |
| data | 展示数据 | Array | 参见 Tree Attributes-data | - |
| checkable | 节点前添加 Checkbox 复选框 | Boolean | false | - |
| options | 配置选项 | Object | 参见 Tree Attributes-options | - |
| defaultExpandAll | 是否默认展开所有树节点 | Boolean | - | false |
| checkedKeys | 默认选中的checkbox | Array | - | - |
| openIcon | 表示展开的图标 | String | Icon 图标名称 | - |
| closeIcon | 表示闭合的图标 | String | Icon 图标名称 | - |
| style | 组件整体样式 | Object | - | - |
| highlightable | 高亮 | Boolean
| withLine | 是否显示连接线 | Boolean | - | false |

### Tree Attributes-data

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------- | ------- | ------- | ------- |
| expand | 默认是否展开子菜单（优先级高于defaultExpandAll） | Blooean | - | false |
| onClick | 点击每项时触发的事件 | Function | - | - |
| onNodeClick | 点击每项时触发，onClick作用具体绑定的项，onNodeClick作用于所以项 | Function | - | - |
| style | 单个节点样式 | Object | - | - |

### Tree Attributes-options

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------| ------- | ------- | ------- | ------- |
| title | 指定节点标签为节点对象的某个属性值 | String | - | title |
| children | 指定子树为节点对象的某个属性值 | String | - | children |

### Tree Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 改变复选框状态时触发 | checkedArr, title, isChecked  |
| onNodeToggle | 节点被点击(展开/收起)时触发 | (data: Obejct, isExpanded: Boolean) |
| onCheckChange | 节点选中项 | checkedArr, title, isChecked |


