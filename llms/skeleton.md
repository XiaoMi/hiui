# Skeleton 骨架屏

页面或区域加载时的占位展示，提供更好的用户体验。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton' 
export const Basic = () => {
 return (
 <> 
 <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
 <Skeleton />
 <Skeleton />
 <Skeleton />
 </div>
 </>
 )
}

```


### 不同用法


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton'
import Button from '@hi-ui/button' 
export const Usage = () => {
 const [visible, setVisible] = React.useState(true)

 return (
 <> 
 <h2>用法1: 包覆式</h2>
 <div style={{ marginBottom: '16px' }}>
 <Skeleton visible={visible} type="text">
 <div>有朋自远方来，不亦乐乎？</div>
 </Skeleton>
 </div>

 <h2>用法2: 独立式</h2>
 <div style={{ marginBottom: '16px' }}>
 {visible ? <Skeleton type="text"></Skeleton> : <div>人不知而不愠，不亦君子乎？</div>}
 </div>
 <Button onClick={() => setVisible(!visible)}>
 {visible ? 'Hide Skeleton' : 'Show Skeleton'}
 </Button>
 </>
 )
}

```


### 不同类型


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton' 
export const Type = () => {
 return (
 <> 
 <h2>text 文本骨架</h2>
 <Skeleton.Group animation="wave">
 <Skeleton type="text"></Skeleton>
 <Skeleton type="text"></Skeleton>
 <Skeleton type="text"></Skeleton>
 </Skeleton.Group>
 <h2>avatar 头像骨架</h2>
 <div>
 <Skeleton visible={true} animation="wave" type="avatar"></Skeleton>
 </div>
 <h2>image 图像骨架</h2>
 <div style={{ width: '150px', height: '100px' }}>
 <Skeleton visible={true} animation="wave" type="image"></Skeleton>
 </div>
 <h2>icon 图标骨架</h2>
 <div>
 <Skeleton visible={true} animation="wave" type="icon"></Skeleton>
 </div>
 </>
 )
}

```


### 动画选项


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton' 
export const Animation = () => {
 return (
 <> 
 <h2>wave 波浪动画</h2>
 <div>
 <Skeleton.Group visible={true} animation="wave">
 <Skeleton.Group direction="row">
 <Skeleton type="icon"></Skeleton>
 <Skeleton.Group>
 <Skeleton width={'30%'}></Skeleton>
 <Skeleton width={'70%'}></Skeleton>
 </Skeleton.Group>
 </Skeleton.Group>
 <Skeleton type="image" height={200}></Skeleton>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group>
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group>
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>
 </Skeleton.Group>
 </div>
 <h2>pulse 呼吸动画</h2>
 <div>
 <Skeleton.Group visible={true} animation="pulse">
 <Skeleton.Group direction="row">
 <Skeleton type="icon"></Skeleton>
 <Skeleton.Group>
 <Skeleton width={'30%'}></Skeleton>
 <Skeleton width={'70%'}></Skeleton>
 </Skeleton.Group>
 </Skeleton.Group>
 <Skeleton type="image" height={200}></Skeleton>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group>
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group>
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>
 </Skeleton.Group>
 </div>
 <h2>none 无动画</h2>
 <div>
 <Skeleton.Group visible={true} animation="none">
 <Skeleton.Group direction="row">
 <Skeleton type="icon"></Skeleton>
 <Skeleton.Group>
 <Skeleton width={'30%'}></Skeleton>
 <Skeleton width={'70%'}></Skeleton>
 </Skeleton.Group>
 </Skeleton.Group>
 <Skeleton type="image" height={200}></Skeleton>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group>
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group>
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>
 </Skeleton.Group>
 </div>
 </>
 )
}

```


### 不同尺寸

