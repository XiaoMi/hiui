## 主题切换

支持的主题详见下表，默认为hiui-blue

### 使用方法
使用ThemeContext，嵌套的组件可以通过props.theme获取到设置的主题
```js
import {ThemeContext} from '@hi-ui/hiui/es/context'

<ThemeContext.Provider value='hiui-blue'>
  <App/>
</ThemeContext.Provider>
```

### 支持的主题
:::demo

```run
render() {
  return (
    <Table columns={[
      { title: '主题', dataIndex: 'language'},
      { title: 'value', dataIndex: 'theme'}
    ]} data={[
      {language: '品牌蓝', theme: 'hiui-blue'},
      {language: '橙', theme: 'orange'},
      {language: '青', theme: 'cyan'},
      {language: '蓝', theme: 'blue'},
      {language: '紫', theme: 'purple'},
    ]} />
  )
}
```
:::

