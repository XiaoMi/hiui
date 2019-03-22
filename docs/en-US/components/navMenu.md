## NavMenu

### Basic
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

### Multi-line

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

### Secondary menu

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

### Custom rendering
:::demo

```js

constructor(props){
  super(props)
  this.data1 = [
    {title: 'Option 0'},
    {title: 'Jump', url: 'https://www.mi.com/'},
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

### Tab

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

| Attribute | Description | Type | Options | Default  |
|------|-----|-----|-------|-------|
| onClick | callback | function | - |- |
| selectedKey | Currently activated key  | number | - |0 |
| render | Custom rendering method | function | - | - |
| data | data | array | - | - |


#### data

| Attribute | Description | Type | Options | Default  |
| --- | --- | --- | --- | --- |
| title | title | string | - | - |
| disabled | disabled | boolen |  - | false |
| children | children | arry | - | - |