通过 size 属性控制骨架屏的尺寸


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton' 
export const Size = () => {
 return (
 <> 
 <h2>text 文本骨架尺寸</h2>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 <div>
 <p style={{ marginBottom: 8, color: '#666' }}>sm</p>
 <Skeleton type="text" size="sm" width={'60%'} />
 </div>
 <div>
 <p style={{ marginBottom: 8, color: '#666' }}>md</p>
 <Skeleton type="text" size="md" width={'60%'} />
 </div>
 <div>
 <p style={{ marginBottom: 8, color: '#666' }}>lg</p>
 <Skeleton type="text" size="lg" width={'60%'} />
 </div>
 </div>

 <h2>avatar 头像骨架尺寸</h2>
 <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" size="sm" />
 <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>sm (32px)</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" size="md" />
 <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>md (40px)</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" size="lg" />
 <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>lg (48px)</p>
 </div>
 </div>

 <h2>icon 图标骨架尺寸</h2>
 <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" size="sm" />
 <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>sm (40px)</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" size="md" />
 <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>md (48px)</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" size="lg" />
 <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>lg (56px)</p>
 </div>
 </div>

 <h2>image 图像骨架</h2>
 <p style={{ color: '#666', marginBottom: 16 }}>
 image 类型的骨架屏尺寸由父容器或 width/height 参数决定，不受 size 属性影响
 </p>
 <div style={{ display: 'flex', gap: 16 }}>
 <div style={{ width: 100, height: 100 }}>
 <Skeleton type="image" />
 </div>
 <div style={{ width: 150, height: 100 }}>
 <Skeleton type="image" />
 </div>
 <div style={{ width: 200, height: 150 }}>
 <Skeleton type="image" />
 </div>
 </div>
 </>
 )
}

