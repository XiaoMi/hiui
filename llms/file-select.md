# FileSelect 文件选择器

用于选择文件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import FileSelect from '@hi-ui/file-select' 
export const Basic = () => {
 return (
 <> 
 <div className="file-select-basic__wrap">
 <FileSelect onSelect={console.log}>Upload</FileSelect>
 </div>
 </>
 )
}

```


## Props

### FileSelect Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | ------------------ | ----------------------------------- | --------------------------------- | ------ |
| className | 组件的注入选择器类 | string | - | - |
| style | 组件的注入样式 | CSSProperties | - | - |
| accept | 接受的上传文件类型 | string | - | - |
| disabled | 是否禁用 | boolean | true \| false | - |
| multiple | 是否支持批量上传 | boolean | true \| false | - |
| onSelect | 选择上传的事件 | ((files: FileList \| null) => void) | (files: FileList \| null) => void | - |
| children | 自定义触发器 | ReactNode | - | - |

