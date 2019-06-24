## Dropdown

### 基础用法

:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: '电视'
    },{
      title: '手机'
    },{
      title: '电脑'
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown list={this.state.list} title="电子产品" onClick={(val) => console.log(val)}></Dropdown>
    </div>
  )
}
```

:::

### 触发方式

:::demo

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: '小米手机',
      onClick: () => {
        console.log('one')
      }
    },{
      title: '小米电视',
      prefix: <Icon name='list'/>,
      disabled: true
    },{
      title: '小米生态链相关产品',
      prefix: <Icon name='list'/>,
      suffix: <Icon name='truck'/>
    },{
      title: '-'
    },{
      title: '其它',
      value: 'other'
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown
        list={this.state.list}
        trigger={['click', 'contextmenu']}
        onClick={(val) => {console.log(val)}}
        title="左键或右键点击"
        width={160}
      >
      </Dropdown>
    </div>
  )
}
```

:::

### 按钮菜单

:::demo
自定义前缀、后缀

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'one'
    },{
      title: 'two',
      prefix: <Icon name='add'/> // 此 prefix 将会被替换为外部的 prefix
    },{
      title: 'three',
      suffix: <Icon name='truck'/>
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown
        list={this.state.list}
        title="按钮菜单"
        type="button"
        // trigger={['click']}
        onClick={(val) => console.log(val)}
        prefix={<Icon name='list'/>}
      />
    </div>
  )
}
```

:::

### 拓展菜单

:::demo
传入 type 为 group，组件会将 title 执行对应的点击响应，点击箭头打开菜单项

```js
constructor () {
  super()
  this.state = {
    list: [{
      title: 'one'
    },{
      title: 'two',
      prefix: <Icon name='add'/> // 此 prefix 将会被替换为外部的 prefix
    },{
      title: 'three',
      suffix: <Icon name='truck'/>
    }]
  }
}
render() {
  return (
    <div>
      <Dropdown
        list={this.state.list}
        title="按钮菜单"
        type="group"
        // trigger={['click']}
        onClick={(val) => console.log(val)}
        prefix={<Icon name='list'/>}
      />
    </div>
  )
}
```

:::

#### Props

| 参数    | 说明                   | 类型                     | 可选值                        | 默认值 |
| ------- | ---------------------- | ------------------------ | ----------------------------- | ------ |
| data    | 下拉菜单数据项         | DataItem []              | -                             | -      |
| title   | 下拉菜单显示标题的内容 | string \| ReactNode      | -                             | -      |
| type    | 下拉菜单类型           | string                   | text \| button \| group       | text   |
| onClick | 点击回调函数           | （item:DataItem）=> void | -                             | -      |
| prefix  | 前缀图标               | string \| ReactNode      | -                             | -      |
| suffix  | 后缀图标               | string \| ReactNode      | -                             | -      |
| trigger | 触发方式               | string \| string []      | click \| contextmenu \| hover | click  |

#### Type

**_DateItem_**

| 参数     | 说明           | 类型                | 可选值 | 默认值 |
| -------- | -------------- | ------------------- | ------ | ------ |
| title    | 显示文案       | string \| ReactNode | -      | -      |
| prefix   | 文案前缀       | string \| ReactNode | -      | -      |
| suffix   | 文案后缀       | string \| ReactNode | -      | -      |
| disabled | 是否禁用       | boolean             | -      | false  |
| url      | 点击跳转的路径 | string              | -      | -      |
