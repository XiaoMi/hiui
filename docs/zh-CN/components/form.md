## Form 表单组件

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
  const { position, alignCheckedIndex, columnCheckedIndex } = this.state
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
            <FormItem label='姓名'>
              <Input placeholder='username' />
            </FormItem>
            <FormItem label='手机号码' >
              <Input placeholder='phone' />
            </FormItem>
            <FormItem>
              <Button type='primary'>提交</Button>
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
constructor() {
  super()
  this.state = {
    singleList: [
			{ name:'电视', id:'3' },
			{ name:'手机', id:'2' },
			{ name:'笔记本', id:'4' },
			{ name:'生活周边', id:'5' },
			{ name:'办公', id:'6' },
		]
  }
}

render(){
  return (
    <Form inline>
      <FormItem>
        <Input placeholder='请输入关键字' />
      </FormItem>
      <FormItem>
        <Select placeholder='请选择类型' list={this.state.singleList} />
      </FormItem>
      <FormItem>
        <DatePicker 
          placeholder={['开始日期', '结束日期']}
          type='daterange'
          minDate={new Date()}
          maxDate={new Date().getTime() + 3600000 * 24 * 30}
        />
      </FormItem>
      <FormItem>
        <Button type='primary'>筛选</Button>
      </FormItem>
    </Form>
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
      count: '',
      date: undefined
    },
    rules: {
      name: [
        {
          required: true,
          message: <span><Icon name="close-circle"/>  请输入名称</span>,
          trigger: 'onBlur,onChange'
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
      ],
      region: [
        {
          required: true,
          type: 'number',
          message: '请选择区域',
          trigger: 'onChange'
        }
      ],
      date: [
        {
          required: true,
          type: 'date',
          message: '请选择日期',
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
      count: '',
      date: undefined
    }
  })
  this.form.resetValidates()
}

handleChange(key, e, value) {
  this.setState({
    form: Object.assign({}, this.state.form, {[key]: value})
  })
}

render(){
  const Row = Grid.Row
  const Col = Grid.Col
  const { form } = this.state
  return (
    <Col span={12}>
      <Form ref={node => this.form = node} model={form} rules={this.state.rules} labelWidth='80'>
          <FormItem label='名称' prop='name'>
            <Input value={form.name} placeholder='name' onChange={this.handleChange.bind(this, 'name')}/>
          </FormItem>
          <FormItem label='数量' prop='count'>
            <Input value={form.count} placeholder='count' onChange={this.handleChange.bind(this, 'count')}/>
          </FormItem>
          <FormItem label='时间' prop='date'>
            <DatePicker
              value={form.date}
              onChange={this.handleChange.bind(this, 'date', null)}
            />
          </FormItem>
          <FormItem label='地区' prop='region'>
            <Radio
              list={[{
                name: '北京',
                id: 1
              }, {
                name: '上海',
                id: 2
              }, {
                name: '武汉',
                id: 3
              }]}
              onChange={this.handleChange.bind(this, 'region', null)}
            />
          </FormItem>
          <FormItem>
            <Button type='primary' onClick={this.handleSubmit.bind(this)}>提交</Button>
            <Button onClick={this.cancelSubmit.bind(this)}>重置</Button>
          </FormItem>
      </Form>
    </Col>
  )
}
```

:::

### Form Attributes

| 参数          | 说明         | 类型    | 可选值               | 默认值 |
| ------------- | ------------ | ------- | -------------------- | ------ |
| model         | 表单数据     | object  | -                    | -      |
| rules         | 表单验证规则 | object  | -                    | -      |
| labelWidth    | label 宽度   | string  | -                    | -      |
| labelPosition | label 位置   | string  | right \| left \| top | right  |
| inline        | 是否横向排列 | boolean | true \| false        | false  |

### FormItem Attributes

| 参数       | 说明              | 类型    | 可选值        | 默认值 |
| ---------- | ----------------- | ------- | ------------- | ------ |
| prop       | 表单域 model 字段 | string  | -             | -      |
| label      | 标签文本          | string  | -             | -      |
| labelWidth | label 宽度        | string  | -             | -      |
| required   | 是否必填          | boolean | true \| false | false  |

### Form Methods

| 方法名                        | 说明               | 回调参数                                 |
| ----------------------------- | ------------------ | ---------------------------------------- |
| validate(callback)            | 对整个表单进行校验 | (valid: boolean) => void                 |
| validateField(prop, callback) | 对表单字段进行校验 | (prop: string, (valid: boolean) => void) |
| resetValidates()              | 重置整个表单的验证 | -                                        |