```


### 自定义宽高

通过 style 属性自定义骨架屏的宽度和高度，支持像素值、百分比等 CSS 单位


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton' 
export const WidthAndHeight = () => {
 return (
 <> 
 <div className="skeleton-width-height__wrap">
 <h2>Text 文本 - 自定义宽度</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
 使用 style 属性设置不同宽度的文本骨架屏
 </p>
 <Skeleton.Group direction="column" gap={12} animation="wave">
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 100%</p>
 <Skeleton type="text" width="100%" />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 80%</p>
 <Skeleton type="text" width="80%" />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 60%</p>
 <Skeleton type="text" width="60%" />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 40%</p>
 <Skeleton type="text" width="40%" />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>width: 200px</p>
 <Skeleton type="text" width={200} />
 </div>
 </Skeleton.Group>
 </div>

 <h2>Text 文本 - 自定义高度</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
 通过设置 height 可以模拟不同字体大小的文本
 </p>
 <Skeleton.Group direction="column" gap={16} animation="wave">
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 height: 12px (小号文本)
 </p>
 <Skeleton type="text" width="70%" height={12} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 height: 14px (默认文本)
 </p>
 <Skeleton type="text" width="70%" height={14} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 height: 18px (中号标题)
 </p>
 <Skeleton type="text" width="70%" height={18} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 height: 24px (大号标题)
 </p>
 <Skeleton type="text" width="60%" height={24} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 height: 32px (超大标题)
 </p>
 <Skeleton type="text" width="50%" height={32} />
 </div>
 </Skeleton.Group>
 </div>

 <h2>Avatar 头像 - 自定义尺寸</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
 自定义头像骨架屏的尺寸，适配不同大小的头像
 </p>
 <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" width={24} height={24} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>24x24</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" width={32} height={32} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>32x32</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" width={40} height={40} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>40x40 (默认)</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" width={56} height={56} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>56x56</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" width={72} height={72} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>72x72</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="avatar" width={96} height={96} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>96x96</p>
 </div>
 </div>
 </div>

 <h2>Image 图片 - 自定义尺寸</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
 自定义图片骨架屏的宽高，支持各种比例
 </p>
 <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>正方形 100x100</p>
 <Skeleton type="image" width={100} height={100} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>正方形 150x150</p>
 <Skeleton type="image" width={150} height={150} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>横向 16:9 (240x135)</p>
 <Skeleton type="image" width={240} height={135} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>横向 4:3 (200x150)</p>
 <Skeleton type="image" width={200} height={150} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>竖向 3:4 (150x200)</p>
 <Skeleton type="image" width={150} height={200} />
 </div>
 </div>
 </div>

 <h2>Icon 图标 - 自定义尺寸</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>自定义图标骨架屏的尺寸</p>
 <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" width={32} height={32} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>32x32</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" width={48} height={48} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>48x48 (默认)</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" width={64} height={64} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>64x64</p>
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="icon" width={80} height={80} />
 <p style={{ marginTop: 8, fontSize: 12, color: '#999' }}>80x80</p>
 </div>
 </div>
 </div>

 <h2>使用 CSS 单位</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
 支持各种 CSS 单位：px、%、rem、em、vw 等
 </p>
 <Skeleton.Group direction="column" gap={12} animation="wave">
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 width: &apos;50%&apos; (百分比)
 </p>
 <Skeleton type="text" width="50%" />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 width: 300 (数字，转为 300px)
 </p>
 <Skeleton type="text" width={300} />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 width: &apos;20rem&apos; (rem 单位)
 </p>
 <Skeleton type="text" width="20rem" />
 </div>
 <div>
 <p style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
 width: &apos;30vw&apos; (视口宽度)
 </p>
 <Skeleton type="text" width="30vw" />
 </div>
 </Skeleton.Group>
 </div>

 <h2>组合使用示例 - 卡片骨架屏</h2>
 <div
 style={{
 padding: '16px',
 border: '1px solid #e0e0e0',
 borderRadius: '4px',
 }}
 >
 <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
 组合使用自定义宽高，构建真实的卡片骨架屏
 </p>
 <div style={{ display: 'flex', gap: 16 }}>
 {/* 文章卡片 */}
 <div
 style={{
 flex: 1,
 border: '1px solid #e0e0e0',
 borderRadius: 8,
 padding: 16,
 }}
 >
 <Skeleton.Group direction="column" gap={12} animation="wave">
 <Skeleton type="image" width="100%" height={180} />
 <Skeleton type="text" width="80%" height={20} />
 <Skeleton type="text" width="100%" height={14} />
 <Skeleton type="text" width="90%" height={14} />
 <Skeleton.Group direction="row" gap={8}>
 <Skeleton type="avatar" width={24} height={24} />
 <Skeleton type="text" width={100} height={12} />
 </Skeleton.Group>
 </Skeleton.Group>
 </div>

 {/* 用户卡片 */}
 <div
 style={{
 flex: 1,
 border: '1px solid #e0e0e0',
 borderRadius: 8,
 padding: 16,
 }}
 >
 <Skeleton.Group direction="column" gap={16} animation="wave">
 <div style={{ display: 'flex', justifyContent: 'center' }}>
 <Skeleton type="avatar" width={80} height={80} />
 </div>
 <div style={{ textAlign: 'center' }}>
 <Skeleton type="text" width={120} height={18} style={{ margin: '0 auto 8px' }} />
 <Skeleton type="text" width={180} height={14} style={{ margin: '0 auto' }} />
 </div>
 <Skeleton.Group direction="row" gap={8}>
 <Skeleton type="text" height={32} style={{ flex: 1 }} />
 <Skeleton type="text" height={32} style={{ flex: 1 }} />
 </Skeleton.Group>
 </Skeleton.Group>
 </div>

 {/* 产品卡片 */}
 <div
 style={{
 flex: 1,
 border: '1px solid #e0e0e0',
 borderRadius: 8,
 overflow: 'hidden',
 }}
 >
 <Skeleton.Group direction="column" gap={0} animation="wave">
 <Skeleton type="image" width="100%" height={200} />
 <Skeleton.Group direction="column" gap={0} style={{ padding: 16 }}>
 <Skeleton type="text" width="70%" height={16} style={{ marginBottom: 8 }} />
 <Skeleton type="text" width="40%" height={24} style={{ marginBottom: 12 }} />
 <Skeleton type="text" width="100%" height={40} />
 </Skeleton.Group>
 </Skeleton.Group>
 </div>
 </div>
 </div>
 </div>
 </>
 )
}

```


### 骨架屏组

使用 Skeleton.Group 组织多个骨架屏元素，统一控制加载状态、动画效果和布局方向。通过 content prop 区分骨架屏模板和实际内容。


