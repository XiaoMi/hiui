## Theme

The supported themes are detailed in the table below. The default is **hiui-blue**.

### Instructions

With `ThemeContext`, nested components can get the set theme via `props.theme`.

```js
import {ThemeContext} from '@hi-ui/hiui/es/context'

<ThemeContext.Provider value='hiui-blue'>
  <App/>
</ThemeContext.Provider>
```

### Supported language
:::demo

```run
render() {
  return (
    <Table columns={[
      { title: 'Theme', dataIndex: 'language'},
      { title: 'value', dataIndex: 'theme'}
    ]} data={[
      {language: 'blue', theme: 'hiui-blue'},
      {language: 'orange', theme: 'orange'},
      {language: 'cyan', theme: 'cyan'},
      {language: 'blue', theme: 'blue'},
      {language: 'purple', theme: 'purple'},
    ]} />
  )
}
```
:::

