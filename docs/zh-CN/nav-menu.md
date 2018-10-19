## NavMenu 导航tab

导航tab，包括一级二级导航

### 一级菜单
:::demo

```js

constructor(props){
  super(props)
  this.data1 = [
    {title: 'Option 0'},
    {title: 'Option 1', disabled: true},
    {title: 'Option 2'},
    {title: 'Option 3'},
    {title: 'Option 4'}
  ]
}
handleClick(event, key) {
  console.log('info', {event, key})
}
render() {
  return (
    <div>
      <NavMenu
        onClick={this.handleClick}
        selectedKey={2}
        data={this.data1}
      ></NavMenu>
    </div>
  )
}
```
:::

### 一级菜单多行

:::demo
```js
constructor(props){
  super(props)
  this.data2 = [
    {title: 'Option 0'},
    {title: 'Option 1', disabled: true},
    {title: 'Option 2'},
    {title: 'Option 3'},
    {title: 'Option 4'},
    {title: 'Option 5'},
    {title: 'Option 6'},
    {title: 'Option 6'},
    {title: 'Option 6'},
  ]
}
handleClick(event, key) {
  console.log('info', {event, key})
}
render() {
  return (
    <div>
      <NavMenu
        onClick={this.handleClick}
        selectedKey={2}
        data={this.data2}
      ></NavMenu>
    </div>
  )
}
```
:::

### 二级菜单

:::demo
```js
constructor(props){
  super(props)
  this.data3 = [
    {
      title: 'Option 0',
      children: [
        {title: 'Option 6'},
        {title: 'Option 6'}
      ]
    },
    {
      title: 'Option 1', 
      disabled: true,
      children: [
        {title: 'Option 6'},
        {title: 'Option 6'}
      ]
    },
    {
      title: 'Option 2', 
      children: [
        {title: 'Option 7'},
        {title: 'Option 7'}
      ]
    },
    {
      title: 'Option 3', 
      children: [
        {title: 'Option 8'},
        {title: 'Option 8'}
      ]
    },
    {
      title: 'Option 4', 
      children: [
        {title: 'Option 9'},
        {title: 'Option 9'}
      ]
    }
  ]
}
handleClick(event, key) {
  console.log('info', {event, key})
}
render() {
  return (
    <div>
      <NavMenu
        onClick={this.handleClick}
        data={this.data3}
      ></NavMenu>
    </div>
  )
}
```
:::

### 自定义渲染
:::demo

```js

constructor(props){
  super(props)
  this.data1 = [
    {title: 'Option 0'},
    {title: '点我跳转', url: 'https://www.mi.com/'},
    {title: 'Option 2', icon: 'https://www.mi.com/favicon.ico'},
    {title: 'Option 3'},
    {title: 'Option 4'}
  ]
}
customRender(data) {
  return(
    data.icon ? <span><img src={data.icon}/>{data.title}</span> : data.url ? <a href={data.url}>{data.title}</a> : data.title
  )
}
handleClick(event, key) {
  console.log('info', {event, key})
}
render() {
  return (
    <div>
      <NavMenu
        onClick={this.handleClick}
        selectedKey={2}
        data={this.data1}
        render={this.customRender}
      ></NavMenu>
    </div>
  )
}
```
:::

### tab切换

:::demo

```js

constructor(props){
  super(props)
  this.data1 = [
    {title: 'Option 0'},
    {title: 'Option 1', disabled: true},
    {title: 'Option 2'},
    {title: 'Option 3'},
    {title: 'Option 4'}
  ]
}
handleClick(event, key) {
  console.log('info', {event, key})
}
render() {
  return (
    <div>
      <NavMenu
        onClick={this.handleClick}
        data={this.data1}
      >
        <div>0</div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </NavMenu>
    </div>
  )
}
```
:::

### API

#### NavMenu props

| 参数    | 说明     | 类型     | 可选值 | 默认值     |
|------|-----|-----|-------|-------|
| onClick | 点击MenuItem菜单回调 | function | - |- |
| selectedKey | 当前激活 tab 面板的 key | number | - |0 |
| render | 自定义渲染方法, 传入参数为该节点数据 | function | - | - |
| data | 传入的数据 | array | - | - |


#### data

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| title | 必填, 显示内容 | string | - | - |
| disabled | 是否禁用该节点 | boolen |  - | false |
| children | 是否有二级菜单及对应数据 | arry | - | - |