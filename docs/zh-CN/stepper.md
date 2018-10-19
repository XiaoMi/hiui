## Stepper 步骤

步骤

### 基础用法

:::demo

stepper 基础用法为左右结构，只需传入步骤信息数组

```js
render() {
  const list = [
    {
      title: '账号信息',
    },
    {
      title: '邮箱激活',
    },
    {
      title: '信息登记',
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


### 图标用法

:::demo

stepper 图标用法传入src值

```js
render() {
  const list = [
    {
      title: '账号信息',
      icon: <Icon name='user' />,
    },
    {
      title: '邮箱激活',
      icon: <Icon name='time' />
    },
    {
      title: '信息登记',
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


### 上下结构

:::demo

stepper 上下结构只需加入up=true；只有上下结构有text描述

```js
render() {
  const list = [
    {
      title: '账号信息',
      text: '请输入账号信息',
    },
    {
      title: '邮箱激活',
      text: '请输入邮箱',
    },
    {
      title: '信息登记',
      text: '请输入个人信息',
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


### 上下结构的图标用法

:::demo

stepper 上下结构的图标用法需要加入up=true，并在数值列表中添加src值

```js
render() {
  const list = [
    {
      title: '账号信息',
      text: '请输入账号信息',
      icon: <Icon name='user' />
    },
    {
      title: '邮箱激活',
      text: '请输入邮箱',
      icon: <Icon name='time' />
    },
    {
      title: '信息登记',
      text: '请输入个人信息',
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



### 竖直方向

:::demo

stepper 竖直方向只需传入属性vertical=true

```js
render() {
  const list = [
    {
      title: '账号信息',
      text: '请输入账号信息',
    },
    {
      title: '邮箱激活',
      text: '请输入邮箱',
    },
    {
      title: '信息登记',
      text: '请输入个人信息',
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


### 竖直方向图标用法

:::demo

stepper 竖直方向只需传入属性vertical=true

```js
render() {
  const list = [
    {
      title: '账号信息',
      text: '请输入账号信息',
      icon: <Icon name='user' />,
    },
    {
      title: '邮箱激活',
      text: '请输入邮箱',
      icon: <Icon name='time' />,
    },
    {
      title: '信息登记',
      text: '请输入个人信息',
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

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| id | 组件id | string | - | - |
| className | class 类 | string | - | - |
| list | 步骤元素列表 | [{src: string, title: string, text: string}] | - | - |
| current | 当前步骤位置索引，从0开始计数 | number | - | - |
| vertical | 是否竖直显示 | boolean | true | false |
| up | 在水平显示时符号是否在上 | boolean | true | false |


### Events

无事件类型