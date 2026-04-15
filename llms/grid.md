# Grid 栅格组件

24 栏栅格系统，用于实现内容区域的各种布局

## 使用示例

### 基础用法

无间隔水平排列


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Basic = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-basic__wrap">
 <Row>
 <Col span={24}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-24</div>
 </Col>
 </Row>
 <Row>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### 区块间隔

在 Row 设置 gutter = true 来使水平排列有间隔


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Gutter = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-gutter__wrap">
 <Row gutter={true}>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 col-6
 <br />
 25%
 </div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### 左右偏移

设置 offset 来指定左右的偏移量


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Offset = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-offset__wrap">
 <Row gutter={true}>
 <Col span={8}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-8</div>
 </Col>
 <Col span={6} offset={6}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>col-6-offset-6</div>
 </Col>
 <Col span={4}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-4</div>
 </Col>
 </Row>
 <Row gutter={true}>
 <Col span={4}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-4</div>
 </Col>
 <Col span={6} offset={4}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>col-6-offset-4</div>
 </Col>
 <Col span={4}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-4</div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-6</div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### 嵌套

嵌套栅格来完成布局


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Nested = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-nested__wrap">
 <Row gutter={true}>
 <Col span={16}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 col-16
 <Row gutter={8}>
 <Col span={12}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff', opacity: 1 }}>
 col-12
 </div>
 </Col>
 <Col span={12}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff', opacity: 1 }}>
 col-12
 </div>
 </Col>
 </Row>
 </div>
 </Col>
 <Col span={8}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-4</div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### 对齐排列

设置 justify 来指定对齐方式


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Justify = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-justify">
 <Row justify="center" gutter={true}>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-6</div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-6</div>
 </Col>
 </Row>
 <Row justify="space-between" gutter={true}>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-6</div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-6</div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>col-6</div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### 响应式

配置 span 在不同屏幕宽度下所包含的栅格数，支持 { xs, sm, md, lg, xl } 设置。请通过改变窗口宽度查看示例效果


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Responsive = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-responsive__wrap">
 <h2>span</h2>
 <Row>
 <Col span={{ xs: 24, md: 12, lg: 6 }}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>.xs-24 .md-12 .lg-6</div>
 </Col>
 <Col span={{ xs: 24, md: 12, lg: 6 }}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>.xs-24 .md-12 .lg-6</div>
 </Col>
 <Col span={{ xs: 24, md: 12, lg: 6 }}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>.xs-24 .md-12 .lg-6</div>
 </Col>
 <Col span={{ xs: 24, md: 12, lg: 6 }}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>.xs-24 .md-12 .lg-6</div>
 </Col>
 </Row>

 <h2>offset</h2>
 <Row>
 <Col span={{ xs: 12, md: 8 }}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>.xs-12 .md-8</div>
 </Col>
 <Col span={{ xs: 12, md: 8 }} offset={{ xs: 6, md: 0 }}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>xs-12 .md-8</div>
 </Col>
 <Col span={{ xs: 12, md: 8 }} offset={{ xs: 12, md: 0 }}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>xs-12 .md-8</div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### 重排序

通过配置 order 优化 Grid 项的展示空间的排序位置


```tsx
import React from 'react'
import Grid from '@hi-ui/grid' 
export const Order = () => {
 const { Row, Col } = Grid

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="grid-order__wrap">
 <Row>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 <div>1号空间</div>
 <div>序号：未定义</div>
 </div>
 </Col>
 <Col span={6} order={-1}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 <div>2号空间</div>
 <div>序号：-1</div>
 </div>
 </Col>
 <Col span={6} order={24}>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>
 <div>3号空间</div>
 <div>序号：24</div>
 </div>
 </Col>
 <Col span={6}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>
 <div>4号空间</div>
 <div>序号：未定义</div>
 </div>
 </Col>
 </Row>
 </div>
 </>
 )
}

```


### AutoGrid 基础

children / columnCount / data-span / gutter 用法


```tsx
import React from 'react'
import { AutoGrid } from '@hi-ui/grid' 
export const AutoGridBasic = () => {
 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 return (
 <> 
 <div className="auto-grid-basic__wrap">
 <h2>children 默认 3 列</h2>
 <AutoGrid gutter rowGap={16}>
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} style={{ ...blockStyle, backgroundColor: i % 2 ? '#2660ff' : '#4b82ff' }}>
 Item {i}
 </div>
 ))}
 </AutoGrid>

 <h2>子元素可通过 span / data-span 自定义占据栅格数</h2>
 <AutoGrid columnCount={4} gutter rowGap={16}>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }} data-span={12}>
 span 12
 </div>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }} data-span={12}>
 span 12
 </div>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }} data-span={8}>
 span 8
 </div>
 <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }} data-span={8}>
 span 8
 </div>
 <div style={{ ...blockStyle, backgroundColor: '#2660ff' }} data-span={8}>
 span 8
 </div>
 </AutoGrid>
 </div>
 </>
 )
}

```


