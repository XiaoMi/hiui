# ZenMode 禅模式

页面内容局部放大，快速切换为 PPT 演示模式。

## 使用示例

### 基础用法


```tsx
import React, { useState } from 'react'
import ZenMode from '@hi-ui/zen-mode'
import { Button } from '@hi-ui/button' 
export const Basic = () => {
 const [visible, setVisible] = useState(false)
 return (
 <> 
 <div className="zen-mode-basic__wrap">
 <Button
 style={{ marginBottom: 10 }}
 onClick={() => {
 setVisible(true)
 }}
 >
 开启禅模式
 </Button>

 <ZenMode
 visible={visible}
 onBack={() => {
 setVisible(false)
 }}
 toolbar={[
 <Button
 key="btn"
 onClick={() => {
 setVisible(false)
 }}
 >
 退出演示
 </Button>,
 ]}
 >
 <div
 style={{ fontSize: 14, textAlign: 'center', backgroundColor: '#F5F7FA', padding: 16 }}
 >
 <div style={{ fontWeight: 600, lineHeight: '32px' }}>我是大标题</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 <div>我是禅模式测试的文本内容</div>
 </div>
 </ZenMode>
 </div>
 </>
 )
}

```


## Props

### ZenMode Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------ | ------------ | ------------- | -------- |
| visible | 是否开启禅模式 | boolean | true \| false | false |
| onBack | 点击返回按钮的回调 | (() => void) | - | () => {} |
| toolbar | 自定义工具栏 | ReactNode\[] | - | \[] |
| showBack | 是否展示返回按钮 | boolean | true \| false | true |
| zoom | 放大比例 | number | - | 1.8 |