```tsx
import React from 'react'
import Skeleton from '@hi-ui/skeleton'
import Avatar from '@hi-ui/avatar'
import Button from '@hi-ui/button' 
export const Group = () => {
 const [visible1, setVisible1] = React.useState(true)
 // const [visible2, setVisible2] = React.useState(true)
 const [visible3, setVisible3] = React.useState(true)

 return (
 <> 
 <div className="skeleton-group__wrap">
 <h2>Usage 用法</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <h3>用法1: 属性式（使用content prop传递内容）</h3>
 <Skeleton.Group
 direction="column"
 gap={12}
 visible={visible1}
 content={
 <div>
 <h3 style={{ margin: '0 0 8px 0' }}>这是实际的标题</h3>
 <p style={{ margin: '0 0 8px 0' }}>这是第一段实际内容，已经从服务器加载完成。</p>
 <p style={{ margin: 0 }}>这是第二段实际内容，包含更多信息。</p>
 </div>
 }
 animation="wave"
 >
 <Skeleton height={24} width={'60%'} />
 <Skeleton />
 <Skeleton width={'80%'} />
 </Skeleton.Group>

 <h3>用法2: 包覆式（children 传递内容）</h3>
 <Skeleton.Group direction="column" gap={12} visible={visible1} animation="wave">
 <Skeleton height={24} width={'60%'}>
 <h3 style={{ margin: '0 0 8px 0' }}>这是实际的标题</h3>
 </Skeleton>
 <Skeleton>
 <p style={{ margin: 0 }}>这是第一段实际内容，已经从服务器加载完成。</p>
 </Skeleton>
 <Skeleton width={'80%'}>
 <p style={{ margin: 0 }}>这是第二段实际内容，包含更多信息。</p>
 </Skeleton>
 </Skeleton.Group>

 <h3>用法3: 独立式（内容放在组件外）</h3>
 {visible1 ? (
 <Skeleton.Group direction="column" gap={12} visible={visible1} animation="wave">
 <Skeleton height={24} width={'60%'} />
 <Skeleton />
 <Skeleton width={'80%'} />
 </Skeleton.Group>
 ) : (
 <div>
 <h3 style={{ margin: '0 0 8px 0' }}>这是实际的标题</h3>
 <p style={{ margin: '0 0 8px 0' }}>这是第一段实际内容，已经从服务器加载完成。</p>
 <p style={{ margin: 0 }}>这是第二段实际内容，包含更多信息。</p>
 </div>
 )}
 <Button
 onClick={() => setVisible1(!visible1)}
 style={{ marginTop: 16, padding: '8px 16px' }}
 >
 {visible1 ? 'Hide Skeleton' : 'Show Skeleton'}
 </Button>
 </div>

 <h2>垂直布局（默认）</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <Skeleton.Group direction="column">
 <Skeleton width={'80%'} />
 <Skeleton width={'60%'} />
 <Skeleton width={'70%'} />
 </Skeleton.Group>
 </div>

 <h2>水平布局</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <Skeleton.Group direction="row">
 <Skeleton type="avatar" />
 <Skeleton.Group direction="column" style={{ flex: 1 }}>
 <Skeleton type="text" width={'60%'} />
 <Skeleton type="text" width={'40%'} />
 </Skeleton.Group>
 </Skeleton.Group>
 </div>

 <h2>混合复杂布局</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <Skeleton.Group
 direction="column"
 gap={16}
 visible={visible3}
 animation="wave"
 content={
 <div style={{ display: 'flex', flexDirection: 'row' }}>
 <div style={{ width: '100%' }}>
 {/* 头部 */}
 <div
 style={{
 display: 'flex',
 gap: 12,
 marginBottom: 6,
 }}
 >
 <Avatar />
 <div style={{ flex: 1 }}>
 <h4 style={{ margin: '0 0 4px 0' }}>写代码是一门艺术</h4>
 <p style={{ margin: 0, fontSize: 14, color: '#999' }}>孔子 · 2025年11月3日</p>
 </div>
 </div>
 {/* 内容 */}
 <div>
 <h4 style={{ margin: '0 0 4px 0' }}>学而时习之，不亦说乎？</h4>
 <h5 style={{ margin: '0 0 6px 0' }}>有朋自远方来，不亦乐乎？</h5>
 <p style={{ fontSize: 14, margin: 0 }}>
 【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”【译】孔子说：“学习并且不断温习，不也很愉快吗？远方来了朋友，不也很快乐吗？人家不了解我，我也不怨恨，不也是君子吗？”
 </p>
 </div>
 </div>
 {/* 图片 */}
 <img
 src={
 'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
 }
 alt="content"
 style={{
 width: '65%',
 height: 190,
 objectFit: 'cover',
 borderRadius: 6,
 }}
 />
 </div>
 }
 >
 <Skeleton.Group direction="row" gap={16} alignItems="start">
 {/* 左侧 */}
 <Skeleton.Group direction="column" gap={12}>
 {/* 头部 */}
 <Skeleton.Group direction="row" gap={12}>
 <Skeleton type="avatar" />
 <Skeleton.Group direction="column" gap={6} style={{ flex: 1 }}>
 <Skeleton width={'40%'} />
 <Skeleton width={'30%'} />
 </Skeleton.Group>
 </Skeleton.Group>
 {/* 内容 */}
 <Skeleton.Group direction="column" gap={6}>
 <Skeleton size="lg" width={'60%'} />
 <Skeleton size="lg" width={'40%'} />
 <Skeleton />
 <Skeleton />
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </Skeleton.Group>

 {/* 右侧图片 */}
 <Skeleton type="image" width={'65%'} height={190} />
 </Skeleton.Group>
 </Skeleton.Group>
 <Button
 onClick={() => setVisible3(!visible3)}
 style={{ marginTop: 16, padding: '8px 16px' }}
 >
 {visible3 ? 'Hide Skeleton' : 'Show Skeleton'}
 </Button>
 </div>

 <h2>自定义间距</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <Skeleton.Group direction="column" gap={24}>
 <Skeleton />
 <Skeleton />
 <Skeleton />
 </Skeleton.Group>
 </div>

 <h2>统一控制动画效果</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <h4>Pulse 动画</h4>
 <Skeleton.Group direction="column" animation="pulse">
 <Skeleton />
 <Skeleton width={'80%'} />
 <Skeleton width={'60%'} />
 </Skeleton.Group>

 <h4 style={{ marginTop: 24 }}>Wave 动画</h4>
 <Skeleton.Group direction="column" animation="wave">
 <Skeleton />
 <Skeleton width={'80%'} />
 <Skeleton width={'60%'} />
 </Skeleton.Group>
 </div>

 <h2>列表骨架屏示例</h2>
 <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
 <Skeleton.Group direction="column" gap={20} animation="wave">
 {[1, 2, 3].map((item) => (
 <Skeleton.Group key={item} direction="row" gap={12}>
 <Skeleton type="avatar" />
 <Skeleton.Group direction="column" gap={8} style={{ flex: 1 }}>
 <Skeleton width={'100%'} />
 <Skeleton width={'50%'} />
 </Skeleton.Group>
 </Skeleton.Group>
 ))}
 </Skeleton.Group>
 </div>
 </div>
 </>
 )
}

```