### AutoGrid Nodes API

使用 nodes 替代 children，支持 props 对象或函数


```tsx
import React from 'react'
import { AutoGrid } from '@hi-ui/grid' 
export const AutoGridNodes = () => {
 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 const nodes = [
 { key: '1', elem: <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>1</div> },
 {
 key: '2',
 elem: <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>2</div>,
 props: { span: 16 },
 },
 {
 key: '3',
 elem: <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>3</div>,
 props: ({ columnCount }: { columns: number; columnCount: number }) => ({
 span: 24,
 }),
 },
 ]

 return (
 <> 
 <div className="auto-grid-nodes__wrap">
 <AutoGrid nodes={nodes} gutter rowGap={16}></AutoGrid>
 </div>
 </>
 )
}

```


### DynamicGrid 基础

可拖拽容器调整宽度，根据 breakpoints 自动调整列数，onColumnCountChange 回调当前列数


```tsx
import React, { useState } from 'react'
import { DynamicGrid } from '@hi-ui/grid' 
export const DynamicGridBasic = () => {
 const [count, setCount] = useState<number>(0)

 const blockStyle: React.CSSProperties = {
 width: '100%',
 padding: '16px 0',
 textAlign: 'center',
 opacity: '1',
 color: '#fff',
 }

 const resizeStyle: React.CSSProperties = {
 resize: 'horizontal',
 overflow: 'auto',
 width: 500,
 minWidth: 300,
 maxWidth: 860,
 border: '2px dashed #e5e7eb',
 borderRadius: 8,
 padding: 16,
 }

 const breakpoints: [number, number][] = [
 [400, 1],
 [600, 2],
 [Infinity, 3],
 ]

 console.log('count', count)

 return (
 <> 
 <div className="grid-dynamic-basic__wrap">
 <div style={resizeStyle}>
 <DynamicGrid
 breakpoints={breakpoints}
 onColumnCountChange={(count) => {
 console.log('onColumnCountChange', count)
 setCount(count)
 }}
 gutter
 rowGap={16}
 >
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div
 key={i}
 style={{ ...blockStyle, backgroundColor: i % 2 ? '#2660ff' : '#4b82ff' }}
 >
 Item {i}
 </div>
 ))}
 </DynamicGrid>
 </div>
 <p style={{ marginTop: 16, color: '#666' }}>
 可拖拽容器右侧边缘调整宽度，观察列数自动变化，当前列数: {count || '-'}
 </p>
 </div>
 </>
 )
}

```


## Props

### Row Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| align | 垂直对齐方式 | GridAlignEnum \| GridResponsiveSize\<GridAlignEnum> | "flex-start" \| "flex-end" \| "center" \| "stretch" \| GridResponsiveSize\<GridAlignEnum> | - |
| justify | 水平对齐方式 | GridJustifyEnum \| GridResponsiveSize\<GridJustifyEnum> | "flex-start" \| "flex-end" \| "center" \| "space-around" \| "space-between" \| GridResponsiveSize\<GridJustifyEnum> | - |
| gutter | Row 里面元素之间是否有外边距，建议使用偶数 | number \| boolean | number \| false \| true | - |
| columns | 设置栅格列总数，一般是 12 或者 24 或者 48 | number | - | 24 |
| rowGap | Row 与 Row 之间的距离 | number | - | 16 |


### Col Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ----------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| span | Col 元素占多少个栅格 | number \| GridResponsiveSize\<number> | number \| GridResponsiveSize\<number> | - |
| offset | Col 元素偏移多少个栅格 | number \| GridResponsiveSize\<number> | number \| GridResponsiveSize\<number> | - |
| justify | 里面的元素排布方式 | GridJustifyEnum \| GridResponsiveSize\<GridJustifyEnum> | "flex-start" \| "flex-end" \| "center" \| "space-around" \| "space-between" \| GridResponsiveSize\<GridJustifyEnum> | - |
| order | Col项重排序，数值越大，越在后面展示 | number \| GridResponsiveSize\<number> | number \| GridResponsiveSize\<number> | - |


