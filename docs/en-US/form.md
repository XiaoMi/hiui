## Form



### Align

:::demo 



```js

constructor() {
  super()

  this.state = {
    checkedIndex: 0,
    alignList: [
      {
        id: 'left',
        name: 'left align'
      },
      {
        id: 'right',
        name: 'right align'
      },
      {
        id: 'top',
        name: 'top align'
      },
    ],
    position: 'left'
  }
}


render(){
  const {position, checkedIndex} = this.state
  return (
    <div>
      <div>
        <Radio 
          list={this.state.alignList} 
          mode='button'
          checked={checkedIndex}
          onChange={(data, index) => {
            
            this.setState({
              position: data,
              checkedIndex: index
            })
          }}
        />
        <br />
        <br />
        <Form labelWidth="80" labelPosition={this.state.position}>
          <FormItem label={'name'}>
            <Input placeholder={'username'} />
          </FormItem>

          <FormItem label={'phone'}  >
            <Input placeholder={'phone'} />
          </FormItem>

          <FormItem>
            <Button type={'primary'}>submit</Button>
          </FormItem>
        </Form>
       </div>
    </div>
  )
}
```
:::

### Inline

:::demo 



```js

render(){
  return (
    <div>
      <div>
         <Form inline={true}>
            <FormItem label="username" labelWidth="80">
              <Input placeholder={'username'} />
            </FormItem>
            <FormItem label="password" labelWidth="80">
              <Input placeholder={'password'} />
            </FormItem>
            <FormItem>
              <Button type={'primary'}>submit</Button>
            </FormItem>
          </Form>
       </div>
    </div>
  )
}
```
:::

### Form Validation

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
          message: <span style={{color: '#ccc'}}>input name</span>,
          trigger: 'blur,change'
        }
      ],
      region: [
        {
          message: 'select area',
          trigger: 'change'
        }
      ],
      count: [
        {
          required: true,
          message: 'input count',
          trigger: 'change'
        },
        {
          validator: (rule, value, cb) => {
            const count = parseInt(value)
            if(isNaN(count)) {
              cb('please input count')
            } else if(count <= 0) {
              cb('must > 0')
            } else {
              cb()
            }
          },
          trigger: 'change'
        }
      ]
    }
  }
}

handleSubmit() {

  this.form.current.validate(valid => {
    if(valid) {
      console.log(this.state.form)
      alert('submit')
    } else {
      console.log('error')
      return false
    }
  })
}

handleChange(key, e, value, index) {
  console.log(key, value)
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
  const {form, checkedIndex} = this.state

  return (
    <div>
      <div>
         <Form ref={this.form} model={form} rules={this.state.rules} labelWidth="80">
            <FormItem label="Name" prop="name">
              <Input value={form.name} placeholder={'name'} onChange={this.handleChange.bind(this, 'name')}/>
            </FormItem>
            <FormItem label="Count" prop="count">
              <Input value={form.count} placeholder={'count'} onChange={this.handleChange.bind(this, 'count')}/>
            </FormItem>
            <FormItem label="Area" prop="region">
              <Radio 
                list={['Beijing', 'ShangHai', 'ChongQing']} 
                checked={checkedIndex}
                onChange={this.handleChange.bind(this, 'region','')}
              />
            </FormItem>
            <FormItem>
              <Button type={'primary'} onClick={this.handleSubmit.bind(this)}>Submit</Button>
            </FormItem>
          </Form>
       </div>
    </div>
  )
}
```
:::


### Form Attributes

| Attribute | Description | Type | Options | Default  |
| --- | ---  | --- | ---- | ---   |
| model | Form data | object  | - | - |
| rules | Form validation rule | object  | - | - |
| labelWidth | label width | string  | |
| labelPosition | label position | bool |right/left/top|right|
| inline | Whether it is arranged horizontally | bool | - | false|


### FormItem Attributes

| Attribute | Description | Type | Options | Default  |
| --- | ---  | --- | ---- | ---   |
| prop | model field  | string  | - | - |
| label | label text | string  | - | - |
| labelWidth | label width | string  | |
| required | required | bool  | - | false |


