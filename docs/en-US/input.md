## Input



### Basic

:::demo

Basic

```js
render() {
  return (
    <div>
      <Input
        value=""
        placeholder="2～5 character"
        maxLength="5"
        minLength="2"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Disabled

:::demo

Disabled

```js
render() {
  return (
    <div>
      <Input
        value=""
        placeholder="Disabled"
        style={{width: '250px'}}
        disabled
      />
    </div>
  )
}
```
:::


### Required

:::demo

Required

```js
render() {
  return (
    <div>
      <Input
        value=""
        type="text"
        placeholder="Required"
        required
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### ID card

:::demo

ID card

```js
render() {
  return (
    <div>
      <Input
        type="id"
        value='110108201808161810'
        placeholder="Please input ID card"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Cellphone number

:::demo

Cellphone number

```js
render() {
  return (
    <div>
      <Input
        type="tel"
        value=''
        placeholder="Please input phone number"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Decimal

:::demo


```js
render() {
  return (
    <div>
      <Input
        value="223.00"
        type="amount"
        placeholder="Please input amount"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Prefix

:::demo

International number

```js
render() {
  return (
    <div>
      <Input
        id="customId"
        value=""
        type="text"
        placeholder="010-60606666"
        prefix="+86"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Suffix

:::demo

E-mail

```js
render() {
  return (
    <div>
      <Input
        value="MIFE"
        type="email"
        suffix="@xiaomi.com"
        placeholder="Please input Email"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Prefix + Suffix

:::demo

url

```js
render() {
  return (
    <div>
      <Input
        value=""
        type="text"
        placeholder="mi"
        prefix="www."
        suffix=".com"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Multi-line text

:::demo

Multi-line text

```js
render() {
  return (
    <div>
      <Input
        style={{margin: '4px 4px'}}
        value=""
        type="textarea"
        placeholder="Multi-line text"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 设置按钮类型 | string | text, textarea, id, tel, card, amount, email  | text |
| disabled | 输入框尾部文字 | boolean | true/false | false |
| required | 输入框尾部文字 | string | true/false | false |
| prefix | 输入框头部文字 | string | - | - |
| suffix | 输入框尾部文字 | string | - | - |

### Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onFocus | 获得焦点时触发 | (event: Event, value: 原始值) |
| onBlur | 失去焦点时触发 | (event: Event, value: 原始值) |
| onKeyDown | 触发 keydown 事件 | (event: Event, value: 原始值) |
| onKeyPress | 触发 keypress 事件 | (event: Event, value: 原始值) |
| onInput | 触发 input 事件 | (event: Event, value: 原始值) |
| onChange | 值改变时触发 | (event: Event, value: 原始值) |
| onKeyUp | 触发 keyup 事件 | (event: Event, value: 原始值) |