### AutoGrid Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| align | 垂直对齐方式 | GridAlignEnum \| GridResponsiveSize\<GridAlignEnum> | "flex-start" \| "flex-end" \| "center" \| "stretch" \| GridResponsiveSize\<GridAlignEnum> | - |
| justify | 水平对齐方式 | GridJustifyEnum \| GridResponsiveSize\<GridJustifyEnum> | "flex-start" \| "flex-end" \| "center" \| "space-around" \| "space-between" \| GridResponsiveSize\<GridJustifyEnum> | - |
| gutter | Row 里面元素之间是否有外边距，建议使用偶数 | number \| boolean | number \| false \| true | true |
| columns | 设置栅格列总数，一般是 12 或者 24 或者 48 | number | - | 24 |
| rowGap | Row 与 Row 之间的距离 | number | - | 0 |
| children | 子元素清单&#xA;- 存在子元素时，会自动按照默认的配置增加网格包裹&#xA;- 如需控制子元素占据的网格数，请在元素上增加 span 或者 data-span 属性 | ((boolean \| ReactChild \| ReactFragment \| ReactPortal \| null) & ReactNode\[]) | ReactNode\[] \| string & ReactNode\[] \| number & ReactNode\[] \| false & ReactNode\[] \| true & ReactNode\[] \| ReactElement\<any, string \| JSXElementConstructor\<any>> & ReactNode\[] \| ReactNodeArray & ReactNode\[] \| ReactPortal & ReactNode\[] | - |
| nodes | 列元素清单 | AutoGridNodeType\[] | - | - |
| columnCount | 列数 | number | - | - |


### DynamicGrid Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| align | 垂直对齐方式 | GridAlignEnum \| GridResponsiveSize\<GridAlignEnum> | "flex-start" \| "flex-end" \| "center" \| "stretch" \| GridResponsiveSize\<GridAlignEnum> | - |
| justify | 水平对齐方式 | GridJustifyEnum \| GridResponsiveSize\<GridJustifyEnum> | "flex-start" \| "flex-end" \| "center" \| "space-around" \| "space-between" \| GridResponsiveSize\<GridJustifyEnum> | - |
| gutter | Row 里面元素之间是否有外边距，建议使用偶数 | number \| boolean | number \| false \| true | - |
| columns | 设置栅格列总数，一般是 12 或者 24 或者 48 | number | - | - |
| rowGap | Row 与 Row 之间的距离 | number | - | - |
| children | 子元素清单&#xA;- 存在子元素时，会自动按照默认的配置增加网格包裹&#xA;- 如需控制子元素占据的网格数，请在元素上增加 span 或者 data-span 属性 | ((boolean \| ReactChild \| ReactFragment \| ReactPortal \| null) & ReactNode\[]) | ReactNode\[] \| string & ReactNode\[] \| number & ReactNode\[] \| false & ReactNode\[] \| true & ReactNode\[] \| ReactElement\<any, string \| JSXElementConstructor\<any>> & ReactNode\[] \| ReactNodeArray & ReactNode\[] \| ReactPortal & ReactNode\[] | - |
| nodes | 列元素清单 | AutoGridNodeType\[] | - | - |
| columnCount | 列数&#xA;列数，表示一行包含元素的数量&#xA;@desc 传入此值时，列数固定，不因容器宽度变化而变化&#xA;@desc 不传时，但额外传入 wrapperElRef 时，列数会根据容器宽度变化而变化 | number | - | "3" |
| defaultColumnCount | 默认列数&#xA;@desc 与 columnCount 的区别是，仅会在初始化时使用&#xA;@desc 传入后，列数仍会根据容器宽度变化而变化 | number | - | - |
| wrapperElRef | 组件的外部包裹元素&#xA;@desc 传入此值，同时不传 columnCount 时，列数会根据容器宽度变化而变化 | RefObject\<HTMLElement> | - | - |
| onColumnCountChange | 实际可视列数变化回调 | ((columnCount: number) => void) | - | - |
| breakpoints | 列数变化断点&#xA;@desc 默认使用 GRID\_VIEWPORT\_BREAKPOINTS: \[576, 1], \[768, 2], \[992, 3], \[1200, 4], \[Infinity, 4] | BreakpointType\[] | - | - |
| sensitive | 是否对初始布局变化敏感&#xA;@desc 当设置为 true 时，会等待布局稳定后再渲染内容，避免视觉跳动 | boolean | true \| false | - |



## Type

### GridResponsiveSize<T>

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ---------------- | --------- | ------------- | ------ |
| xs | 设置屏幕 < 576px 时响应式栅格数 | T | - | - |
| sm | 设置屏幕 >= 576px 时响应式栅格数 | T | - | - |
| md | 设置屏幕 >= 768px 时响应式栅格数 | T | - | - |
| lg | 设置屏幕 >= 992px 时响应式栅格数 | T | - | - |
| xl | 设置屏幕 >= 1200px 时响应式栅格数 | T | - | - |
