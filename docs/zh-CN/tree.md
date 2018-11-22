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
              { id: 5, title: '前端', style: {color: '#4284f5'} }
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

```jsx
constructor(props) {
  super(props)
  this.treeData = [
    { id: 1, title: '小米',
      children: [
        { id: 2, title: '技术',
          children: [
            { id: 3, title: '后端' }, 
            { id: 4, title: '运维' },
            { id: 5, title: '前端' }
          ]
        },
        { id: 6, title: '产品' }
      ]
    },
    { id: 11, title: '小米',
      children: [
        { id: 22, title: '技术',
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

render() {
  return (
    <div style={{width:300}}>
      <Tree
        checkable
        data={this.treeData}
        defaultCheckedKeys={[2]}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={data => {console.log('Tree data:', data)}}
      />
    </div>
  )
}
```
:::


### Tree Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------- | ------- | ------- | ------- |
| data | 展示数据 | array | - | - |
| checkable | 节点前添加 Checkbox 复选框 | boolean | false | - |
| options | 配置选项 | object | - | - |
| defaultExpandAll | 是否默认展开所有树节点 | boolean |  | false |
| defaultCheckedKeys | 默认选中的checkbox | arry | - | - |
| disabledCheckedKeys | 默认禁选节点id数组 | arry | - | - |
| openIcon | 表示展开的图标 | string | Icon 组件中的图标 | - |
| closeIcon | 表示闭合的图标 | string | Icon 组件中的图标 | - |
| style | 组件整体样式 | object | - | - |

### Tree Attributes-data

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------- | ------- | ------- | ------- |
| expand | 默认是否展开子菜单（优先级高于defaultExpandAll） | blooean | true, false | false |
| onClick | 点击每项时触发的事件 | Func() | - | - |
| onNodeClick | 点击每项时触发，onClick作用具体绑定的项，onNodeClick作用于所以项 | Func() | - | - |
| style | 单个节点样式 | object | - | - |

### Tree Attributes-options

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------| ------- | ------- | ------- | ------- |
| title | 指定节点标签为节点对象的某个属性值 | string | - | title |
| children | 指定子树为节点对象的某个属性值 | string | - | children |

### Tree Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 改变复选框状态时触发 | (data: Object) |
| onNodeToggle | 节点被点击(展开/收起)时触发 | (data: Obejct, isExpanded: boolean) |


