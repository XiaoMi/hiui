# Loading 动效加载

用于请求和数据加载成功的中间状态，缓冲用户的等待焦虑。

## 使用示例

### 基础用法

耐心等待，正拼力加载…


```tsx
import React from 'react'
import Loading from '@hi-ui/loading' 
export const Basic = () => {
 const loadingIdRef = React.useRef<any>(null)

 React.useEffect(() => {
 return () => {
 Loading.close(loadingIdRef.current)
 }
 }, [])

 return (
 <> 
 <div
 className="loading-basic__wrap"
 style={{ position: 'relative', width: 500, height: 300 }}
 >
 <Loading content="Loading..." delay={500}>
 <div
 style={{
 // width: 500,
 height: 300,
 boxSizing: 'border-box',
 background: '#f5f7fa',
 padding: 20,
 border: '20px solid #5f6a7a',
 }}
 ></div>
 </Loading>
 </div>
 </>
 )
}

```


### 文案位置


```tsx
import React from 'react'
import Loading from '@hi-ui/loading' 
export const ContentPosition = () => {
 const loadingIdRef = React.useRef<any>(null)

 React.useEffect(() => {
 return () => {
 Loading.close(loadingIdRef.current)
 }
 }, [])

 return (
 <> 
 <div
 className="loading-content-position__wrap"
 style={{ position: 'relative', width: 500, height: 300 }}
 >
 <Loading visible size="sm" content="Loading..." contentPosition="right">
 <div
 style={{
 // width: 500,
 height: 300,
 boxSizing: 'border-box',
 background: '#f5f7fa',
 padding: 20,
 border: '20px solid #5f6a7a',
 }}
 />
 </Loading>
 </div>
 </>
 )
}

```


### API调用


```tsx
import React from 'react'
import Loading from '@hi-ui/loading'
import Button from '@hi-ui/button' 
export const Duration = () => {
 const loadingIdRef = React.useRef<any>(null)

 React.useEffect(() => {
 return () => {
 Loading.close(loadingIdRef.current)
 }
 }, [])

 return (
 <> 
 <div className="loading-duration__wrap">
 <Button
 onClick={() => {
 loadingIdRef.current = Loading.open(undefined, { duration: 3000 })
 }}
 >
 Awake by API
 </Button>
 </div>
 </>
 )
}

```


### 局部容器加载


```tsx
import React from 'react'
import Loading from '@hi-ui/loading' 
export const Visible = () => {
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div
 className="loading-visible__wrap"
 style={{ position: 'relative', width: 500, height: 300 }}
 >
 <Loading visible={visible} content="Loading..." delay={500}>
 <div
 onClick={() => {
 setVisible((prev) => !prev)
 }}
 style={{
 width: 500,
 height: 300,
 boxSizing: 'border-box',
 background: '#f5f7fa',
 padding: 20,
 border: '20px solid #5f6a7a',
 }}
 />
 </Loading>
 </div>
 </>
 )
}

```


### 无蒙层


```tsx
import React from 'react'
import Loading from '@hi-ui/loading' 
export const Mask = () => {
 const loadingIdRef = React.useRef<any>(null)

 React.useEffect(() => {
 return () => {
 Loading.close(loadingIdRef.current)
 }
 }, [])

 return (
 <> 
 <div className="loading-mask__wrap" style={{ position: 'relative', width: 500, height: 300 }}>
 <Loading content="Loading..." delay={500} showMask={false}>
 <div
 style={{
 width: 500,
 height: 300,
 boxSizing: 'border-box',
 background: '#f5f7fa',
 padding: 20,
 border: '20px solid #5f6a7a',
 }}
 />
 </Loading>
 </div>
 </>
 )
}

```


### 设置加载类型


```tsx
import React from 'react'
import Loading from '@hi-ui/loading' 
export const Type = () => {
 return (
 <> 
 <div
 className="loading-basic__wrap"
 style={{ position: 'relative', width: 500, height: 300 }}
 >
 <Loading type="dot">
 <div
 style={{
 width: 500,
 height: 300,
 boxSizing: 'border-box',
 background: '#f5f7fa',
 padding: 20,
 border: '20px solid #5f6a7a',
 }}
 />
 </Loading>
 </div>
 </>
 )
}

```


