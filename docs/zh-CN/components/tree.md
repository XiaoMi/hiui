## Tree 控件

树形菜单

### 普通用法

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

}

render() {
  return (
    <div style={{width:500}}>
      <Tree
        defaultExpandAll
        editable={true}
        data={this.state.treeData}
        defaultCheckedKeys={[2]}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={data => {console.log('Tree data:', data)}}
        openIcon='down'
        closeIcon='up'
        highlightable
        onNodeClick={(item) => console.log('------click node', item)}
      />
    </div>
  )
}
```

:::

### 异步加载

点击展开异步加载树的子节点

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
          { id: 22, title: '技术'
          },
          { id: 66, title: '产品' }
        ]
      },
    ]
  }

}

render() {
  return (
    <div style={{width:500}}>
      <Tree
        origin={{
          method:'get',
          headers:{},
          data:{},
          params:{},
          url:'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
          func:(res)=>{return res.data}
        }}
        defaultExpandAll
        editable={true}
        data={this.state.treeData}
        defaultCheckedKeys={[2]}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={data => {console.log('Tree data:', data)}}
        openIcon='down'
        closeIcon='up'
        highlightable
        onNodeClick={(item) => console.log('------click node', item)}
      />
    </div>
  )
}
```

:::

### 多选

:::demo

checkbox

```js
constructor(props) {
  super(props)
  this.treeData = [
    { id: 1, title: '小米人',
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
        editable={true}
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

### 可搜索

通过搜索框对树进行过滤

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    treeData: [
      { id: 1, title: '小米快递',
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

}

render() {
  return (
    <div style={{width:500}}>
      <Tree
        defaultExpandAll
        searchable={true}
        data={this.state.treeData}
        defaultCheckedKeys={[2]}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={data => {console.log('Tree data:', data)}}
        openIcon='down'
        closeIcon='up'
        highlightable
        onNodeClick={(item) => console.log('------click node', item)}
      />
    </div>
  )
}
```

:::

### 可编辑

通过树的节点进行新增、删除、编辑等操作

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    treeData: [
      { id: 1, title: '小米快递',
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

}
render() {
  return (
    <div style={{width:500}}>
      <Tree
        defaultExpandAll
        editable={true}
        data={this.state.treeData}
        defaultCheckedKeys={[2]}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onSave={(saveNode, data) => {
          console.log(saveNode, data)
        }}
        onDelete={(deleteNode, data) => {
          console.log(deleteNode, data)
        }}
        onChange={data => {console.log('Tree data:', data)}}
        openIcon='down'
        closeIcon='up'
        highlightable
        onNodeClick={(item) => console.log('------click node', item)}
      />
    </div>
  )
}
```

:::

### 可拖拽

对树的节点进行拖拽操作

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    treeData: [
      { id: 1, title: '小米快递',
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

}

render() {
  return (
    <div style={{width:500}}>
      <Tree
        defaultExpandAll
        draggable={true}
        data={this.state.treeData}
        defaultCheckedKeys={[2]}
        onDragStart = {(dragNode)=> {
          console.log(dragNode)
        }}
        onDrop = {(dragNode,dropNode)=> {
          console.log(dragNode,dropNode)
        }}
        onNodeToggle={(data, isExpanded) => {console.log('toggle: data isExpanded', data, isExpanded)}}
        onChange={data => {console.log('Tree data:', data)}}
        openIcon='down'
        closeIcon='up'
        highlightable
        onNodeClick={(item) => console.log('------click node', item)}
      />
    </div>
  )
}
```

:::

### Props

| 参数             | 说明                                                                    | 类型                                                                   | 可选值                      | 默认值 |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------- | ------ |
| data             | 展示数据                                                                | DataItem []                                                            | -                           | -      |
| checkable        | 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用） | boolean                                                                | -                           | false  |
| editable         | 节点右键可编辑（添加同级节点、添加子节点、编辑节点、删除节点）          | boolean                                                                | -                           | false  |
| draggable        | 节点可拖拽                                                              | boolean                                                                | -                           | false  |
| searchable       | 节点可搜索                                                              | boolean                                                                | -                           | false  |
| loadTreeNode     | 点击异步加载子项                                                        | Object                                                                 | 参见 Tree Attributes-origin | -      |
| defaultExpandAll | 是否默认展开所有树节点                                                  | boolean                                                                | -                           | false  |
| checkedIds       | 选中的 checkbox                                                         | string[]                                                               | -                           | -      |
| openIcon         | 表示展开的图标                                                          | string                                                                 | Icon 图标名称               | -      |
| closeIcon        | 表示闭合的图标                                                          | string                                                                 | Icon 图标名称               | -      |
| highlightable    | 高亮                                                                    | boolean                                                                | -                           | -      |
| onChange         | 树组件改变时触发                                                        | （data:TreeNode[]）=>void                                              | -                           | -      |
| onExpand         | 节点被点击(展开/收起)时触发                                             | (expanded:boolean, expandIds: string[], expandedNode:TreeNode) => void | -                           | -      |
| onCheck          | 点击节点多选框触发                                                      | (checked:boolean, checkedIds: string[], checkedNode:TreeNode) => void  | -                           | -      |
| onDragStart      | 节点开始拖拽时触发                                                      | (dragNode: TreeNode) => void                                           | -                           | -      |
| onDrop           | 节点拖拽时触发                                                          | (dragNode: TreeNode, dropNode: TreeNode) => boolean                    | -                           | -      |
| onDropEnd        | 节点拖拽成功时触发                                                      | (dragNode: TreeNode, dropNode: TreeNode) => void                       | -                           | -      |
| onDelete         | 节点删除时触发                                                          | (deletedNode: TreeNode, data: TreeNode[]) => void                      | -                           | -      |
| onSave           | 节点保存新增、编辑状态时触发                                            | (savedNode: TreeNode, data: TreeNode[]) => void                        | -                           | -      |

### Type

**_LoadTreeNode_**

| 参数              | 说明                                                       | 类型                            | 可选值      | 默认值 |
| ----------------- | ---------------------------------------------------------- | ------------------------------- | ----------- | ------ |
| method            | 异步请求的方法                                             | String                          | get \| post | get    |
| url               | 异步请求的 url                                             | String                          | -           | -      |
| headers           | 异步请求的请求头                                           | TreeNode                        | -           | -      |
| data              | post 请求时的请求体                                        | Object                          | -           | -      |
| params            | 异步请求时的 url 参数                                      | Object                          | -           | -      |
| transformResponse | 对异步请求结果进行加工处理的函数，返回结果用于生成子节点项 | (response:object) => TreeNode[] | -           | -      |

**_TreeNode_**

| 参数     | 说明             | 类型                | 可选值 | 默认值 |
| -------- | ---------------- | ------------------- | ------ | ------ |
| id       | 树节点唯一 id    | string              | -      | -      |
| title    | 树节点标题       | string \| ReactNode | -      | -      |
| children | 异步请求的请求头 | TreeNode []         | -      | -      |
