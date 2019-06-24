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

stepper 图标用法传入 src 值

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

stepper 上下结构只需加入 up=true；只有上下结构有 text 描述

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

stepper 上下结构的图标用法需要加入 up=true，并在数值列表中添加 src 值

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

stepper 竖直方向只需传入属性 vertical=true

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

stepper 竖直方向只需传入属性 vertical=true

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

### Props

| 参数      | 说明                            | 类型        | 可选值                | 默认值    |
| --------- | ------------------------------- | ----------- | --------------------- | --------- |
| className | 样式名                          | string      | -                     | -         |
| data      | 步骤数据项                      | DataItem [] | -                     | -         |
| current   | 当前步骤位置索引，从 0 开始计数 | number      | -                     | -         |
| placement | 位置                            | string      | vertical \| horizonal | horizonal |
| up        | 在水平显示时符号是否在上        | boolean     | true \| false         | false     |

#### Type

**_DateItem_**

| 参数    | 说明        | 类型                | 可选值 | 默认值 |
| ------- | ----------- | ------------------- | ------ | ------ |
| title   | 显示文案    | string \| ReactNode | -      | -      |
| content | 内容文案    | string \| ReactNode | -      | -      |
| icon    | 自定义 icon | string \| ReactNode | -      | -      |
