# Spinner 旋转动效

旋转动效组件。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Spinner from '@hi-ui/spinner' 
export const Basic = () => {
 return (
 <> 
 <div className="spinner-basic__wrap">
 <Spinner />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Spinner from '@hi-ui/spinner' 
export const Size = () => {
 return (
 <> 
 <div className="spinner-size__wrap">
 <Space size={20}>
 <Spinner size={12} />
 <Spinner size="sm" />
 <Spinner size="md" />
 <Spinner size="lg" />
 </Space>
 </div>
 </>
 )
}

```


## Props

### Spinner Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----- | ---- | ------------------------------------- | ------------------------------------- | ------ |
| size | 尺寸 | number \| Omit\<HiBaseSizeEnum, "xs"> | number \| Omit\<HiBaseSizeEnum, "xs"> | "md" |
| color | 颜色 | Color | - | - |