## Props

### Skeleton Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | ---------------------------------------- | --------------------------------------- | --------------------------------------- | ------ |
| visible | 加载状态，控制骨架屏的显示与隐藏 | boolean | true \| false | true |
| type | 类型，支持文本、头像、图片、图标四种类型 | "image" \| "text" \| "avatar" \| "icon" | "image" \| "text" \| "avatar" \| "icon" | "text" |
| animation | 动画，控制骨架屏的动画效果 | "none" \| "pulse" \| "wave" | "none" \| "pulse" \| "wave" | "none" |
| size | 尺寸，支持三种预设尺寸 | "sm" \| "md" \| "lg" | "sm" \| "md" \| "lg" | "md" |
| width | 宽度，支持自定义宽度 | string \| number | string \| number | - |
| height | 高度，支持自定义高度 | string \| number | string \| number | - |


### SkeletonGroup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | --------------------------------------------------------- | ----------------------------------------- | ----------------------------------------- | -------- |
| children | 骨架屏模板，visible 为 true 时显示 | ReactNode | - | - |
| content | 加载完成后显示的实际内容，visible 为 false 时显示 | ReactNode | - | - |
| direction | 布局方向 | "row" \| "column" | "row" \| "column" | "column" |
| gap | 子元素间距，可以是数字（px）或字符串（如 '12px', '1rem'） | Gap\<string \| number> | string \| number \| string & {} | - |
| visible | 加载状态，控制骨架屏与实际内容的切换 | boolean | true \| false | true |
| animation | 统一设置子组件的动画效果 | "none" \| "pulse" \| "wave" | "none" \| "pulse" \| "wave" | - |
| alignItems | 子骨架屏对齐方式 | "start" \| "center" \| "end" \| "stretch" | "start" \| "center" \| "end" \| "stretch" | "center" |

