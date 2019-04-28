## Tree 控件

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
          func:(res)=>{return res.data.data}
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

### Tree Attributes

| 参数             | 说明                                                                    | 类型                                                           | 可选值                       | 默认值 |
| ---------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------- | ------ |
| data             | 展示数据                                                                | Array                                                          | 参见 Tree Attributes-data    | -      |
| checkable        | 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用） | Boolean                                                        | -                            | false  |
| editable         | 节点右键可编辑（添加同级节点、添加子节点、编辑节点、删除节点）          | Boolean                                                        | -                            | false  |
| draggable        | 节点可拖拽                                                              | Boolean                                                        | -                            | false  |
| searchable       | 节点可搜索                                                              | Boolean                                                        | -                            | false  |
| options          | 配置选项                                                                | Object                                                         | 参见 Tree Attributes-options | -      |
| defaultExpandAll | 是否默认展开所有树节点                                                  | Boolean                                                        | -                            | false  |
| checkedKeys      | 默认选中的 checkbox                                                     | Array                                                          | -                            | -      |
| openIcon         | 表示展开的图标                                                          | String                                                         | Icon 图标名称                | -      |
| closeIcon        | 表示闭合的图标                                                          | String                                                         | Icon 图标名称                | -      |
| style            | 组件整体样式                                                            | Object                                                         | -                            | -      |
| highlightable    | 高亮                                                                    | Boolean                                                        | -                            | -      |
| onChange         | 改变复选框状态时触发                                                    | Function(checkedArr:Array, title: String, isChecked: Boolean)  | -                            | -      |
| onNodeToggle     | 节点被点击(展开/收起)时触发                                             | Function(data: Obejct, isExpanded: Boolean)                    | -                            | -      |
| onCheckChange    | 节点选中项                                                              | Funciton(checkedArr: Array, title: String, isChecked: Boolean) | -                            | -      |
| onDragStart      | 节点开始拖拽时触发                                                      | Funciton(dragNode: Object)                                     | -                            | -      |
| onDrop           | 节点拖拽成功时触发                                                      | Funciton(dragNode: Object, dropNode: Object)                   | -                            | -      |
| onDelete         | 节点删除时触发                                                          | Funciton(deleteNode: Object, data: Object)                     | -                            | -      |

| onSave | 节点保存新增、编辑状态时触发 | Funciton(editNode: Object, data: Object) | - | - |

### Tree Attributes-data

| 参数        | 说明                                                               | 类型     | 可选值 | 默认值 |
| ----------- | ------------------------------------------------------------------ | -------- | ------ | ------ |
| expand      | 默认是否展开子菜单（优先级高于 defaultExpandAll）                  | Boolean  | -      | false  |
| onClick     | 点击每项时触发的事件                                               | Function | -      | -      |
| onNodeClick | 点击每项时触发，onClick 作用具体绑定的项，onNodeClick 作用于所以项 | Function | -      | -      |
| style       | 单个节点样式                                                       | Object   | -      | -      |

### Tree Attributes-origin

| 参数         | 说明                                                       | 类型            | 可选值      | 默认值 |
| ------------ | ---------------------------------------------------------- | --------------- | ----------- | ------ |
| method       | 异步请求的方法                                             | String          | get \| post | get    |
| url          | 异步请求的 url                                             | String          | -           | -      |
| headers      | 异步请求的请求头                                           | Object          | -           | -      |
| data         | post 请求时的请求体                                        | Object          | -           | -      |
| params       | 异步请求时的 url 参数                                      | Object          | -           | -      |
| func         | 对异步请求结果进行加工处理的函数，返回结果用于生成子节点项 | Function(data)  | -           | -      |
| errorHandler | 对异步请求错误进行自定义处理的函数                         | Function(error) | -           | -      |

### Tree Attributes-options

| 参数     | 说明                               | 类型   | 可选值 | 默认值   |
| -------- | ---------------------------------- | ------ | ------ | -------- |
| title    | 指定节点标签为节点对象的某个属性值 | String | -      | title    |
| children | 指定子树为节点对象的某个属性值     | String | -      | children |
