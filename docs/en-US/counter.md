<style scoped>
.hi-counter {
  margin: 0 4px;
}
</style>
## Counter

### Basic

:::demo

```js
constructor() {
  super()
  this.state = {
    disabled: false
  }
}
render() {
  return (
    <div>
      <Counter
        value='4'
        step='1'
        min='-10'
        max='8'
        onChange={(val) => console.log('changed value:', val)}
      />

      <Counter
        value='8888'
        step='2'
        min='2'
        max='8'
        disabled={this.state.disabled}
        onChange={(e, val) => {console.log('changed value:', e, val)}}
      />
    </div>
  )
}
```
:::


### Counter Attributes
 
| Attribute | Description | Type | Options | Default  |
| -------- | ----- | ---- | ---- | ---- |
| value | Default value | string / number | - |
| step | Step value | number | - |
| min | Min value | number | - |
| max | Max value | number | - |
| disabled | Whether to disable | boolean | - |
| className | string | - | - |


### Counter Events

| Attribute | Description | Callback params |
| -------- | ----- | ---- |
| onChange | Triggered when clicking plus or minus | (event: Event, value: Original value) |
