<style scoped>
.hi-counter {
  margin: 0 4px;
}
</style>

## Counter 数字加减器

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
        max='10'
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

### Props

| 参数      | 说明             | 类型      | 可选值 | 默认值 |
| --------- | ---------------- | --------- | ------ | ------ |
| value     | 默认值           | number    | -      | -      |
| step      | 每次改变步数     | number    | -      | -      |
| min       | 最小值           | number    | -      | -      |
| max       | 最大值           | number    | -      | -      |
| disabled  | 是否禁用         | boolean   | -      | -      |
| className | 样式类名         | string    | -      | -      |
| onChange  | 点击加减号时触发 | (e:Event) | -      | -      |
