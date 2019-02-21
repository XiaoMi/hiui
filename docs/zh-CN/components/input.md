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
      name: '普通',
      placeholder: '请输入...'
    }, {
      id: 'id',
      name: '身份证',
      placeholder: '请输入身份证号'
    }, {
      id: 'tel',
      name: '手机号',
      placeholder: '请输入手机号码'
    }, {
      id: 'amount',
      name: '浮点数',
      placeholder: '请输入浮点数'
    }],
    type: 'text',
    checkedIndex: 0,
    placeholder: '请输入...'
  }
}
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  const {types, type, checkedIndex, placeholder} = this.state
  return (
    <div>
      <Row gutter={true}>
        <Col span={12}>
          <Radio
            list={types}
            mode='button'
            checked={checkedIndex}
            onChange={(data, index) => {
              this.setState({
                type: data,
                checkedIndex: index,
                placeholder: types[index].placeholder
              })
            }}
          />
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={12}>
          <Input
            type={type}
            placeholder={placeholder}
            style={{width: '250px'}}
          />
        </Col>
      </Row>
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
    checkedIndex: 0,
    placeholder: '禁用状态',
    list: [{
      id: 'disabled',
      name: '禁用状态'
    }, {
      id: 'required',
      name: '必填项'
    }]
  }
}
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  const {list, required, disabled, placeholder, checkedIndex} = this.state
  return (
    <div>
      <Row gutter={true}>
        <Col span={12}>
          <Radio
            list={list}
            mode='button'
            checked={checkedIndex}
            onChange={(data, index) => {
              this.setState({
                placeholder: list[index].name,
                checkedIndex: index,
                required: data === 'required',
                disabled: data === 'disabled'
              })
            }}
          />
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={12}>
           <Input
            value=""
            placeholder={placeholder}
            style={{width: '250px'}}
            required={required}
            disabled={disabled}
          />
        </Col>
      </Row>
     
    </div>
  )
}
```
:::



### 附加

:::demo

附加

```js
constructor () {
  super()
  this.state = {
    prefix: '+86',
    suffix: '',
    checkedIndex: 0,
    placeholder: '010-12345678',
    list: [{
      name: '前缀',
      prefix: '+86',
      placeholder: '010-12345678'
    }, {
      name: '后缀',
      suffix: '@xiaomi.com',
      placeholder: 'mife'
    }, {
      name: '两者',
      prefix: 'www.',
      suffix: '.com',
      placeholder: 'mi'
    }]
  }
}
render() {
  const Row = Grid.Row
  const Col = Grid.Col
  const {list, prefix, suffix, placeholder, checkedIndex} = this.state
  return (
    <div>
      <Row gutter={true}>
        <Col span={12}>
          <Radio
            list={list}
            mode='button'
            checked={checkedIndex}
            onChange={(data, index, item) => {
              this.setState({
                placeholder: item.placeholder,
                checkedIndex: index,
                prefix: item.prefix || '',
                suffix: item.suffix || '',
              })
            }}
          />
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={12}>
           <Input
            value=""
            placeholder={placeholder}
            style={{width: '250px'}}
            suffix={suffix}
            prefix={prefix}
          />
        </Col>
      </Row>
    </div>
  )
}
```
:::


### 前置元素

:::demo

国际号码

```js
constructor () {
  super()
  const ele = <Select
    mode='single'
    clearable={false}
    style={{width: '80px'}}
    list={[
      { name:'+86', id:'86' },
      { name:'+1', id:'1' },
      { name:'+33', id:'33' },
      { name:'+91', id:'91' },
    ]}
    value='86'
    onChange={(item) => {
      console.log('单选结果', item)
      const selectValue = item[0].id
      this.setState({selectValue, tel: `${selectValue} ${value}`})
    }}
  />
  this.state = {
    prepend: ele,
    append: null,
    checkedIndex: 0,
    radioList: [{
      name: '前置元素',
      prepend: ele
    }, {
      name: '后置元素',
      append: <Button type="primary">搜索</Button>
    }],
    value: ''
	}
}
render() {
  const {
    value,
    radioList,
    checkedIndex,
    prepend,
    append    
  } = this.state
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
    <Row gutter={true}>
        <Col span={12}>
          <Radio
            list={radioList}
            mode='button'
            checked={checkedIndex}
            onChange={(data, index, item) => {
              this.setState({
                checkedIndex: index,
                prepend: item.prepend,
                append: item.append,
              })
            }}
          />
        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={12}>
           <Input
              id="customId"
              value={value}
              type="text"
              placeholder="请输入手机号"
              onChange={e => this.setState({value: e.target.value})}
              prepend={prepend}
              append={append}
              style={{width: '250px'}}
            />
        </Col>
      </Row>
      
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
| prepend | 前置元素 | Element | - | - |
| append | 后置元素 | Element | - | - |

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

