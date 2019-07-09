## Checkbox

### Basic usage

:::demo

```js
constructor() {
  super()
  this.state = {
    checked: true
  }
}
render() {
  return (
    <React.Fragment>
      <Checkbox autoFocus>Checkbox</Checkbox>
      <Checkbox defaultChecked>Default checked</Checkbox>
    </React.Fragment>
  )
}
```

:::

### disabled

:::demo

```js
render() {
  return (
    <React.Fragment>
      <Checkbox disabled>Checkbox</Checkbox>
      <Checkbox defaultChecked disabled>Checkbox</Checkbox>
    </React.Fragment>
  )
}
```

:::

### Controlled

:::demo

```js
constructor() {
  super()
  this.state = {
    checked: true
  }
}
render() {
  return (
    <React.Fragment>
      <Checkbox checked={this.state.checked}>Controlled</Checkbox>
      <Button size='small' type='primary' onClick={() => {
        this.setState(({ checked }) => ({
          checked: !checked
        }))
      }}>Toggle</Button>
    </React.Fragment>
  )
}
```

:::

### Group

:::demo

```js
render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <CheckboxGroup
        name='strategy'
        data={['Smart Phone', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={console.log} />
      <p />
      <CheckboxGroup
        name='strategy'
        disabled
        data={['Smart Phone', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={console.log} />
    </React.Fragment>
  )
}
```

:::

### Controlled group

:::demo

```js
constructor() {
  super()
  this.state = {
    value: ['AI']
  }
}

render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <CheckboxGroup
        value={this.state.value}
        data={['Smart Phone', 'AI', 'IOT']}
        defaultValue={['AI', 'IOT']}
        onChange={value => {
          this.setState({ value })
        }} />
    </React.Fragment>
  )
}
```

:::

### Complex data

:::demo

```js
constructor() {
  super()
  this.data = [{
    label: 'Smart Phone',
    value: 0,
    disabled: true
  }, {
    label: 'AI',
    value: 1
  }, {
    label: 'IOT',
    value: 2
  }]
}

render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <CheckboxGroup
        data={this.data}
        defaultValue={[0]}
        onChange={console.log} />
    </React.Fragment>
  )
}
```

:::

### Check all

:::demo

```js
constructor() {
  super()
  this.data = ['Smart Phone', 'AI', 'IOT']
  this.state = {
    value: ['AI'],
    checkAll: false
  }
  this.getIndeterminate = () => {
    const len = this.state.value.length
    return len < 3 && len > 0
  }
  this.handleCheckAllChange = () => {
    const len = this.state.value.length
    if (len < 3) {
      this.setState({
        checkAll: true,
        value: this.data
      })
    } else {
      this.setState({
        checkAll: false,
        value: []
      })
    }
  }
  this.handleGroupChange = (value) => {
    this.setState({
      value,
      checkAll: value.length === 3
    })
  }
}

render() {
  const CheckboxGroup = Checkbox.Group
  return (
    <React.Fragment>
      <Checkbox
        indeterminate={this.getIndeterminate()}
        onChange={this.handleCheckAllChange}
        checked={this.state.checkAll}>Check all</Checkbox>
      <hr />
      <CheckboxGroup
        value={this.state.value}
        data={this.data}
        onChange={this.handleGroupChange} />
    </React.Fragment>
  )
}
```

:::

### Checkbox Attributes

| Attribute      | Description              | Type                       | Options       | Default |
| -------------- | ------------------------ | -------------------------- | ------------- | ------- |
| autoFocus      | wheather auto focus      | boolean                    | true \| false | false   |
| checked        | wheather checked         | boolean                    | true \| false | false   |
| className      | custom classname         | string                     | -             | -       |
| defaultChecked | wheather default checked | boolean                    | true \| false | false   |
| disabled       | wheather disabled        | boolean                    | true \| false | false   |
| indeterminate  | wheather indeterminate   | boolean                    | true \| false | false   |
| onChange       | change callback          | function(checked: boolean) | -             | -       |
| style          | custom styles            | CSSProperties              | -             | -       |

### Checkbox Group Attributes

| Attribute    | Description                                               | Type                                                                                      | Options       | Default |
| ------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------- | ------- |
| className    | custom classname                                          | string                                                                                    | -             | -       |
| data         | checked options                                           | Array<string \| number \| { label: string, value: string \| number, disabled?: boolean }> | -             | []      |
| defaultValue | default checked values                                    | Array<string \| number>                                                                   | -             | []      |
| disabled     | wheather disabled                                         | boolean                                                                                   | true \| false | false   |
| name         | `CheckboxGroup`'s `input[type="checkbox"]` name attribute | string                                                                                    | -             | -       |
| onChange     | change callback                                           | function(checkedList: Array<string \| number>)                                            | -             | -       |
| style        | custom styles                                             | CSSProperties                                                                             | -             | -       |
| value        | checked values                                            | Array<string \| number>                                                                   | -             | -       |
