## Input 输入框

通过鼠标或键盘输入字符


### 普通类型

:::demo

普通类型

```js
render() {
  return (
    <div>
      <Input
        value=""
        placeholder="2～5个字符"
        maxLength="5"
        minLength="2"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### 禁用状态

:::demo

禁用状态

```js
render() {
  return (
    <div>
      <Input
        value=""
        placeholder="禁用状态"
        style={{width: '250px'}}
        disabled
      />
    </div>
  )
}
```
:::


### 必填

:::demo

必填项

```js
render() {
  return (
    <div>
      <Input
        value=""
        type="text"
        placeholder="必填"
        required
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### 身份证类型

:::demo

身份证类型

```js
render() {
  return (
    <div>
      <Input
        type="id"
        value='110108201808161810'
        placeholder="请输入身份证"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### 手机号类型

:::demo

手机号类型

```js
render() {
  return (
    <div>
      <Input
        type="tel"
        value=''
        placeholder="请输入手机号"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### 小数

:::demo

带小数点的金额

```js
render() {
  return (
    <div>
      <Input
        value="223.00"
        type="amount"
        placeholder="请输入金额"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### 前缀

:::demo

国际号码

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


### 后缀

:::demo

邮箱

```js
render() {
  return (
    <div>
      <Input
        value="MIFE"
        type="email"
        suffix="@xiaomi.com"
        placeholder="请输入邮箱(数字、字母、下划线)"
        style={{width: '250px'}}
      />
    </div>
  )
}
```
:::


### 前缀 + 后缀

:::demo

网址

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


### 多行文本

:::demo

多行文本

```js
render() {
  return (
    <div>
      <Input
        value=""
        type="textarea"
        placeholder="多行文本"
        style={{width: '540px', height: '300px'}}
      />
    </div>
  )
}
```
:::


### Input Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 设置输入框类型 | string | text, textarea, id, tel, card, amount, email  | text |
| disabled | 是否禁用 | boolean | true/false | false |
| required | 是否必填 | string | true/false | false |
| prefix | 前缀 | string | - | - |
| suffix | 后缀 | string | - | - |

### Input Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onFocus | 获得焦点时触发 | (event: Event, value: 原始值) |
| onBlur | 失去焦点时触发 | (event: Event, value: 原始值) |
| onKeyDown | 触发 keydown 事件 | (event: Event, value: 原始值) |
| onKeyPress | 触发 keypress 事件 | (event: Event, value: 原始值) |
| onInput | 触发 input 事件 | (event: Event, value: 原始值) |
| onChange | 值改变时触发 | (event: Event, value: 原始值) |
| onKeyUp | 触发 keyup 事件 | (event: Event, value: 原始值) |

