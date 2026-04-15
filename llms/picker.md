# Picker 选择器

下拉框选择器。

## 使用示例

### 基础用法


```tsx
import React from 'react'
import Picker from '@hi-ui/picker'
import Button from '@hi-ui/button' 
export const Basic = () => {
 return (
 <> 
 <div className="picker-basic__wrap">
 <Picker searchable trigger={<Button>Trigger</Button>} footer="1">
 <div>content</div>
 </Picker>
 </div>
 </>
 )
}

```


### 创建选项


```tsx
import React from 'react'
import Picker from '@hi-ui/picker'
import Button from '@hi-ui/button' 
export const Creatable = () => {
 return (
 <> 
 <div className="picker-creatable__wrap">
 <Picker
 searchable
 creatableInSearch
 trigger={<Button>Trigger</Button>}
 onCreate={(keyword) => {
 console.log(keyword)
 }}
 ></Picker>
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对 Picker 各元素进行细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import Picker, { PickerSemanticName } from '@hi-ui/picker' 
export const Semantic = () => {
 const [selected, setSelected] = useState<PickerSemanticName>()

 return (
 <> 
 <div className="picker-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Picker
 visible
 searchable
 creatableInSearch
 trigger={<Button>打开选择器</Button>}
 header="头部内容"
 footer="底部内容"
 classNames={{
 root: 'my-picker__root',
 container: 'my-picker__container',
 panel: 'my-picker__panel',
 header: 'my-picker__header',
 search: 'my-picker__search',
 body: 'my-picker__body',
 footer: 'my-picker__footer',
 loading: 'my-picker__loading',
 empty: 'my-picker__empty',
 creator: 'my-picker__creator',
 }}
 styles={{
 [selected as string]: {
 outline: '1px solid #ffbe0a',
 },
 }}
 >
 <div>选项内容</div>
 </Picker>
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'container', description: '下拉容器' },
 { title: 'panel', description: '下拉面板' },
 { title: 'header', description: '头部' },
 { title: 'search', description: '搜索区' },
 { title: 'body', description: '内容区' },
 { title: 'footer', description: '底部' },
 { title: 'loading', description: '加载中' },
 { title: 'empty', description: '空状态' },
 { title: 'creator', description: '创建选项' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as PickerSemanticName)}
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

### Picker Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------- | ------ |
| disabled | 是否禁用 | boolean | true \| false | false |
| emptyContent | 设置选项为空时展示的内容 | ReactNode | - | - |
| loadingContent | 加载中时的提示 | ReactNode | - | - |
| showEmpty | 展示未搜索结果 | boolean | true \| false | true |
| optionWidth | 自定义下拉选项宽度 | Width\<string \| number> | string \| number \| string & {} | - |
| overlayClassName | 下拉根元素的类名称 | string | - | - |
| searchable | 是否可搜索 | boolean | true \| false | false |
| keyword | 搜索关键字，searchable 为 true 时有效 | string | - | - |
| creatableInSearch | 在搜索状态下是否可创建选项 | boolean | true \| false | false |
| creatableInSearchVisible | 是否显示「创建选项」入口。为 false 时不显示。&#xA;不传（undefined）时保持兼容：只要有搜索词即显示创建入口。&#xA;Select/CheckSelect 会传入此 prop，实现「仅当无结果或关键字与结果无全匹配时显示」。 | boolean | true \| false | - |
| createTitle | 创建选项时展示的标题 | string | - | - |
| onCreate | 创建选项时触发回调 | ((keyword: string) => void) | - | - |
| onSearch | 搜索时触发回调 | ((keyword: string) => void) | - | - |
| clearSearchOnClosed | 是否在关闭时清除搜索 | boolean | true \| false | false |
| clearable | 是否可清空 | boolean | true \| false | false |
| overlay | 自定义控制 popper 行为 | PopperOverlayProps | - | - |
| closeOnEsc | 开启 Esc 快捷键关闭 | boolean | true \| false | true |
| searchPlaceholder | 搜索的占位符 | string | - | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| onOpen | 下拉菜单打开时回调 | (() => void) | - | - |
| onClose | 下拉菜单关闭时回调 | (() => void) | - | - |
| loading | 是否在加载中 | boolean | true \| false | false |
| footer | 自定义下拉菜单底部渲染 | ReactNode | - | - |
| onOverlayScroll | 下拉列表滚动时的回调 | (() => void) | - | - |
| trigger *(required)* | 触发器 | any | - | - |
| scrollable | 开启内容区域可滚动 | boolean | true \| false | true |
| gutterGap | 气泡卡片与触发器的间距 | number | - | 4 |
| innerRef | 提供辅助方法的内部引用 | Ref\<PickerHelper> | - | - |
| header | 自定义下拉菜单顶部渲染 | ReactNode | - | - |
| invalid | 开启表单控件组件输入无效态 | boolean | true \| false | false |
| classNames | | PickerSemanticClassNames | - | - |
| styles | | PickerSemanticStyles | - | - |

