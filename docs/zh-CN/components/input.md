## Input 输入框

通过鼠标或键盘输入字符

### 类型

:::demo

类型

```js
constructor () {
  super()
  this.state = {
    types: [{
      id: 'text',
      content: '普通'
    }, {
      id: 'id',
      content: '身份证'
    }, {
      id: 'tel',
      content: '手机号'
    }, {
      id: 'amount',
      content: '浮点数'
    }],
    type: 'text'
  }
  this.getPlaceholder = () => {
    const type = this.state.type
    return {
      text: '请输入...',
      id: '请输入身份证号',
      tel: '请输入手机号码',
      amount: '请输入浮点数'
    }[type]
  }
}
render() {
  const { types, type, placeholder } = this.state
  return (
    <div>
      <Radio.Group
        data={types}
        type='button'
        value={type}
        onChange={(type) => {
          this.setState({ type })
        }}
      />
      <p />
      <Input
        type={type}
        placeholder={this.getPlaceholder()}
        style={{ width: 250 }}
      />
    </div>
  )
}
```

:::

### 状态

:::demo

状态

```js
constructor () {
  super()
  this.state = {
    disabled: false,
    required: false,
    value: 'disabled',
    list: [{
      id: 'disabled',
      content: '禁用状态'
    }, {
      id: 'required',
      content: '必填项'
    }]
  }
}
render() {
  const { list, required, disabled, value } = this.state
  return (
    <div>
      <Radio.Group
        data={list}
        type='button'
        value={value}
        onChange={(value) => {
          this.setState({ value })
        }}
      />
      <p />
      <Input
        placeholder='请输入'
        style={{ width: 250 }}
        required={value === 'required'}
        disabled={value === 'disabled'}
      />
    </div>
  )
}
```

:::

### 附加

:::demo

附加

```js
changeEvent (e, val) {
  console.log(e.target.value, val)
}
render() {
  return (
    <div>
      <Input
        style={{ width: 250 }}
        placeholder='010-12345678'
        prefix='+86'
        onChange={this.changeEvent.bind(this)}
      />
      <p />
      <Input
        style={{ width: 250 }}
        placeholder='mife'
        suffix='@xiaomi.com'
        onChange={this.changeEvent.bind(this)}
      />
      <p />
      <Input
        style={{ width: 250 }}
        placeholder='mi'
        prefix='www.'
        suffix='.com'
        onChange={this.changeEvent.bind(this)}
      />
    </div>
  )
}
```

:::

### 前置元素

:::demo

国际号码

```js
render() {
  return (
    <div>
      <Input
        type="text"
        placeholder="请输入手机号"
        prepend={<Select
          mode='single'
          clearable={false}
          style={{ width: 80 }}
          list={[
            { name:'+86', id:'86' },
            { name:'+1', id:'1' },
            { name:'+33', id:'33' },
            { name:'+91', id:'91' },
          ]}
          value='86'
        />}
        style={{ width: 250 }}
      />
      <p />
      <Input
        type="text"
        placeholder="请输入手机号"
        append={<Button>搜索</Button>}
        style={{ width: 250 }}
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
    <Input
      type="textarea"
      placeholder="多行文本"
      style={{ width: 540, height: 300 }}
    />
  )
}
```

:::

### Input Attributes

| 参数        | 说明           | 类型    | 可选值                                                   | 默认值 |
| ----------- | -------------- | ------- | -------------------------------------------------------- | ------ |
| type        | 设置输入框类型 | String  | text \| textarea \| id \| tel \| card \| amount \| email | text   |
| disabled    | 是否禁用       | Boolean | true \| false                                            | false  |
| required    | 是否必填       | String  | true \| false                                            | false  |
| prefix      | 前缀           | String  | -                                                        | -      |
| suffix      | 后缀           | String  | -                                                        | -      |
| prepend     | 前置元素       | Element | -                                                        | -      |
| append      | 后置元素       | Element | -                                                        | -      |
| placeholder | 占位符         | String  | -                                                        | -      |

### Input Events

| 参数       | 说明               | 回调参数                                                                                                                                                 |
| ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onFocus    | 获得焦点时触发     | (event: Event, value: 原始值)                                                                                                                            |
| onBlur     | 失去焦点时触发     | (event: Event, value: 原始值)                                                                                                                            |
| onKeyDown  | 触发 keydown 事件  | (event: Event, value: 原始值)                                                                                                                            |
| onKeyPress | 触发 keypress 事件 | (event: Event, value: 原始值)                                                                                                                            |
| onInput    | 触发 input 事件    | (event: Event, value: 原始值)                                                                                                                            |
| onChange   | 值改变时触发       | (event: Event, value: 原始值)<br/> 当 Input 包含 prefix 或 suffix 属性时，value 会得到拼接后的值，如果需要得到原始的值，可以使用 event.target.value 获取 |
| onKeyUp    | 触发 keyup 事件    | (event: Event, value: 原始值)                                                                                                                            |
