## Form表单组件

### 对齐方式

:::demo 

```js
constructor() {
  super()

  this.state = {
    alignCheckedIndex: 0,
    alignList: [
      {
        id: 'left',
        name: '左对齐'
      },
      {
        id: 'right',
        name: '右对齐'
      },
      {
        id: 'top',
        name: '顶对齐'
      },
    ],
    columnCheckedIndex: 0,
    columnList: [
      {
        id: '12',
        name: 'S'
      },
      {
        id: '16',
        name: 'M'
      },
      {
        id: '20',
        name: 'L'
      },
    ],
    position: 'left',
    column: '12'
  }
}

render(){
  const {position, alignCheckedIndex, columnCheckedIndex} = this.state
  const Row = Grid.Row
  const Col = Grid.Col
  return (
    <div>
      <Row gutter={true}>
        <Col span={12}>

          <Radio
            list={this.state.alignList}
            mode='button'
            checked={alignCheckedIndex}
            onChange={(data, index) => {
              this.setState({
                position: data,
                alignCheckedIndex: index
              })
            }}
          />

        </Col>
        <Col span={12}>

          <Radio
            list={this.state.columnList}
            mode='button'
            checked={columnCheckedIndex}
            onChange={(data, index) => {
              this.setState({
                column: data,
                columnCheckedIndex: index
              })
            }}
          />

        </Col>
      </Row>
      <Row gutter={true}>
        <Col span={this.state.column}>

          <Form labelWidth='80' labelPosition={this.state.position}>
            <FormItem label={'姓名'}>
              <Input placeholder={'username'} />
            </FormItem>

            <FormItem label={'手机号码'}  >
              <Input placeholder={'phone'} />
            </FormItem>

            <FormItem>
              <Button type={'primary'}>提交</Button>
            </FormItem>
          </Form>

        </Col>
      </Row>
    </div>
  )
}
```
:::

### 横向表单

:::demo 

```js
render(){
  return (
    <div>
      <div>
         <Form inline={true}>
            <FormItem label='账号' labelWidth='50'>
              <Input placeholder={'账号'} />
            </FormItem>
            <FormItem label='密码' labelWidth='50'>
              <Input type='password' placeholder={'密码'} />
            </FormItem>
            <FormItem>
              <Button type={'primary'}>提交</Button>
            </FormItem>
          </Form>
       </div>
    </div>
  )
}
```
:::

### 表单验证

:::demo

```js
constructor(props) {
  super(props)

  this.form = React.createRef()

  this.state = {
    form: {
      name: '',
      region: '',
      count: ''
    },
    checkedIndex: -1,
    rules: {
      name: [
        {
          required: true,
          message: <span style={{color: '#ccc'}}>请输入名称</span>,
          trigger: 'onBlur,onChange'
        }
      ],
      region: [
        {
          required: true,
          message: '请选择区域',
          trigger: 'onChange'
        }
      ],
      count: [
        {
          required: true,
          message: '请输入数量',
          trigger: 'onChange'
        },
        {
          validator: (rule, value, cb) => {
            const count = parseInt(value)
            if(isNaN(count)) {
              cb('请输入数字')
            } else if(count <= 0) {
              cb('必须是正数')
            } else {
              cb()
            }
          },
          trigger: 'onChange'
        }
      ]
    }
  }
}

handleSubmit() {
  this.form.validate(valid => {
    if(valid) {
      console.log(this.state.form)
      alert('submit')
    } else {
      console.log('error')
      return false
    }
  })
}

cancelSubmit() {
  this.setState({
    form: {
      name: '',
      region: '',
      count: ''
    }
  })
  this.form.resetValidates()
}

handleChange(key, e, value, index) {
  console.log('-----------handleChange', key, e, value, index)
  this.setState({
    form: Object.assign({}, this.state.form, {[key]: value})
  })

  if(index !== undefined) {
    this.setState({
      checkedIndex: index
    })
  }
}

render(){
  const Row = Grid.Row
  const Col = Grid.Col
  const {form, checkedIndex} = this.state

  return (
    <div>
      <Form ref={node => this.form = node} model={form} rules={this.state.rules} labelWidth='80'>
        <Row>
          <Col span={12}>

            <FormItem label='名称' prop='name'>
              <Input value={form.name} placeholder={'name'} onChange={this.handleChange.bind(this, 'name')}/>
            </FormItem>
            <FormItem label='数量' prop='count'>
              <Input value={form.count} placeholder={'count'} onChange={this.handleChange.bind(this, 'count')}/>
            </FormItem>
            <FormItem label='地区' prop='region'>
              <Radio
                list={['北京', '上海', '重庆']}
                checked={checkedIndex}
                onChange={this.handleChange.bind(this, 'region','')}
              />
            </FormItem>
            <FormItem>
              <Button type='primary' onClick={this.handleSubmit.bind(this)}>提交</Button>
              <Button onClick={this.cancelSubmit.bind(this)}>重置</Button>
            </FormItem>

          </Col>
        </Row>
      </Form>
    </div>
  )
}
```
:::


### Form Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值|
| --- | ---  | --- | ---- | ---   |
| model | 表单数据 | object  | - | - |
| rules | 表单验证规则 | object  | - | - |
| labelWidth | label宽度 | string  | |
| labelPosition | label位置 | bool |right/left/top|right|
| inline | 是否横向排列 | bool | - | false|


### FormItem Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值|
| --- | ---  | --- | ---- | ---   |
| prop | 表单域model字段 | string  | - | - |
| label | 标签文本 | string  | - | - |
| labelWidth | label宽度 | string  | |
| required | 是否必填 | bool  | - | false |


