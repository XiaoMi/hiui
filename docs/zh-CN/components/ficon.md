## Ficon 图标

Font Awesome 图标，同步自 HIUI 1.0，不建议使用。

### 基础用法

:::demo

icon 图标

```js
render () {
  return (
    <div>
      <i style={{margin: '0 10px'}} className='fa-warning' />
      <i style={{margin: '0 10px'}} className='fa-plus' />
      <i style={{margin: '0 10px'}} className='fa-copy' />
      <Ficon
        style={{margin: '0 10px'}}
        name='close'
      />
    </div>
  )
}
```
:::


### 嵌套用法

:::demo

icon 嵌套图标

```js
render () {
  return (
    <div>
      <Button type="primary" ghost
        style={{margin: '0 10px'}}
      >
        <i className='fa-close' />
      </Button>

      <Button type="primary" ghost
        style={{margin: '0 10px'}}
      >
        <Ficon name='copy' />
      </Button>
    </div>
  )
}
```
:::

### Attributes

| 参数 | 说明 | 类型 | 可选值 |默认值 |
| -------- | ----- | ---- | ---- | ---- |
| name | 图标名称 | string | ... | - |
| className | 自定义class |  string | - | - |
| style | 自定义style | {} | - | - |

> *更多图标名称点击参考 [FontAwesome](https://fontawesome.com/v4.7.0/icons/)
