## Tree

### Common usage

:::demo

```js
  constructor (props) {
    super(props)
    this.treeData = [
      { id: 1,
        title: '小米',
        expanded: false,
        children: [
          { id: 2,
            title: '技术',
            children: [
              { id: 3, title: '后端', disabled: true},
              { id: 4, title: '运维' },
              { id: 5, title: '前端' }
            ]
          },
          { id: 6, title: '产品' }
        ]
      },
      { id: 11,
        title: '小米2',
        children: [
          { id: 22,
            title: '技术2',
            children: [
              { id: 33, title: '后端2' },
              { id: 44, title: '运维2' },
              { id: 55, title: '前端2' }
            ]
          },
          { id: 66, title: '产品2' }
        ]
      }
    ]
    this.state = {
      data: [],
      checkedKeys: [3]
    }
  }

  render () {
    return (
      <div style={{width: 300}}>
        <Tree
          checkable
          data={this.treeData}
          checkedKeys={this.state.checkedKeys}
          onNodeToggle={(data, isExpanded) => { console.log('toggle: data isExpanded', data, isExpanded) }}
          // onChange={(data, title, bool, semi) => { console.log('Tree data:', data, title, bool, semi) }}
          onChange={(checkedKeys,title, bool, semi) => {
            this.setState({
              checkedKeys
            })
            console.log(checkedKeys, title, bool, semi)
          }}
          onClick={data => { console.log('tree node click', data) }}
        />
      </div>
    )
  }

  componentDidMount () {
  }
```

:::

### Checkbox

:::demo

checkbox

```js
  constructor (props) {
    super(props)
    this.treeData = [
      { id: 1,
        title: '小米',
        expanded: true,
        children: [
          { id: 2,
            title: '技术',
            children: [
              { id: 3, title: '后端', disabled: true},
              { id: 4, title: '运维' },
              { id: 5, title: '前端' }
            ]
          },
          { id: 6, title: '产品' }
        ]
      },
      { id: 11,
        title: '小米2',
        children: [
          { id: 22,
            title: '技术2',
            children: [
              { id: 33, title: '后端2' },
              { id: 44, title: '运维2' },
              { id: 55, title: '前端2' }
            ]
          },
          { id: 66, title: '产品2' }
        ]
      }
    ]
    this.state = {
      data: [],
      checkedKeys: [3]
    }
  }

  render () {
    return (
      <div style={{width: 300}}>
        <Tree
          checkable
          data={this.treeData}
          checkedKeys={this.state.checkedKeys}
          onNodeToggle={(data, isExpanded) => { console.log('toggle: data isExpanded', data, isExpanded) }}
          // onChange={(data, title, bool, semi) => { console.log('Tree data:', data, title, bool, semi) }}
          onChange={(checkedKeys,title, bool, semi) => {
            this.setState({
              checkedKeys
            })
            console.log(checkedKeys, title, bool, semi)
          }}
          onClick={data => { console.log('tree node click', data) }}
        />
      </div>
    )
  }

  componentDidMount () {
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
| checkedKeys | selected checkboxes | array | - | - |

### Attribute-data

| Attribute | Description | Type | Options | Default |
| ------- | ------- | ------- | ------- | ------- |
| expanded | whether to expand the submenu (priority is higher than defaultExpandAll) | blooean | true, false | - |
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
