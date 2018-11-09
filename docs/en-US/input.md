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

| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| type | Input type | string | text, textarea, id, tel, card, amount, email  | text |
| disabled | Whether to disable | boolean | true/false | false |
| required | Required or not | string | true/false | false |
| prefix | prefix | string | - | - |
| suffix | suffix | string | - | - |

### Events

| Attribute | Description | Callback params |
| -------- | ----- | ---- |
| onFocus | Trigger when getting focus | (event: Event, value: Original value) |
| onBlur | Triggered when focus is lost | (event: Event, value: Original value) |
| onKeyDown | Trigger when the keyboard is pressed | (event: Event, value: Original value) |
| onKeyPress | Triggered when the keyboard is pressed and raised | (event: Event, value: Original value) |
| onInput | Trigger on input | (event: Event, value: Original value) |
| onChange | Triggered when the value changes | (event: Event, value: Original value) |
| onKeyUp | Triggered when the keyboard is raised | (event: Event, value: Original value) |

