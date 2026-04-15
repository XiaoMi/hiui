# Space 间距器

快速调节元素之间的间距。

## 使用示例

### 基础用法

包裹目标元素们并使它们产生间距


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button' 
export const Basic = () => {
 return (
 <> 
 <div className="space-basic__wrap">
 <Space>
 <Button type="primary">Button1</Button>
 <Button>Button2</Button>
 <Button>Button3</Button>
 <Button>Button4</Button>
 </Space>
 </div>
 </>
 )
}

```


### 垂直排列

通过 direction 设置元素排版方向，支持垂直间距


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button' 
export const Direction = () => {
 return (
 <> 
 <div className="space-basic__wrap">
 <Space direction="column" size="lg">
 <Button type="primary">Button1</Button>
 <Button>Button2</Button>
 <Button>Button3</Button>
 </Space>
 </div>
 </>
 )
}

```


### 对齐方式

自定义元素之间的对齐方式，默认是居中


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Avatar from '@hi-ui/avatar'
import Button from '@hi-ui/button' 
export const Align = () => {
 return (
 <> 
 <div className="space-basic__wrap">
 <Space size={10}>
 <Space align="flex-start" size="md" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 size="lg"
 />
 <span>start</span>
 <Button type="primary">button</Button>
 </Space>
 <Space align="center" size="md" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 size="lg"
 />
 <span>center</span>
 <Button type="primary">button</Button>
 </Space>
 <Space align="flex-end" size="md" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 size="lg"
 />
 <span>end</span>
 <Button type="primary">button</Button>
 </Space>
 </Space>
 </div>
 </>
 )
}

```


### 不同大小

通过 size 设置间距大小，默认为小号


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button' 
export const Size = () => {
 return (
 <> 
 <div className="space-size__wrap">
 <h2>sm</h2>
 <Space size="sm">
 <Button type="primary">Button1</Button>
 <Button>Button2</Button>
 <Button>Button3</Button>
 <Button>Button4</Button>
 </Space>
 <h2>md</h2>
 <Space size="md">
 <Button type="primary">Button1</Button>
 <Button>Button2</Button>
 <Button>Button3</Button>
 <Button>Button4</Button>
 </Space>
 <h2>lg</h2>
 <Space size="lg">
 <Button type="primary">Button1</Button>
 <Button>Button2</Button>
 <Button>Button3</Button>
 <Button>Button4</Button>
 </Space>
 </div>
 </>
 )
}

```


### 自定义间距大小

通过 size 设置数字开启自定义间距的大小，也支持数组分别设置纵横向间距


```tsx
import React, { useState } from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button'
import Counter from '@hi-ui/counter'
import Switch from '@hi-ui/switch' 
export const AutoSize = () => {
 const [size, setSize] = useState(8)
 const [checked, setChecked] = useState(false)
 const nextSize = checked ? [size * 2, size] : size

 return (
 <> 
 <div className="space-basic__wrap">
 <Space direction="column" align="flex-start" size={12}>
 <div>是否同时设置2倍于横向间距的纵向间距</div>
 <Switch checked={checked} onChange={(checked) => setChecked(checked)} />

 <div>间距调整</div>
 <Counter value={size} min={0} onChange={(v) => setSize(v)} />

 <Space size={nextSize}>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 <Button>HiUI Button</Button>
 </Space>
 </Space>
 </div>
 </>
 )
}

```


### 分隔符

通过 separator 自定义分隔符


```tsx
import React from 'react'
import Space from '@hi-ui/space'
import Button from '@hi-ui/button'
import { RightOutlined } from '@hi-ui/icons' 
export const Split = () => {
 return (
 <> 
 <div className="space-basic__wrap">
 <Space separator={<RightOutlined />} align="center">
 <Button type="primary" appearance="link">
 button
 </Button>
 <Button type="primary" appearance="link">
 button
 </Button>
 <Button type="primary" appearance="link">
 button
 </Button>
 <Button type="primary" appearance="link">
 button
 </Button>
 </Space>
 </div>
 </>
 )
}

```


## Props

### Space Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | -------------------------------------------------- | ------------------ | ---------------------------------------------------- | -------- |
| inline | 是否设置盒模型为内联模式 | boolean | true \| false | true |
| align | 当前轴的对齐方式 | SpaceAlignEnum | "flex-start" \| "flex-end" \| "center" \| "baseline" | "center" |
| direction | 设置轴方向，支持水平和纵向设置 | SpaceDirectionEnum | "row" \| "column" | "row" |
| size | 间距大小，推荐使用内置枚举尺寸，也可以设置具体数值 | SpaceSizeEnum | number \| "sm" \| "md" \| "lg" \| number\[] | "sm" |
| separator | 在每个元素之间插入自定义分隔符 | ReactNode | - | - |
| split | @deprecated 请使用 \`separator\` prop 替代 | ReactNode | - | - |
| wrap | 是否自动换行 | boolean | true \| false | true |

