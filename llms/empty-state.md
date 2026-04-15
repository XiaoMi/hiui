# EmptyState 空状态

指当前场景没有对应的数据内容，呈现出的一种状态。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import EmptyState from '@hi-ui/empty-state' 
export const Basic = () => {
 return (
 <> 
 <div className="empty-state-basic__wrap">
 <EmptyState />
 </div>
 </>
 )
}

```


### 不同尺寸


```tsx
import React from 'react'
import EmptyState from '@hi-ui/empty-state' 
export const Size = () => {
 return (
 <> 
 <div className="empty-state-size__wrap" style={{ display: 'flex', alignItems: 'center' }}>
 <EmptyState size={'sm'} />
 <EmptyState title="暂无数据" size={'md'} />
 <EmptyState title="暂无数据" size={'lg'} />
 </div>
 </>
 )
}

```


### 带内容


```tsx
import React from 'react'
import EmptyState from '@hi-ui/empty-state'
import { Button } from '@hi-ui/button' 
export const WithContent = () => {
 return (
 <> 
 <div className="empty-state-with-content__wrap">
 <EmptyState title="当前页面暂无数据">
 <Button type="primary">刷新</Button>
 </EmptyState>
 </div>
 </>
 )
}

```


### 自定义


```tsx
import React from 'react'
import EmptyState, {
 EMPTY_STATE_IMAGE_NO_RESULT,
 EMPTY_STATE_IMAGE_SERVICE_ERROR,
 EMPTY_STATE_IMAGE_NO_ACCESS,
 EMPTY_STATE_IMAGE_404,
 EMPTY_STATE_IMAGE_NO_OPEN,
 EMPTY_STATE_IMAGE_NO_NETWORK,
 EMPTY_STATE_IMAGE_NO_LAN,
} from '@hi-ui/empty-state' 
export const Custom = () => {
 return (
 <> 
 <div className="empty-state-custom__wrap">
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
 <EmptyState title="暂无搜索结果" indicator={EMPTY_STATE_IMAGE_NO_RESULT} />
 <EmptyState title="暂无权限" indicator={EMPTY_STATE_IMAGE_NO_ACCESS} />
 <EmptyState title="加载失败" indicator={EMPTY_STATE_IMAGE_SERVICE_ERROR} />
 <EmptyState title="页面不存在" indicator={EMPTY_STATE_IMAGE_404} />
 <EmptyState title="功能建设中" indicator={EMPTY_STATE_IMAGE_NO_OPEN} />
 <EmptyState title="网络连接失败" indicator={EMPTY_STATE_IMAGE_NO_NETWORK} />
 <EmptyState title="未连接内网" indicator={EMPTY_STATE_IMAGE_NO_LAN} />
 </div>
 </div>
 </>
 )
}

