## Stepper

### Basic usage

:::demo

The basic usage of stepper is left and right structure, just pass in the step information array.

```js
render() {
  const list = [
    {
      title: 'Account information',
    },
    {
      title: 'Mailbox activation',
    },
    {
      title: 'Information registration',
    },
  ]

  return (
    <div>
      <Stepper 
        list={list}
        current={1}
      />
    </div>
  )
}
```
:::


### Icon usage

:::demo

Stepper icon usage

```js
render() {
  const list = [
    {
      title: 'Account information',
      icon: <Icon name='user' />,
    },
    {
      title: 'Mailbox activation',
      icon: <Icon name='time' />
    },
    {
      title: 'Information registration',
      icon: <Icon name='list' />
    },
  ]

  return (
    <div>
      <Stepper 
        list={list}
        current={1}
      />
    </div>
  )
}
```
:::


### Top and bottom structure

:::demo

The upper and lower structures only need to add `up=true`; only the upper and lower structures have text descriptions.

```js
render() {
  const list = [
    {
      title: 'Account information',
      text: 'Please Input Account information',
    },
    {
      title: 'Mailbox activation',
      text: 'Please Input Emial',
    },
    {
      title: 'Information registration',
      text: 'Please Input Personal information',
    },
  ]

  return (
    <div>
      <Stepper 
        list={list}
        current={2}
        up={true}
      />
    </div>
  )
}
```
:::


### Icon usage of the top and bottom structure

:::demo

The icon usage of the upper and lower structure needs to add `up=true` and add the src value to the list of values.

```js
render() {
  const list = [
    {
      title: 'Account information',
      text: 'Please Input Account information',
      icon: <Icon name='user' />
    },
    {
      title: 'Mailbox activation',
      text: 'Please Input Emial',
      icon: <Icon name='time' />
    },
    {
      title: 'Information registration',
      text: 'Please Input Personal information',
      icon: <Icon name='list' />
    },
  ]

  return (
    <div>
      <Stepper 
        list={list}
        current={1}
        up={true}
      />
    </div>
  )
}
```
:::



### Vertical direction

:::demo

 Need to pass in attribute `vertical = true`

```js
render() {
  const list = [
    {
      title: 'Account information',
      text: 'Please Input Account information',
    },
    {
      title: 'Mailbox activation',
      text: 'Please Input Emial',
    },
    {
      title: 'Information registration',
      text: 'Please Input Personal information',
    },
  ]

  return (
    <div
      style={{height: '500px', width: '130px'}}
    >
      <Stepper 
        list={list}
        current={1}
        vertical={true}
      />
    </div>
  )
}
```
:::


### Icon usage of vertical direction

:::demo

Need to pass in attribute `vertical = true`

```js
render() {
  const list = [
    {
      title: 'Account information',
      text: 'Please Input Account information',
      icon: <Icon name='user' />,
    },
    {
      title: 'Mailbox activation',
      text: 'Please Input Emial',
      icon: <Icon name='time' />,
    },
    {
      title: 'Information registration',
      text: 'Please Input Personal information',
      icon: <Icon name='list' />,
    },
  ]

  return (
    <div
      style={{height: '500px', width: '130px'}}
    >
      <Stepper 
        list={list}
        current={1}
        vertical={true}
      />
    </div>
  )
}
```
:::


### Attributes

| Attribute | Description | Type | Options | Default |
| -------- | ----- | ---- | ---- | ---- |
| id | conponent id | string | - | - |
| className | className | string | - | - |
| list | data list | [{src: string, title: string, text: string}] | - | - |
| current | current step index, counting from 0 | number | - | - |
| vertical | whether to display vertically | boolean | true | false |
| up | whether the symbol is above the text | boolean | true | false |

