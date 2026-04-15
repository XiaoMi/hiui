# LocaleContext 语言上下文

语言设置上下文。

## 使用示例

### 基础用法


```tsx
import React, { useContext } from 'react'
import { LocaleContext } from '@hi-ui/locale-context' 
export const Basic = () => {
 const i18n = useContext(LocaleContext)

 return (
 <> 
 <div className="locale-context-basic__wrap">{i18n.get('datePicker.ok')}</div>
 </>
 )
}

```


## Props

### getLanguage Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------------------- | ---- | -------------------- | ------ | ------ |
| timePicker *(required)* | | Record\<string, any> | - | - |
| datePicker *(required)* | | Record\<string, any> | - | - |
| pagination *(required)* | | Record\<string, any> | - | - |
| cascader *(required)* | | Record\<string, any> | - | - |
| checkCascader *(required)* | | Record\<string, any> | - | - |
| select *(required)* | | Record\<string, any> | - | - |
| selectTree *(required)* | | Record\<string, any> | - | - |
| search *(required)* | | Record\<string, any> | - | - |
| transfer *(required)* | | Record\<string, any> | - | - |
| upload *(required)* | | Record\<string, any> | - | - |
| modal *(required)* | | Record\<string, any> | - | - |
| tabs *(required)* | | Record\<string, any> | - | - |
| timeline *(required)* | | Record\<string, any> | - | - |
| form *(required)* | | Record\<string, any> | - | - |
| tree *(required)* | | Record\<string, any> | - | - |
| table *(required)* | | Record\<string, any> | - | - |
| watermark *(required)* | | Record\<string, any> | - | - |
| emptyState *(required)* | | Record\<string, any> | - | - |
| checkSelect *(required)* | | Record\<string, any> | - | - |
| treeSelect *(required)* | | Record\<string, any> | - | - |
| checkTreeSelect *(required)* | | Record\<string, any> | - | - |
| picker *(required)* | | Record\<string, any> | - | - |
| zenMode *(required)* | | Record\<string, any> | - | - |
| popConfirm *(required)* | | Record\<string, any> | - | - |
| tag *(required)* | | Record\<string, any> | - | - |
| backTop *(required)* | | Record\<string, any> | - | - |
| menuSearch *(required)* | | Record\<string, any> | - | - |
| queryFilter *(required)* | | Record\<string, any> | - | - |


### LocaleProvider Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | ------------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| locale | 设置国际化 locale 地区标识 | LocaleEnum | "zh-CN" \| "zh-Hans" \| "en-US" \| "zh-HK" \| "zh-TW" \| "th-TH" \| "pt-PT" \| "pt-BR" \| "fr-FR" \| "de-DE" \| "es-ES" \| "it-IT" \| "nl-NL" \| "el-GR" \| "cs-CZ" \| "da-DK" \| "fi-FI" \| "tr-TR" \| "ja-JP" \| "ko-KR" \| "vi-VN" \| "hy-AM" \| "az-AZ" \| "ru-RU" \| "ka-GE" \| "uz-UZ" \| "bs-BA" \| "bg-BG" \| "ur-PK" | "zh-CN" |
| languages | 自定义语言包，将忽略内置语言包 locale 字段 | LocaleLanguage | - | - |