```


### 彩色图标


```tsx
import React from 'react'
import EmptyState, {
 EMPTY_STATE_IMAGE_NO_MESSAGE_COLORFUL,
 EMPTY_STATE_IMAGE_NO_RESULT_COLORFUL,
 EMPTY_STATE_IMAGE_NO_COLLECTION_COLORFUL,
 EMPTY_STATE_IMAGE_NO_ACCESS_COLORFUL,
 EMPTY_STATE_IMAGE_NO_NETWORK_COLORFUL,
 EMPTY_STATE_IMAGE_NO_OPEN_COLORFUL,
 EMPTY_STATE_IMAGE_404_COLORFUL,
 EMPTY_STATE_IMAGE_SERVICE_ERROR_COLORFUL,
 EMPTY_STATE_IMAGE_PAGE_ERROR_COLORFUL,
 EMPTY_STATE_IMAGE_SUCCESS_COLORFUL,
 EMPTY_STATE_IMAGE_ERROR_COLORFUL,
 EMPTY_STATE_IMAGE_WARNING_COLORFUL,
 EMPTY_STATE_IMAGE_NO_DATA_COLORFUL,
 EMPTY_STATE_IMAGE_JUMP_COLORFUL,
 EMPTY_STATE_IMAGE_CHART_NO_DATA_COLORFUL,
} from '@hi-ui/empty-state' 
export const Colorful = () => {
 return (
 <> 
 <div className="empty-state-colorful__wrap">
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: 32 }}>
 <EmptyState size="md" title="无权限" indicator={EMPTY_STATE_IMAGE_NO_ACCESS_COLORFUL} />
 <EmptyState size="md" title="无网络" indicator={EMPTY_STATE_IMAGE_NO_NETWORK_COLORFUL} />
 <EmptyState size="md" title="建设中" indicator={EMPTY_STATE_IMAGE_NO_OPEN_COLORFUL} />
 <EmptyState size="md" title="404" indicator={EMPTY_STATE_IMAGE_404_COLORFUL} />
 <EmptyState
 size="md"
 title="服务器失去链接"
 indicator={EMPTY_STATE_IMAGE_SERVICE_ERROR_COLORFUL}
 />
 <EmptyState
 size="md"
 title="页面出错"
 indicator={EMPTY_STATE_IMAGE_PAGE_ERROR_COLORFUL}
 />
 <EmptyState size="md" title="提交成功" indicator={EMPTY_STATE_IMAGE_SUCCESS_COLORFUL} />
 <EmptyState size="md" title="错误提示" indicator={EMPTY_STATE_IMAGE_ERROR_COLORFUL} />
 <EmptyState size="md" title="警告提示" indicator={EMPTY_STATE_IMAGE_WARNING_COLORFUL} />
 <EmptyState size="md" title="跳转" indicator={EMPTY_STATE_IMAGE_JUMP_COLORFUL} />
 <EmptyState
 size="md"
 title="无查询结果"
 indicator={EMPTY_STATE_IMAGE_NO_RESULT_COLORFUL}
 />
 <EmptyState size="md" title="暂无数据" indicator={EMPTY_STATE_IMAGE_NO_DATA_COLORFUL} />
 <EmptyState
 size="md"
 title="暂无收藏"
 indicator={EMPTY_STATE_IMAGE_NO_COLLECTION_COLORFUL}
 />
 <EmptyState size="md" title="无消息" indicator={EMPTY_STATE_IMAGE_NO_MESSAGE_COLORFUL} />
 <EmptyState
 size="md"
 title="无数据-图表类"
 indicator={EMPTY_STATE_IMAGE_CHART_NO_DATA_COLORFUL}
 />
 </div>
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
import EmptyState, { EmptyStateSemanticName } from '@hi-ui/empty-state' 
export const Semantic = () => {
 const [selected, setSelected] = useState<EmptyStateSemanticName>()

 return (
 <> 
 <div className="empty-state-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <EmptyState
 title="暂无数据"
 classNames={{
 root: 'my-empty-state__root',
 image: 'my-empty-state__image',
 title: 'my-empty-state__title',
 slot: 'my-empty-state__slot',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 <div>这里是自定义内容区域</div>
 </EmptyState>
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
 title: 'image',
 description: '图片/指示器元素',
 },
 {
 title: 'title',
 description: '标题元素',
 },
 {
 title: 'slot',
 description: '子内容插槽',
 },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => {
 setSelected(dataItem.title as EmptyStateSemanticName)
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

### EmptyState Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | --------------------------------------------- | ---------------------------- | --------------------------- | ------ |
| indicator | 指示器图标，如果是字符串将被设置为 Img 的 src | ReactNode | - | - |
| title | 空状态的标题 | ReactNode | - | - |
| size | 图标尺寸 | EmptyStateSizeEnum | Omit\<HiBaseSizeEnum, "lg"> | - |
| classNames | | EmptyStateSemanticClassNames | - | - |
| styles | | EmptyStateSemanticStyles | - | - |