### 加载提示

与 Message 结合使用


```tsx
import React from 'react'
import Button from '@hi-ui/button'
import message from '@hi-ui/message'
import Spinner from '@hi-ui/spinner' 
export const WithToast = () => {
 const [loading, setLoading] = React.useState(false)

 const handleSubmit = () => {
 setLoading(true)
 setTimeout(() => {
 setLoading(false)
 }, 5000)
 }

 return (
 <> 
 <div className="loading-with-toast__wrap" style={{ position: 'relative' }}>
 <Button
 type="primary"
 loading={loading}
 onClick={() => {
 handleSubmit()
 message.open({
 duration: 5000,
 icon: <Spinner size="sm" />,
 title: '数据提交中，请勿关闭页面',
 })
 }}
 >
 Submit
 </Button>
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Loading from '@hi-ui/loading' 
export const Semantic = () => {
 const [selected, setSelected] = useState<
 'root' | 'mask' | 'content-wrapper' | 'icon' | 'content' | 'wrapper'
 >()

 return (
 <> 
 <div className="loading-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <div style={{ position: 'relative', width: 500, height: 300 }}>
 <Loading
 classNames={{
 root: 'my-loading__root',
 mask: 'my-loading__mask',
 icon: 'my-loading__icon',
 content: 'my-loading__content',
 wrapper: 'my-loading__wrapper',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 content="Loading..."
 >
 <div
 style={{
 height: 300,
 boxSizing: 'border-box',
 background: '#f5f7fa',
 padding: 20,
 border: '20px solid #5f6a7a',
 }}
 ></div>
 </Loading>
 </div>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 {
 title: 'root',
 description: '根元素',
 },
 {
 title: 'mask',
 description: '蒙层元素',
 },
 {
 title: 'wrapper',
 description: '包裹器元素',
 },
 {
 title: 'icon',
 description: '图标元素',
 },
 {
 title: 'content',
 description: '内容元素',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as any)
 }}
 onMouseLeave={() => {
 setSelected(undefined)
 }}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### Loading Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------- | ---------------------------------------- | ------------------------- | --------------------------- | ------ |
| content | 自定义加载中状态的文案 | ReactNode | - | - |
| contentPosition | 设置加载中状态的文案位置 | "right" \| "bottom" | "right" \| "bottom" | - |
| visible | 是否开启显示 | boolean | true \| false | - |
| full | 是否全屏展示，开启节点将挂载到 body | boolean | true \| false | - |
| delay | 延迟显示加载效果的时长（可用于防止闪烁） | number | - | - |
| size | 设置尺寸 | LoadingSizeEnum | Omit\<HiBaseSizeEnum, "xs"> | - |
| color | 设置颜色，仅在 type 为 spin 时有效 | Color | - | - |
| type | loading 效果类型 | "dot" \| "spin" | "dot" \| "spin" | - |
| showMask | 设置蒙层 | boolean | true \| false | - |
| wrapperClassName | 设置包裹器类名 | string | - | - |
| wrapperStyle | 设置包裹器样式 | CSSProperties | - | - |
| classNames | | LoadingSemanticClassNames | - | - |
| styles | | LoadingSemanticStyles | - | - |


## Methods

### Loading.open(target, { content, size, duration, autoClose })

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | --------------------------------------------- | ------------------- | -------------------- | ------ |
| target | 需要 `Loading` 遮罩的元素, 当不传时为全屏遮罩 | HTMLElement \| null | - | - |
| content | 自定义加载中状态的文案 | ReactNode | - | - |
| duration | loading 自动关闭的时间，单位为毫秒 | number | - | - |
| size | loading 的尺寸 | LoadingSizeEnum | 'lg' \| 'md' \| 'sm' | 'md' |
| autoClose | 是否开启 loading 自动关闭 | boolean | true \| false | - |

### Loading.close(key)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ------------------------------------ | ------ | ------ | ------ |
| key | open 方法返回的 Loading 实例唯一标识 | string | - | - |
