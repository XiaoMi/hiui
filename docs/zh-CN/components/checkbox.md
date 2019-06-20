## Checkbox 多选框

### 基础

:::demo

```js
render() {
  return (
    <div>
      <Checkbox defaultChecked>默认勾选</Checkbox>
    </div>
  )
}
```

:::

### Checkbox Attributes

| 参数           | 说明         | 类型              | 可选值        | 默认值 |
| -------------- | ------------ | ----------------- | ------------- | ------ |
| checked        | 是否选中     | boolean           | true \| false | false  |
| defaultChecked | 是否默认选中 | boolean           | true \| false | false  |
| disabled       | 是否禁用     | boolean           | true \| false | false  |
| onChange       | 变化时的回调 | function(checked) | -             | -      |
