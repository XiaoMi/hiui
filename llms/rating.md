# Rate 评分

评分是通过离散型数据来设置某一个指标优劣的组件。

## 使用示例

### 基础用法

评定业务指标、信用等级、满意度等


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Basic = () => {
 return (
 <> 
 <div className="rating-basic__wrap">
 <Rating defaultValue={3} />
 </div>
 </>
 )
}

```


### 受控


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Controlled = () => {
 const [value, setValue] = React.useState(1)
 return (
 <> 
 <div className="rating-controlled__wrap">
 <div>当前打分：{value} 分</div>
 <Rating style={{ marginTop: 8 }} value={value} onChange={setValue} />
 </div>
 </>
 )
}

```


### 设置尺寸


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Size = () => {
 return (
 <> 
 <div className="rating-size__wrap">
 <div>
 <Rating defaultValue={3} style={{ fontSize: 14 }} />
 </div>
 <div style={{ marginTop: 10 }}>
 <Rating defaultValue={3} style={{ fontSize: 20 }} />
 </div>
 </div>
 </>
 )
}

```


### 基础用法

评定业务指标、信用等级、满意度等


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Character = () => {
 return (
 <> 
 <div className="rating-character__wrap">
 <h2>文字字符</h2>
 <Rating defaultValue={3} character="HiUI" />

 <br />
 <h2>图片字符</h2>
 <Rating
 defaultValue={3.5}
 character={
 <img
 src="https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/logo.png"
 style={{ width: 24, height: 24 }}
 />
 }
 />
 </div>
 </>
 )
}

```


### 半星


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Half = () => {
 return (
 <> 
 <div className="rating-half__wrap">
 <Rating
 allowHalf
 defaultValue={3.5}
 halfPlacement="horizontal"
 onHover={console.log}
 ></Rating>
 <br />
 <br />
 <Rating allowHalf defaultValue={3.5} halfPlacement="vertical" />
 </div>
 </>
 )
}

```


### 禁止清除


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Clearable = () => {
 return (
 <> 
 <div className="rating-clearable__wrap">
 <Rating defaultValue={3} clearable={false} />
 </div>
 </>
 )
}

```


### 任意数量


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Count = () => {
 return (
 <> 
 <div className="rating-count__wrap">
 <Rating count={10} allowHalf defaultValue={9.5} />
 </div>
 </>
 )
}

```


### 不同状态

展示所有备选项，数量不宜超出10个


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Status = () => {
 return (
 <> 
 <div className="rating-status__wrap">
 <h2>禁用</h2>
 <Rating disabled defaultValue={3.5} halfPlacement="vertical" onHover={console.log}></Rating>
 <h2>只读</h2>
 <Rating readOnly defaultValue={4} allowHalf={false} halfPlacement="horizontal"></Rating>
 <br />
 <h2>自动聚焦</h2>
 <Rating
 autoFocus
 defaultValue={3.5}
 halfPlacement="vertical"
 onHover={console.log}
 ></Rating>
 </div>
 </>
 )
}

```


### 带Tooltip


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Tooltip = () => {
 return (
 <> 
 <div className="rating-tooltip__wrap">
 <Rating
 defaultValue={3.5}
 tooltips={['极差', '失望', '一般', '满意', '很满意']}
 allowHalf
 halfPlacement="horizontal"
 ></Rating>
 </div>
 </>
 )
}

```


### 使用表情

运用图标直观表达评级结果的优劣


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Emoji = () => {
 return (
 <> 
 <div className="rating-emoji__wrap">
 <p>使用表情后将不可自定义数量，不可定义半星</p>
 <Rating defaultValue={5} useEmoji halfPlacement="horizontal"></Rating>
 </div>
 </>
 )
}

```


### 自定义渲染

使用 renderCharacter()=>ReactNode 自定义渲染


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Custom = () => {
 const smile1Png =
 'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-1%402x.png'

 const smile2Png =
 'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-2%402x.png'

 const smile3Png =
 'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-3%402x.png'

 const smile4Png =
 'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-4%402x.png'

 const smile5Png =
 'https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/rating-emoji-5%402x.png'

 return (
 <> 
 <div className="rating-custom__wrap">
 <Rating
 defaultValue={1}
 characterRender={(value) => {
 const Emojis = [smile1Png, smile2Png, smile3Png, smile4Png, smile5Png]

 return <img src={Emojis[Math.ceil(value) - 1]} style={{ width: 24, height: 24 }} />
 }}
 ></Rating>
 </div>
 </>
 )
}

```


### 辅助文字


```tsx
import React from 'react'
import Rating from '@hi-ui/rating' 
export const Desc = () => {
 return (
 <> 
 <div className="rating-desc__wrap">
 <Rating
 defaultValue={1}
 descRender={(value) => {
 const arr = ['极差', '失望', '一般', '满意', '很满意']
 return <span>{arr[Math.ceil(value) - 1]}</span>
 }}
 ></Rating>
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
import Rating, { RatingSemanticName } from '@hi-ui/rating' 
export const Semantic = () => {
 const [selected, setSelected] = useState<RatingSemanticName>()

 return (
 <> 
 <div className="rating-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Rating
 defaultValue={3}
 descRender={(v) => `当前 ${v} 分`}
 classNames={{
 root: 'my-rating__root',
 star: 'my-rating__star',
 desc: 'my-rating__desc',
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
 { title: 'root', description: '根元素 (ul)' },
 { title: 'star', description: '单个星星项' },
 { title: 'desc', description: '描述文案区域' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as RatingSemanticName)}
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

### Rating Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ------------------------------------------------------------ | --------------------------------------------- | -------------------------- | ------------ |
| disabled | 禁用，无法进行交互,鼠标禁用交互效果 | boolean | true \| false | false |
| readOnly | 只读，无法进行交互 | boolean | true \| false | false |
| count | star 数量 | number | - | 5 |
| value | 当前数，受控值 | number | - | - |
| defaultValue | 默认值 | number | - | 0 |
| onChange | 选择时的回调 | ((value: number) => void) | - | - |
| allowHalf | 是否允许半选 | boolean | true \| false | - |
| character | 自定义字符 | ReactNode | - | - |
| halfPlacement | 开启半选时，星星展示方式 | "vertical" \| "horizontal" | "vertical" \| "horizontal" | "horizontal" |
| clearable | 是否允许再次点击后清除 | boolean | true \| false | true |
| color | 自定义颜色，css 支持的颜色值 | string | - | - |
| onHover | 悬停反馈，当用户的鼠标悬停在评分组件上时，可以获取对应的分值 | ((value: number) => void) | - | - |
| autoFocus | 是否自动获取焦点 | boolean | true \| false | false |
| tooltips | 自定义每项的提示信息 | ReactNode\[] | - | "\[]" |
| useEmoji | 是否使用表情 | boolean | true \| false | false |
| characterRender | 自定义渲染 character 函数 | ((value: number, index: number) => ReactNode) | - | - |
| descRender | 自定义辅助文字函数 | ((value: number) => ReactNode) | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | - |
| classNames | | RatingSemanticClassNames | - | - |
| styles | | RatingSemanticStyles | - | - |

