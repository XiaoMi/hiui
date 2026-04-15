# Result 结果

用于反馈一系列操作任务的处理结果。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Result from '@hi-ui/result' 
export const Basic = () => {
 return (
 <> 
 <div className="result-basic__wrap">
 <Result title="我是标题" content="我是结果信息的说明文案"></Result>
 </div>
 </>
 )
}

```


### 不同类型

默认有通知、成功、错误、警告四种类型


```tsx
import React from 'react'
import Result from '@hi-ui/result' 
export const Type = () => {
 return (
 <> 
 <div className="result-type__wrap">
 <Result type="info" title="这是一条常规信息" content="这是对常规信息的说明文案" />
 <Result type="success" title="这是一条成功信息" content="这是对成功信息的说明文案" />
 <Result type="warning" title="这是一条警示信息" content="这是对警示信息的说明文案" />
 <Result type="error" title="这是一条错误信息" content="这是对错误信息的说明文案" />
 </div>
 </>
 )
}

```


### 带按钮

通过 `children` 配置补充的操作或建议提示


```tsx
import React from 'react'
import Result from '@hi-ui/result'
import Button from '@hi-ui/button'
import { EMPTY_STATE_IMAGE_NO_NETWORK } from '@hi-ui/empty-state' 
export const Complete = () => {
 return (
 <> 
 <div className="result-basic__wrap">
 <Result
 image={<img src={EMPTY_STATE_IMAGE_NO_NETWORK} />}
 title="网络连接失败"
 content="这是对网络连接失败的说明文案"
 >
 <div>
 {[
 <Button key="refresh" appearance="line">
 刷新
 </Button>,
 <Button type="primary" key="back">
 返回
 </Button>,
 ]}
 <div
 style={{
 whiteSpace: 'pre-wrap',
 marginTop: '30px',
 padding: '30px',
 background: '#f2f4f7',
 boxSizing: 'border-box',
 fontSize: '14px',
 color: '#1F2733',
 textAlign: 'left',
 }}
 >
 <div>请尝试：</div>
 <div>1. 检查您的电脑网络是否正常</div>
 <div>2. 关闭 Wi-Fi 重新链接</div>
 </div>
 </div>
 </Result>
 </div>
 </>
 )
}

```


### 自定义指示器

通过 `image` 完全自定义指示器，可以是 img 标签


```tsx
import React from 'react'
import Result from '@hi-ui/result'
import Button from '@hi-ui/button'
import {
 EMPTY_STATE_IMAGE_NO_NETWORK,
 EMPTY_STATE_IMAGE_NO_ACCESS,
 EMPTY_STATE_IMAGE_404,
 EMPTY_STATE_IMAGE_SERVICE_ERROR,
} from '@hi-ui/empty-state' 
export const Custom = () => {
 return (
 <> 
 <div className="result-basic__wrap">
 <Result
 image={<img src={EMPTY_STATE_IMAGE_NO_NETWORK} />}
 title="网络连接失败"
 content="这是对网络连接失败的说明文案"
 children={[
 <Button key="refresh">刷新</Button>,
 <Button type="primary" key="back">
 返回
 </Button>,
 ]}
 />
 <Result
 image={<img src={EMPTY_STATE_IMAGE_NO_ACCESS} />}
 title="暂无权限"
 content="这是对暂无权限的说明文案"
 children={[
 <Button key="refresh">立即申请</Button>,
 <Button type="primary" key="back">
 返回
 </Button>,
 ]}
 />
 <Result
 image={<img src={EMPTY_STATE_IMAGE_404} />}
 title="404"
 content="抱歉，请求资源不存在！"
 children={<Button type="primary">返回首页</Button>}
 />
 <Result
 image={<img src={EMPTY_STATE_IMAGE_SERVICE_ERROR} />}
 title="500"
 content="抱歉，服务器开小差了！"
 children={<Button type="primary">刷新</Button>}
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
import Result, { ResultSemanticName } from '@hi-ui/result'
import Button from '@hi-ui/button' 
export const Semantic = () => {
 const [selected, setSelected] = useState<ResultSemanticName>()

 return (
 <> 
 <div className="result-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Result
 type="success"
 title="操作成功"
 content="内容已提交，请耐心等待审核"
 children={[<Button key="back">返回</Button>]}
 classNames={{
 root: 'my-result__root',
 image: 'my-result__image',
 title: 'my-result__title',
 content: 'my-result__content',
 children: 'my-result__children',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'image', description: '图标/图片容器' },
 { title: 'title', description: '标题' },
 { title: 'content', description: '内容' },
 { title: 'children', description: '底部区域' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as ResultSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### Result Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ------------------------------------------ | ------------------------ | ------------------------------------------- | ------ |
| image | 自定义图标、图片 | ReactNode | - | - |
| imageSize | 自定义图标/图片尺寸 | ResultImageSizeEnum | "sm" \| "md" \| "lg" | - |
| type | 结果类型，默认有通知、成功、错误、警告四种 | ResultTypeEnum | "info" \| "success" \| "warning" \| "error" | "info" |
| title *(required)* | 提示标题 | ReactNode | - | - |
| content | 提示内容 | ReactNode | - | - |
| classNames | | ResultSemanticClassNames | - | - |
| styles | | ResultSemanticStyles | - | - |

