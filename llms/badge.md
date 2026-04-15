# Badge 红点 / 徽标

红点用来展示新消息的提示，徽标用于展示消息的数量、提示

## 使用示例

### 基础用法

标识是否有新消息


```tsx
import React from 'react'
import Badge from '@hi-ui/badge'
import { Button } from '@hi-ui/button'
import { BellOutlined } from '@hi-ui/icons' 
export const Basic = () => {
 return (
 <> 
 <div className="badge-basic__wrap">
 <Badge type="dot">
 <Button type="default">最新报表</Button>
 </Badge>
 <br />
 <br />
 <Badge type="dot">
 <BellOutlined style={{ fontSize: '24px' }} />
 </Badge>
 </div>
 </>
 )
}

```


### 自定义角标内容


```tsx
import React from 'react'
import Badge from '@hi-ui/badge'
import { Button } from '@hi-ui/button'
import { BellFilled } from '@hi-ui/icons' 
export const Custom = () => {
 return (
 <> 
 <div className="badge-Custom__wrap">
 <Badge content={<BellFilled style={{ fontSize: 16, color: '#ff5959' }} />}>
 <Button type="default">最新报表</Button>
 </Badge>
 <br />
 <br />
 <Badge content={<BellFilled style={{ fontSize: 16, color: '#ff5959' }} />} />
 </div>
 </>
 )
}

```


### 徽标

标识消息数或简洁描述


```tsx
import React from 'react'
import Badge from '@hi-ui/badge'
import { BellOutlined } from '@hi-ui/icons' 
export const Bubble = () => {
 return (
 <> 
 <div className="badge-basic__wrap">
 <div>
 <Badge content={8} style={{ marginRight: 20 }}>
 <BellOutlined style={{ fontSize: '24px' }} />
 </Badge>
 <Badge content={'new'} style={{ marginRight: 20 }}>
 <BellOutlined style={{ fontSize: '24px' }} />
 </Badge>
 </div>
 </div>
 </>
 )
}

```


### 数值显示上限


```tsx
import React from 'react'
import Badge from '@hi-ui/badge'
import { Avatar } from '@hi-ui/avatar' 
export const Max = () => {
 return (
 <> 
 <div className="badge-max__wrap">
 <Badge content={2000} max={999}>
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" />
 </Badge>
 </div>
 </>
 )
}

```


### 独立使用


```tsx
import React from 'react'
import Badge from '@hi-ui/badge' 
export const Independent = () => {
 return (
 <> 
 <div className="badge-independent__wrap">
 <Badge type="dot" />
 <br />
 <br />
 <Badge content="16" />
 </div>
 </>
 )
}

```


### 位置偏移


```tsx
import React from 'react'
import Badge from '@hi-ui/badge'
import { Button } from '@hi-ui/button' 
export const Offset = () => {
 return (
 <> 
 <div className="badge-offset__wrap">
 <Badge type="dot" offset={[2, -2]}>
 <Button type="default">最新报表</Button>
 </Badge>
 <br />
 <br />
 <Badge content={8} offset={[4, -4]}>
 <Button type="default">最新报表</Button>
 </Badge>
 </div>
 </>
 )
}

```


### 自定义颜色


```tsx
import React from 'react'
import { Button } from '@hi-ui/button'
import Badge from '@hi-ui/badge' 
export const Color = () => {
 const colors = [
 'red',
 'yellow',
 'pink',
 'orange',
 'cyan',
 'blue',
 'green',
 'purple',
 'magenta',
 '#2db7f5',
 '#108ee9',
 ]

 return (
 <> 
 <div className="badge-Color__wrap">
 {colors.map((color) => (
 <div key={color}>
 <Badge color={color} content="new">
 <Button>按钮</Button>
 </Badge>
 <br />
 <br />
 </div>
 ))}
 </div>
 </>
 )
}

```


## Props

### Badge Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ---------------------------------------- | ---------------------------- | ----------------- | -------- |
| content | 气泡显示内容 | ReactNode | - | - |
| type | 气泡显示的形态，可选带文字的气泡或小红点 | BadgeTypeEnum | "dot" \| "bubble" | "bubble" |
| max | 气泡显示的最大值，超过值用'+'号替代 | number | - | 99 |
| visible | 是否显示气泡 | boolean | true \| false | true |
| color | 气泡颜色 | string | - | - |
| offset | 设置状态点的位置偏移 | \[left: number, top: number] | - | - |

