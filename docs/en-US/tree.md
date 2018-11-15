## Tree

### Common usage

:::demo

```js
constructor(props) {
  super(props)
  this.treeData = [
    { id: 1, title: 'Mi',
      children: [
        { id: 2, title: 'Redmi Phones',
          children: [
            { id: 3, title: 'Redmi 6 Pro', onClick: data => {console.log('result', data)} }, 
            { id: 4, title: 'Redmi 6A' },
            { id: 5, title: 'Redmi Y2' }
          ]
        },
        { id: 6, title: 'Mi Action Camera 4k' }
      ]
    },
    { id: 11, title: 'Mi TV',
      children: [
        { id: 22, title: <a>TV</a>,
          children: [
            { id: 33, title: 'Mi LED TV 4 PRO 55' }, 
            { id: 44, title: 'Mi LED TV 4A PRO 49' },
            { id: 55, title: 'Mi LED Smart TV 4A 43' }
          ]
        },
        { id: 66, title: 'Other' }
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
    { id: 1, title: 'Mi',
      children: [
        { id: 2, title: 'Redmi Phones',
          children: [
            { id: 3, title: 'Redmi 6 Pro', onClick: data => {console.log('result', data)} }, 
            { id: 4, title: 'Redmi 6A' },
            { id: 5, title: 'Redmi Y2' }
          ]
        },
        { id: 6, title: 'Mi Action Camera 4k' }
      ]
    },
    { id: 11, title: 'Mi TV',
      children: [
        { id: 22, title: <a>TV</a>,
          children: [
            { id: 33, title: 'Mi LED TV 4 PRO 55' }, 
            { id: 44, title: 'Mi LED TV 4A PRO 49' },
            { id: 55, title: 'Mi LED Smart TV 4A 43' }
          ]
        },
        { id: 66, title: 'Other' }
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
