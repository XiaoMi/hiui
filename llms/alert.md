# Alert 警告提示

作用于页面的内容区域的提示，非触发类信息

## 使用示例

### 基础用法

根据用户的操作进行页面级或模块、区块级的提示


```tsx
import React from 'react'
import Alert from '@hi-ui/alert' 
export const Basic = () => {
 return (
 <> 
 <div className="alert-basic__wrap">
 <Alert
 type="primary"
 title="信息提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="success"
 title="成功提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="danger"
 title="错误提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="warning"
 title="警示提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 </div>
 </>
 )
}

```


### 带内容

反馈给用户的信息较多，需要用户阅读更详细


```tsx
import React from 'react'
import Alert from '@hi-ui/alert'
import Button from '@hi-ui/button' 
export const Content = () => {
 return (
 <> 
 <div className="alert-basic__wrap">
 <Alert
 type="primary"
 title="信息提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="success"
 title="成功提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="danger"
 title="错误提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="warning"
 title="警示提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 </div>
 </>
 )
}

```


### 不可关闭

反馈信息较为重要，需要引导用户阅读或关注


```tsx
import React from 'react'
import Alert from '@hi-ui/alert' 
export const Closable = () => {
 return (
 <> 
 <div className="alert-closable__wrap">
 <Alert type="primary" title="信息提示的文案" closeable={false} />
 <br />
 <Alert type="success" title="成功提示的文案" closeable={false} />
 <br />
 <Alert type="danger" title="错误提示的文案" closeable={false} />
 <br />
 <Alert type="warning" title="警示提示的文案" closeable={false} />
 </div>
 </>
 )
}

```


### 倒计时自动关闭

倒计时自动关闭反馈信息在出现一定时间后自动关闭，不打扰。注：最大值不能超过 2^31-1


```tsx
import React from 'react'
import Alert from '@hi-ui/alert' 
export const Duration = () => {
 return (
 <> 
 <div className="alert-Duration__wrap">
 <Alert
 duration={1000}
 type="primary"
 title="信息提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 duration={2000}
 type="success"
 title="成功提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 duration={3000}
 type="danger"
 title="错误提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 duration={4000}
 type="warning"
 title="警示提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 </div>
 </>
 )
}

```


### Banner 公告


```tsx
import React from 'react'
import Alert from '@hi-ui/alert' 
export const Banner = () => {
 return (
 <> 
 <div className="alert-banner__wrap">
 <Alert
 showIcon={false}
 closeable={false}
 type="primary"
 title="信息提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 showIcon={false}
 closeable={false}
 type="success"
 title="成功提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 showIcon={false}
 closeable={false}
 type="danger"
 title="错误提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 showIcon={false}
 closeable={false}
 type="warning"
 title="警示提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 </div>
 </>
 )
}

```


### 自定义关闭按钮


```tsx
import React from 'react'
import Alert from '@hi-ui/alert' 
export const CloseIcon = () => {
 return (
 <> 
 <div className="alert-close-icon__wrap">
 <Alert
 type="primary"
 title="信息提示的文案"
 closeIcon={<span style={{ fontSize: 12 }}>Close</span>}
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 </div>
 </>
 )
}

```


### 轮播通知


```tsx
import React from 'react'
import { TextLoop } from 'react-text-loop-next'
import Marquee from 'react-fast-marquee'
import Alert from '@hi-ui/alert' 
export const Carousel = () => {
 return (
 <> 
 <div className="alert-Carousel__wrap">
 <Alert
 title={
 <TextLoop mask>
 <div>蒹葭苍苍，白露为霜。</div>
 <div>所谓伊人，在水一方。</div>
 <div>溯洄从之，道阻且长。</div>
 <div>溯游从之，宛在水中央。</div>
 <div>蒹葭凄凄，白露未晞。</div>
 </TextLoop>
 }
 />
 <br />
 <Alert
 title={
 <Marquee pauseOnHover gradient={false}>
 所谓伊人，在水之湄。溯洄从之，道阻且跻。溯游从之，宛在水中坻。蒹葭采采，白露未已。
 </Marquee>
 }
 />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import Alert from '@hi-ui/alert'
import Button from '@hi-ui/button' 
export const Size = () => {
 return (
 <> 
 <div className="alert-size__wrap">
 <h2>lg</h2>
 <Alert
 type="primary"
 title="信息提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="primary"
 title="信息提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <h2>md</h2>
 <Alert
 type="primary"
 size={'md'}
 title="信息提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="primary"
 size={'md'}
 title="信息提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <h2>sm</h2>
 <Alert
 type="primary"
 size={'sm'}
 title="信息提示的文案"
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
 <br />
 <Alert
 type="primary"
 size={'sm'}
 title="信息提示的文案"
 content={
 <div>
 <div style={{ marginBottom: 4 }}>文字说明文字说明文字说明</div>
 <Button type="primary" appearance="link">
 操作按钮
 </Button>
 </div>
 }
 onClose={() => {
 console.log('alert关闭回调')
 }}
 />
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
import Alert from '@hi-ui/alert' 
export const Semantic = () => {
 const [selected, setSelected] = useState<
 'root' | 'icon' | 'message' | 'title' | 'content' | 'close'
 >()

 return (
 <> 
 <div className="alert-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Alert
 classNames={{
 root: 'my-alert__root',
 icon: 'my-alert__icon',
 message: 'my-alert__message',
 title: 'my-alert__title',
 content: 'my-alert__content',
 close: 'my-alert__close',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 title="信息提示的文案"
 content={<div>文字说明文字说明文字说明</div>}
 />
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
 title: 'icon',
 description: '图标元素',
 },
 {
 title: 'message',
 description: '消息区域',
 },
 {
 title: 'title',
 description: '标题元素',
 },
 {
 title: 'content',
 description: '内容元素',
 },
 {
 title: 'close',
 description: '关闭按钮',
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

### Alert Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ------------------------ | --------------------------- | ----------------------------------------------- | ------------------ |
| type | 警告提示类型 | AlertTypeEnum | "primary" \| "warning" \| "danger" \| "success" | "primary" |
| title *(required)* | 警告提示标题 | ReactNode | - | - |
| content | 警告提示内容 | ReactNode | - | - |
| closeable | 是否可关闭 | boolean | true \| false | true |
| duration | 自动关闭时间，单位为毫秒 | number | - | -1 |
| onClose | 关闭事件触发时的回调 | (() => void) | - | - |
| closeIcon | 自定义关闭 Icon | ReactNode | - | \<CloseOutlined /> |
| showIcon | 是否显示提示图标 | boolean | true \| false | true |
| size | 设置尺寸 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |
| classNames | | AlertSemanticClassNames | - | - |
| styles | | AlertSemanticStyles | - | - |

