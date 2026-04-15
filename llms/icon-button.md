# IconButton 图标按钮

带有图标的按钮。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import IconButton from '@hi-ui/icon-button'
import { CloseOutlined } from '@hi-ui/icons' 
export const Basic = () => {
 return (
 <> 
 <div className="icon-button-basic__wrap">
 <IconButton icon={<CloseOutlined />} />
 <br />
 <br />
 <IconButton icon={<CloseOutlined />} active />
 <br />
 <br />
 <IconButton icon={<CloseOutlined />} effect />
 <br />
 <br />
 <IconButton icon={<CloseOutlined />} effect active />
 <br />
 <br />
 测试
 <IconButton icon={<CloseOutlined />} effect />
 文档流空间是否占用
 </div>
 </>
 )
}

```


## Props

### IconButton Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------------- | ----------------------------------------- | --------- | ------------- | ------ |
| icon *(required)* | icon 图标 | ReactNode | - | - |
| active | 是否被激活 | boolean | true \| false | false |
| virtualArea | 扩大点击区域 | boolean | true \| false | true |
| effect | 是否开启 hover 和 focus 展示底色变化效果 | boolean | true \| false | false |
| disabled | 是否禁用 | boolean | true \| false | false |
| effectColor | 鼠标悬浮时的颜色 | string | - | - |

