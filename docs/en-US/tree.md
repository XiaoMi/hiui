## Tree

### Common usage

:::demo

```js
constructor(props) {
  super(props)
  this.treeData = [
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

render() {
  return (
    <div style={{width:300}}>
      <Tree
        defaultExpandAll
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


### Checkbox

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


### Attribute

| Attribute | Description | Type | Options | Default |
| ------- | ------- | ------- | ------- | ------- |
| data | data | array | - | - |
| checkable | whether to add the checkbox | boolean | false | - |
| options | options | object | - | - |
| defaultExpandAll | whether to expand all tree nodes | boolean | - | false |
| defaultCheckedKeys | selected checkboxes | array | - | - |
| disabledCheckedKeys | checkboxes not selected | array | - | - |

### Attribute-data

| Attribute | Description | Type | Options | Default |
| ------- | ------- | ------- | ------- | ------- |
| expand | whether to expand the submenu (priority is higher than defaultExpandAll) | blooean | true, false | false |
| onClick | event triggered when clicked | function

### Attribute-options

| Attribute | Description | Type | Options | Default |
| ----------| ------- | ------- | ------- | ------- |
| title | specify the node label as a property value of the node object | string | - | title |
| children | specify a subtree as a property value of a node object | string | - | children |

### Events

| Attribute | Description | Parameters |
| -------- | ----- | ---- |
| onChange | triggered when changing the state of the checkbox | (data: Object) |
| onNodeToggle | triggered when the node is clicked | (data: Obejct, isExpanded: boolean) |

[//]: # (
| onDragStart |
| onDragEnter |
| onDragOver |
| onDragLeave |
| onDragEnd |
| onDrop |
)
