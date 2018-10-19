### confirm方法组件

:::demo 
```js
// import confirm from 'hiui/es/confirm'

confirm({
    tip: '确定删除吗',
    onOk:function () {
      console.log(that.state)
      alert('确认删除')
    },
    onCancel:function () {
      alert('取消删除')
    }
})
```
:::
