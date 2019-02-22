<style scoped>
.hi-counter {
  margin: 0 4px;
}
</style>
## Counter数字加减器

### 基础

:::demo

Counter 组件

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
        onChange={(val) => console.log('变化后的值：', val)}
      />

      <Counter
        value='8888'
        step='2'
        min='2'
        max='8'
        disabled={this.state.disabled}
        onChange={(e, val) => {console.log('----val', e, val)}}
      />
    </div>
  )
}
```
:::


### Counter Attributes
 
| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| value | 默认值 | string / number | - |
| step | 每次改变步数 | number | - |
| min | 最小值 | number | - |
| max | 最大值 | number | - |
| disabled | 是否禁用 | boolean | - |
| className | string | - | - |


### Counter Events

| 参数 | 说明 | 回调参数 |
| -------- | ----- | ---- |
| onChange | 点击加减号时触发 | (event: Event, value: 原始值) |
