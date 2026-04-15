# Avatar 头像

用来代表用户或事物，支持图片、图标或字符展示。

## 使用示例

### 基础用法

提供基础的默认头像


```tsx
import React from 'react'
import Avatar from '@hi-ui/avatar' 
export const Basic = () => {
 return (
 <> 
 <div
 className="avatar-basic__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
 >
 <Avatar bordered />
 </div>
 </>
 )
}

```


### 不同内容

支持在头像容器中放置不同的内容元素


```tsx
import React from 'react'
import Avatar from '@hi-ui/avatar'
import { EditOutlined, PlusOutlined } from '@hi-ui/icons' 
export const Content = () => {
 return (
 <> 
 <div
 className="avatar-content__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
 >
 <Avatar />
 <Avatar initials="M" />
 <Avatar icon={<PlusOutlined />} />
 <Avatar>
 <EditOutlined />
 </Avatar>
 <Avatar initials="HiUI" />
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" />
 <Avatar>
 <img
 alt="avatar"
 src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
 />
 </Avatar>
 </div>
 </>
 )
}

```


### 不同形状

通过 shape 指定头像的形状


```tsx
import React from 'react'
import Avatar from '@hi-ui/avatar' 
export const Shape = () => {
 return (
 <> 
 <div
 className="avatar-basic__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
 >
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="square"
 />
 </div>
 </>
 )
}

```


### 不同尺寸

默认支持 5 种头像标准尺寸，通过 size 设置


```tsx
import React from 'react'
import Avatar from '@hi-ui/avatar' 
export const Size = () => {
 return (
 <> 
 <div className="avatar-basic__wrap">
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 gap: 24,
 alignItems: 'center',
 marginBottom: 20,
 }}
 >
 <Avatar size="xs" />
 <Avatar size="sm" />
 <Avatar size="md" />
 <Avatar size="lg" />
 <Avatar size="xl" />
 </div>
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 gap: 24,
 alignItems: 'center',
 marginBottom: 20,
 }}
 >
 <Avatar initials="P" size="xs" />
 <Avatar initials="P" size="sm" />
 <Avatar initials="P" size="md" />
 <Avatar initials="P" size="lg" />
 <Avatar initials="P" size="xl" />
 </div>
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 gap: 24,
 alignItems: 'center',
 marginBottom: 20,
 }}
 >
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="xs" />
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="sm" />
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="md" />
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="lg" />
 <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="xl" />
 </div>
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 gap: 24,
 alignItems: 'center',
 marginBottom: 20,
 }}
 >
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="square"
 size="xs"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="square"
 size="sm"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="square"
 size="md"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="square"
 size="lg"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="square"
 size="xl"
 />
 </div>
 </div>
 </>
 )
}

```


### 自定义尺寸

通过 size 传入数值自定义头像大小


```tsx
import React from 'react'
import Avatar from '@hi-ui/avatar' 
export const CustomSize = () => {
 return (
 <> 
 <div
 className="avatar-custom-size__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
 >
 <Avatar size={20} initials="P" style={{ backgroundColor: '#237ffa' }} />
 <Avatar size={40} initials="P" style={{ backgroundColor: '#237ffa' }} />
 </div>
 </>
 )
}

```


### 自定义颜色

设置 style 自定义头像的背景色


```tsx
import React from 'react'
import Avatar from '@hi-ui/avatar' 
export const CustomColor = () => {
 return (
 <> 
 <div
 className="avatar-custom-color__wrap"
 style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
 >
 <Avatar style={{ backgroundColor: '#2660ff' }} />
 <Avatar style={{ backgroundColor: '#24b237' }} />
 <Avatar style={{ backgroundColor: '#ffbe0a' }} />
 <Avatar style={{ backgroundColor: '#04C2AC' }} />
 <Avatar style={{ backgroundColor: '#7F3DF2' }} />
 <Avatar style={{ backgroundColor: '#4545E6' }} />
 <Avatar style={{ backgroundColor: '#ABADB2' }} />
 </div>
 </>
 )
}

```


### 头像组

通过 AvatarGroup 包裹多个 Avatar 组件，可以实现头像组的效果


```tsx
import React from 'react'
import { EllipsisOutlined } from '@hi-ui/icons'
import Avatar from '@hi-ui/avatar' 
export const Group = () => {
 return (
 <> 
 <div className="avatar-group__wrap">
 <h4>基本用法</h4>
 <Avatar.Group maxCount={3}>
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 </Avatar.Group>

 <br />

 <h4>配置更多按钮</h4>
 <Avatar.Group
 maxCount={3}
 moreButton={{
 text: <EllipsisOutlined size={16} />,
 // style: { backgroundColor: '#74a2ff', color: '#fff' },
 }}
 >
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 </Avatar.Group>

 <br />

 <h4>配置更多头像弹窗</h4>
 <Avatar.Group
 maxCount={3}
 morePopover={{
 trigger: 'click',
 // content: <div>自定义更多头像展示方式</div>,
 style: { maxWidth: 420 },
 }}
 >
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 <Avatar
 src="https://avatars.githubusercontent.com/u/810438?v=4"
 initials="P"
 shape="circle"
 />
 </Avatar.Group>
 </div>
 </>
 )
}

```


## Props

### Avatar Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------------- | ------------------------------------ | ---------------------------------------------- | -------- |
| size | 头像尺寸 | number \| AvatarSizeEnum | number \| "xs" \| "sm" \| "md" \| "lg" \| "xl" | - |
| initials | 头像缩写字母 | ReactNode | - | - |
| shape | 设置形状 | "circle" \| "square" | "circle" \| "square" | "circle" |
| src | 头像 url | string | - | - |
| name | 头像名，用于语义化设置 | string | - | - |
| icon | 设置按钮图标 | ReactNode | - | - |
| srcSet | 针对 img 不同的屏幕分辨率来源地址设置 | string | - | - |
| onError | 针对 img 加载失败回调 | ReactEventHandler\<HTMLImageElement> | - | - |
| bordered | 是否带边框 | boolean | true \| false | false |

