## Badge 消息气泡

常用的消息气泡提示组件


### 普通类型

:::demo

普通类型

```js
render () {
  return (
    <Badge value={8}>
      <Button type='default'>最新报表</Button>
    </Badge>
  )
}
```
:::


### 限制最大显示值

:::demo

限制最大显示值

```js
render () {
  return (
    <Badge value={88} max={44}>
      <Button type='default'>最新报表</Button>
    </Badge>
  )
}
```
:::


### 隐藏气泡

:::demo

设置 hidden 属性隐藏气泡

```js
render () {
  return (
    <Badge value={90} hidden>
      <Button type='default'>最新报表</Button>
    </Badge>
  )
}
```
:::


### 小红点

:::demo

小红点将优先于其他显示

```js
render () {
  return (
    <div>
      <Badge dot value='88' style={{marginRight: '32px'}}>最新报表</Badge>
      <Badge dot>
        <Button type='default'>最新报表</Button>
      </Badge>
    </div>
  )
}
```
:::


### 自定义内容

:::demo

可以显示 String 类型的内容

```js
render () {
  return (
    <Badge value="hot">
      <Button type='default'>最新报表</Button>
    </Badge>
  )
}
```
:::


### Badge Attributes

| 参数 | 说明 | 类型 | 默认值 |
| -------- | ----- | ---- | ---- |
| value | 气泡内容 | string\/number | '' |
| dot | 气泡是否显示为红点 | boolean | false | 
| max | 气泡中显示数字的最大值 |  number  | 99 |
| hidden | 是否隐藏气泡 | boolean | false |