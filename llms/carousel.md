# Carousel 走马灯

又叫图片轮播器，是用于在同一空间展示一组图片的容器。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const Basic = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <div className="carousel-basic__wrap" style={{ minWidth: '660px', height: '320px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 自定义宽高


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const Resize = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <h2>760 X 320</h2>
 <div className="carousel-basic__wrap" style={{ minWidth: '660px', height: '320px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 <h2>760 X 469</h2>
 <div className="carousel-basic__wrap" style={{ minWidth: '660px', height: '469px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 <h2>760 X 200</h2>
 <div className="carousel-basic__wrap" style={{ minWidth: '660px', height: '200px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 不同箭头尺寸


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const ArrowSize = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <h2>lg(large)</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel arrowSize={'lg'}>{generateContent()}</Carousel>
 </div>
 <h2>md(middle)</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel arrowSize={'md'}>{generateContent()}</Carousel>
 </div>
 <h2>sm(small)</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel arrowSize={'sm'}>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 自动切换间隔


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const Duration = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <h2>0ms(default)(disabled)</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 <h2>5000ms</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel duration={5000}>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 指示器类型


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const DotType = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <h2>line (default)</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 <h2>dot</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel dotType={'dot'}>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 指示器位置


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const dotPlacement = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <h2>bottom(default)</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 <h2>left</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel dotPlacement={'left'}>{generateContent()}</Carousel>
 </div>
 <h2>top</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel dotPlacement={'top'}>{generateContent()}</Carousel>
 </div>
 <h2>right</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel dotPlacement={'right'}>{generateContent()}</Carousel>
 </div>
 <h2>outer</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel dotPlacement={'outer'}>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 显隐配置


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const Config = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <h2>showPages = true</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel showPages>{generateContent()}</Carousel>
 </div>
 <h2>showDot = false</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel showDots={false}>{generateContent()}</Carousel>
 </div>
 <h2>showArrows = false</h2>
 <div style={{ minWidth: '660px', height: '320px' }}>
 <Carousel showArrows={false}>{generateContent()}</Carousel>
 </div>
 </>
 )
}

```


### 响应式


```tsx
import React from 'react'
import Carousel from '@hi-ui/carousel' 
export const Responsive = () => {
 const generateContent = () => {
 return [
 <div
 key={'1'}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 width: '100%',
 height: '100%',
 position: 'relative',
 }}
 >
 <img
 src={
 'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
 }
 alt={'1'}
 onClick={() => console.log('1')}
 />
 <div
 style={{
 position: 'absolute',
 left: '50%',
 top: '50%',
 transform: 'translateX(-50%) translateY(-50%)',
 color: '#fff',
 fontSize: '36px',
 textShadow: '2px 2px 8px #fff',
 }}
 >
 Christmas
 </div>
 </div>,
 <img
 key={'2'}
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt={'2'}
 onClick={() => console.log('2')}
 />,
 <img
 key={'3'}
 src={
 'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
 }
 alt={'3'}
 onClick={() => console.log('3')}
 />,
 ]
 }

 return (
 <> 
 <div className="carousel-Responsive__wrap" style={{ display: 'flex', height: '320px' }}>
 <div style={{ flex: 1, overflow: 'hidden' }}>
 <Carousel>{generateContent()}</Carousel>
 </div>
 <div
 style={{
 width: '100px',
 marginInlineStart: 4,
 flexBasis: '100px',
 height: '100%',
 flexShrink: 0,
 backgroundColor: '#2660ff',
 }}
 >
 模拟侧边栏定宽
 </div>
 </div>
 </>
 )
}

```


## Props

### Carousel Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| duration | 自动切换间隔(0代表不用自动切换) | number | - | "0" |
| showDots | 是否展示分页指示器 | boolean | true \| false | "true" |
| showArrows | 是否展示箭头指示器 | boolean | true \| false | "true" |
| defaultActive | 默认激活索引(从0开始计算索引) | number | - | "0" |
| showPages | 是否展示页码指示器 | boolean | true \| false | "false" |
| arrowSize | 箭头指示器尺寸 | CarouselArrowSizeEnum | "lg" \| "md" \| "sm" | "'md'" |
| dotType | 分页指示器类型 | CarouselDotTypeEnum | "line" \| "slider" \| "dot" | "'slider'" |
| dotPlacement | 分页指示器位置 | CarouselDotPlacementEnum | "left" \| "right" \| "top" \| "bottom" \| "outer" | "'bottom'" |
| onIndexChange | index 变化时的回调函数 | ((index: number, evt: MouseEvent\<Element, MouseEvent>) => void) | - | - |

