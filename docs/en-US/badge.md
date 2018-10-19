## Badge

Badge Component


### Normal

:::demo

Normal

```js
render () {
  return (
    <Badge value={8}>
      <Button appearance='line'>Message</Button>
    </Badge>
  )
}
```
:::


### Limit maximum display value

:::demo

Limit maximum display value

```js
render () {
  return (
    <Badge value={88} max={44}>
      <Button appearance='line'>Message</Button>
    </Badge>
  )
}
```
:::


### Hidden Badge

:::demo

Set the hidden property to hide badges

```js
render () {
  return (
    <Badge value={90} hidden>
      <Button appearance='line'>Message</Button>
    </Badge>
  )
}
```
:::


### Red dot

:::demo

Red dot will take precedence over other displays

```js
render () {
  return (
    <div>
      <Badge dot value='88' style={{marginRight: '32px'}}>Message</Badge>
      <Badge dot>
        <Button appearance='line'>Message</Button>
      </Badge>
    </div>
  )
}
```
:::


### Custom Content

:::demo


```js
render () {
  return (
    <Badge value="hot">
      <Button appearance='line'>Message</Button>
    </Badge>
  )
}
```
:::


### Attribute

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| value | badge content | string\/number | - | '' |
| dot | whether it is displayed as a red dot | boolean | - | false | 
| max | digital maximum  |  number  | - | 99 |
| hidden | whether to hide badge | boolean | - | false |