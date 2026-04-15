# Menu 菜单

用来整个网站或信息系统的信息架构，供用户快速定位到目标。

## 使用示例

### 基础用法

当导航的菜单项和层级较多时适用，可收起


```tsx
import React from 'react'
import Menu from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons' 
export const Basic = () => {
 return (
 <> 
 <div
 className="menu-basic__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 showCollapse
 defaultExpandedIds={[3]}
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 disabled: true,
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 disabled: true,
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 收缩态受控

根据页面内容宽度，自行调整 Menu 收缩或者展开以适应空间


```tsx
import React from 'react'
import Menu from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons' 
export const Mini = () => {
 const [mini, setMini] = React.useState(true)
 const [menuData] = React.useState([
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ])

 return (
 <> 
 <div
 className="menu-mini__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu showCollapse collapsed={mini} onCollapse={setMini} data={menuData} />
 </div>
 </>
 )
}

```


### 水平布局

水平方向的导航菜单，菜单项在4-7个为适


```tsx
import React from 'react'
import { HomeFilled, UserFilled, SunFilled, PadFilled, ManFilled, LockFilled } from '@hi-ui/icons'
import Menu from '@hi-ui/menu' 
export const Horizontal = () => {
 return (
 <> 
 <div
 className="menu-horizontal__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 placement="horizontal"
 onClick={console.log}
 data={[
 {
 title: '电视',
 id: 1,
 icon: <HomeFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 icon: <LockFilled />,

 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 icon: <ManFilled />,
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '数码产品',
 id: 4,
 icon: <PadFilled />,
 },
 {
 title: '一级导航1',
 id: 5,
 icon: <PadFilled />,
 },
 {
 title: '一级导航2',
 id: 6,
 icon: <PadFilled />,
 },
 {
 title: '一级导航3',
 id: 7,
 icon: <PadFilled />,
 },
 {
 title: '一级导航4',
 id: 8,
 icon: <PadFilled />,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 弹出式展开

二级菜单项，以弹层的形式展示，弹层嵌套不宜过多


```tsx
import React from 'react'
import Menu from '@hi-ui/menu' 
export const Pop = () => {
 return (
 <> 
 <div className="menu-pop__wrap" style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}>
 <Menu
 expandedType="pop"
 data={[
 {
 title: '电视',
 id: 1,
 },
 {
 title: '小米MIX',
 id: 2,
 },
 {
 title: '手机',
 id: 3,
 children: [
 {
 title: '小米',
 id: 666,

 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 水平胖菜单

二级菜单项，以分组的形式展示，分组数不宜过多


```tsx
import React from 'react'
import Menu from '@hi-ui/menu' 
export const HorizontalFat = () => {
 return (
 <> 
 <div
 className="menu-horizontal-fat__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 placement="horizontal"
 showAllSubMenus
 data={[
 {
 title: '电视',
 id: 1,
 },
 {
 title: '小米MIX',
 id: 2,
 },
 {
 title: '手机',
 id: 3,
 children: [
 {
 title: '小米',
 id: 666,

 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '数码产品',
 id: 4,
 },
 {
 title: '笔记本',
 id: 5,
 },
 {
 title: '智能生活',
 id: 6,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 垂直胖菜单

二级菜单项，以分组的形式展示，分组数不宜过多


```tsx
import React from 'react'
import Menu from '@hi-ui/menu' 
export const VerticalFat = () => {
 return (
 <> 
 <div
 className="menu-vertical-fat__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 placement="vertical"
 showAllSubMenus
 data={[
 {
 title: '电视',
 id: 1,
 },
 {
 title: '小米MIX',
 id: 2,
 },
 {
 title: '手机',
 id: 3,
 children: [
 {
 title: '小米',
 id: 666,

 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 默认展开所有

在初次渲染时，展开所有节点


```tsx
import React from 'react'
import Menu from '@hi-ui/menu'
import { AppStoreFilled, SunFilled } from '@hi-ui/icons' 
export const DefaultExpandAll = () => {
 return (
 <> 
 <div
 className="menu-expand-all__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 showCollapse
 defaultExpandAll
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 ],
 },
 {
 title: '小米note',
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 ],
 },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 自定义 Footer 渲染

自行控制底部内容展示，支持插入额外的元素等场景


```tsx
import React from 'react'
import Menu from '@hi-ui/menu'
import { AppStoreFilled, SunFilled } from '@hi-ui/icons' 
export const FooterRender = () => {
 return (
 <> 
 <div
 className="menu-footer-render__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 showCollapse
 footerRender={({ collapsed, collapseNode }) => {
 return (
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 }}
 >
 {collapseNode}
 {collapsed ? null : <div style={{ margin: '8px 8px 0 0' }}>我是谁</div>}
 </div>
 )
 }}
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 ],
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 ],
 },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 自定义渲染


```tsx
import React from 'react'
import Menu, { MenuDataItem } from '@hi-ui/menu'
import {
 RightOutlined,
 AppStoreFilled,
 UserFilled,
 SunFilled,
 PadFilled,
 SearchOutlined,
} from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import Search from '@hi-ui/search' 
export const Render = () => {
 const menuData = [
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 },
 {
 title: '电脑',
 id: 4,
 icon: <PadFilled />,
 },
 ]

 const menuRef = React.useRef<HTMLDivElement | null>(null)
 const [currentMenu, setCurrentMenu] = React.useState<MenuDataItem>(menuData[0])
 const [visible, setVisible] = React.useState(false)

 return (
 <> 
 <div
 className="menu-render__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 ref={menuRef}
 showCollapse
 extraHeader={
 <div style={{ padding: '10px 0' }}>
 <Search prefix={<SearchOutlined />} append={null} />
 </div>
 }
 defaultExpandedIds={[3]}
 render={(item) => {
 return (
 <div
 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
 >
 {item.title}
 <RightOutlined style={{ marginLeft: 4 }} />
 </div>
 )
 }}
 onClick={(id, data) => {
 console.log('click', id, data)

 setCurrentMenu(data)
 setVisible(true)
 }}
 data={menuData}
 />
 {/* 如果不需要阴影，可以设置 className 去覆盖样式 */}
 <Popper
 className="menu-render__popper"
 visible={visible}
 attachEl={menuRef.current}
 placement="right"
 gutterGap={0}
 flip={false}
 animationType="scaleX"
 onClose={() => {
 setVisible(false)
 }}
 onOutsideClick={() => console.log('onOutsideClick')}
 >
 <div
 style={{
 width: 200,
 height: menuRef.current?.getBoundingClientRect().height,
 padding: 10,
 boxSizing: 'border-box',
 }}
 >
 菜单：{currentMenu.title}
 </div>
 </Popper>
 </div>
 </>
 )
}

```


### 设置尺寸

默认是 lg 尺寸


```tsx
import React from 'react'
import Menu from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons' 
export const Size = () => {
 return (
 <> 
 <div
 className="menu-size__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <h2>lg</h2>
 <Menu
 showCollapse
 size="lg"
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ]}
 />
 <h2>md</h2>
 <Menu
 showCollapse
 size="md"
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ]}
 />
 <h2>sm</h2>
 <Menu
 showCollapse
 size="sm"
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 基础用法

当导航的菜单项和层级较多时适用，可收起


```tsx
import React from 'react'
import Menu from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons' 
export const ShowTitleOnMini = () => {
 return (
 <> 
 <div
 className="menu-show-title-on-mini__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <Menu
 showCollapse
 showTitleOnMini
 defaultExpandedIds={[3]}
 data={[
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 disabled: true,
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 disabled: true,
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 侧边菜单


```tsx
import React from 'react'
import { SideMenu, useSideMenuCascade, MenuDataItem } from '@hi-ui/menu'
import Button from '@hi-ui/button'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons' 
export const SideMenuDemo = () => {
 const [data] = React.useState<MenuDataItem[]>([
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '电视',
 id: 2,
 icon: <UserFilled />,
 children: [
 {
 title: '小米电视',
 id: 21,
 children: [
 {
 title: '小米电视5',
 id: 211,
 },
 {
 title: '小米电视4',
 id: 212,
 },
 {
 title: '小米电视3',
 id: 213,
 },
 {
 title: '小米电视2',
 id: 214,
 },
 {
 title: '小米电视1',
 id: 215,
 },
 ],
 },
 ],
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 {
 title: '小米2',
 id: 'xiaomi2',
 },
 {
 title: '小米1',
 id: 'xiaomi1',
 },
 ],
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 {
 title: '小米 note2',
 id: 'xiaomi note2',
 },
 {
 title: '小米 note1',
 id: 'xiaomi note1',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ])
 const [selectId, setSelectId] = React.useState<React.ReactText>('')
 const [activeId, setActiveId] = React.useState<React.ReactText>('xiaomi3')
 const [width, setWidth] = React.useState(60)

 const { submenuData, activeParentId } = useSideMenuCascade({
 data,
 selectId,
 activeId,
 })

 console.log(submenuData, activeParentId)

 return (
 <> 
 <div className="menu-basic__wrap" style={{}}>
 <Button onClick={() => setWidth(width === 180 ? 60 : 180)}>Collapse</Button>
 <br />
 <br />
 <div
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 flexDirection: 'column',
 background: '#f5f7fa',
 }}
 >
 <SideMenu
 style={{ width }}
 mini={width === 60}
 activeId={activeParentId}
 onClick={(event, id, item) => {
 console.log(id, item)
 setActiveId(id)
 }}
 onMouseEnter={(event, id, item) => {
 setSelectId(id)
 }}
 onMouseLeave={(event, id, item) => {
 setSelectId('')
 }}
 data={data}
 />
 </div>
 </div>
 </>
 )
}

```


### 分组菜单


```tsx
import React from 'react'
import { GroupMenu } from '@hi-ui/menu' 
export const Group = () => {
 const [activeId, setActiveId] = React.useState<React.ReactText>()

 return (
 <> 
 <div
 className="menu-group__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <GroupMenu
 style={{ width: 240, background: '#fff' }}
 activeId={activeId}
 onClick={(evt, id, item) => {
 console.log(evt, id, item)
 setActiveId(id)
 }}
 data={[
 {
 id: 71,
 title: '数码产品',
 },
 {
 id: 81,
 title: '笔记本',
 },
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 {
 title: '小米2',
 id: 'xiaomi2',
 },
 {
 title: '小米1',
 id: 'xiaomi1',
 },
 ],
 },
 {
 title: '小米note',
 id: 'xiaominote',
 children: [
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 {
 title: '小米 note2',
 id: 'xiaomi note2',
 },
 {
 title: '小米 note1',
 id: 'xiaomi note1',
 },
 ],
 },
 {
 id: 7,
 title: '数码产品',
 },
 {
 id: 8,
 title: '笔记本',
 },
 {
 id: 9,
 title: '智能生活',
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 菜单搜索

当导航的菜单项和层级较多时适用，可收起


```tsx
import React from 'react'
import { MenuDataItem, MenuSearch, MenuSearchHelper } from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import Button from '@hi-ui/button' 
export const MenuSearchDemo = () => {
 const [data] = React.useState<MenuDataItem[]>([
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '小米MIX',
 id: 2,
 icon: <UserFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 disabled: true,
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 disabled: true,
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 {
 title: '超长超长超长字符超长超长超长字符',
 id: 4,
 icon: <PadFilled />,
 },
 ])

 const [visible, setVisible] = React.useState(false)
 const [value, setValue] = React.useState('')
 const ref = React.useRef<HTMLButtonElement>(null)
 const searchRef = React.useRef<MenuSearchHelper>(null)

 return (
 <> 
 <div
 className="menu-search__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
 >
 <h2>内联式</h2>
 <MenuSearch data={data} placeholder="搜索" onSelect={(id, item) => console.log(id, item)} />
 <br />
 <br />
 <h2>弹出式</h2>
 <Button
 ref={ref}
 onClick={() => {
 setVisible(true)
 }}
 >
 打开
 </Button>
 <Popper
 styles={{
 container: {
 borderRadius: 8,
 },
 }}
 visible={visible}
 attachEl={ref.current}
 gutterGap={-32}
 unmountOnClose={false}
 onOutsideClick={() => {
 setVisible(false)
 searchRef.current?.hide()
 }}
 onEntered={() => {
 if (visible) {
 searchRef.current?.focus()

 if (value) {
 searchRef.current?.show()
 }
 }
 }}
 >
 <MenuSearch
 innerRef={searchRef}
 width={360}
 value={value}
 onChange={setValue}
 data={data}
 onSelect={(id, item) => {
 console.log('select', id, item)
 setVisible(false)
 }}
 onClear={() => {
 setValue('')
 }}
 onClose={() => {
 setVisible(false)
 }}
 onEsc={() => {
 setVisible(false)
 }}
 />
 </Popper>
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
import Menu, {
 GroupMenu,
 SideMenu,
 MenuSearch,
 MenuSemanticName,
 GroupMenuSemanticName,
 SideMenuSemanticName,
 MenuSearchSemanticName,
} from '@hi-ui/menu'
import { AppStoreFilled, SunFilled } from '@hi-ui/icons' 
export const Semantic = () => {
 const [selectedMenu, setSelectedMenu] = useState<MenuSemanticName>()
 const [selectedGroupMenu, setSelectedGroupMenu] = useState<GroupMenuSemanticName>()
 const [selectedSideMenu, setSelectedSideMenu] = useState<SideMenuSemanticName>()
 const [selectedMenuSearch, setSelectedMenuSearch] = useState<MenuSearchSemanticName>()
 const menuData = [
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <SunFilled />,
 children: [
 {
 title: '小米',
 id: 666,
 children: [
 {
 title: '小米9',
 id: 'xiaomi9',
 },
 {
 title: '小米8',
 id: 'xiaomi8',
 disabled: true,
 },
 {
 title: '小米7',
 id: 'xiaomi7',
 },
 {
 title: '小米6',
 id: 'xiaomi6',
 },
 {
 title: '小米5',
 id: 'xiaomi5',
 },
 {
 title: '小米4',
 id: 'xiaomi4',
 },
 {
 title: '小米3',
 id: 'xiaomi3',
 },
 ],
 },
 {
 title: '红米',
 id: 'hongmi',
 },
 {
 title: '小米note',
 disabled: true,
 id: 'xiaominote',

 children: [
 {
 title: '小米 note7',
 id: 'xiaomi note7',
 },
 {
 title: '小米 note6',
 id: 'xiaomi note6',
 },
 {
 title: '小米 note5',
 id: 'xiaomi note5',
 },
 {
 title: '小米 note4',
 id: 'xiaomi note4',
 },
 {
 title: '小米 note3',
 id: 'xiaomi note3',
 },
 ],
 },
 ],
 },
 ]

 return (
 <> 
 <div
 className="menu-semantic__wrap"
 style={{ background: '#f5f7fa', padding: 20, minWidth: 400 }}
 >
 <h2>Menu</h2>
 <Row gutter={12}>
 <Col span={18}>
 <Menu
 showCollapse
 defaultExpandAll
 data={menuData}
 classNames={{
 root: 'my-menu__root',
 wrapper: 'my-menu__wrapper',
 footer: 'my-menu__footer',
 toggle: 'my-menu__toggle',
 item: 'my-menu__item',
 itemInner: 'my-menu__item-inner',
 itemIcon: 'my-menu__item-icon',
 itemContent: 'my-menu__item-content',
 itemArrow: 'my-menu__item-arrow',
 submenu: 'my-menu__submenu',
 popmenu: 'my-menu__popmenu',
 }}
 styles={{
 ...(selectedMenu ? { [selectedMenu]: { outline: '2px solid #ffbe0a' } } : {}),
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'wrapper', description: '菜单列表容器' },
 { title: 'footer', description: '底部区域' },
 { title: 'toggle', description: '收起/展开开关' },
 { title: 'item', description: '菜单项' },
 { title: 'itemInner', description: '菜单项内层' },
 { title: 'itemIcon', description: '菜单项图标' },
 { title: 'itemContent', description: '菜单项内容' },
 { title: 'itemArrow', description: '菜单项箭头' },
 { title: 'submenu', description: '内联子菜单列表' },
 { title: 'popmenu', description: '弹出子菜单列表' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => setSelectedMenu(dataItem.title as MenuSemanticName)}
 onMouseLeave={() => setSelectedMenu(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 <h2>GroupMenu</h2>
 <Row gutter={12}>
 <Col span={18}>
 <GroupMenu
 style={{ width: 240, background: '#fff' }}
 classNames={{
 root: 'my-group-menu__root',
 wrapper: 'my-group-menu__wrapper',
 item: 'my-group-menu__item',
 itemContent: 'my-group-menu__item-content',
 itemIcon: 'my-group-menu__item-icon',
 itemTitle: 'my-group-menu__item-title',
 }}
 styles={{
 ...(selectedGroupMenu
 ? { [selectedGroupMenu]: { outline: '2px solid #ffbe0a' } }
 : {}),
 }}
 data={menuData}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'wrapper', description: '滚动区域' },
 { title: 'item', description: '菜单项' },
 { title: 'itemContent', description: '菜单项内容区' },
 { title: 'itemIcon', description: '菜单项图标' },
 { title: 'itemTitle', description: '菜单项标题' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() =>
 setSelectedGroupMenu(dataItem.title as GroupMenuSemanticName)
 }
 onMouseLeave={() => setSelectedGroupMenu(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 <h2>SideMenu</h2>
 <Row gutter={12}>
 <Col span={18}>
 <SideMenu
 data={menuData}
 style={{ width: 200, background: '#fff' }}
 classNames={{
 root: 'my-side-menu__root',
 wrapper: 'my-side-menu__wrapper',
 itemWrapper: 'my-side-menu__item-wrapper',
 item: 'my-side-menu__item',
 itemIcon: 'my-side-menu__item-icon',
 itemTitle: 'my-side-menu__item-title',
 }}
 styles={{
 ...(selectedSideMenu
 ? { [selectedSideMenu]: { outline: '2px solid #ffbe0a' } }
 : {}),
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'wrapper', description: '滚动区域' },
 { title: 'itemWrapper', description: '菜单项外层包裹' },
 { title: 'item', description: '菜单项' },
 { title: 'itemIcon', description: '菜单项图标' },
 { title: 'itemTitle', description: '菜单项标题' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() => setSelectedSideMenu(dataItem.title as SideMenuSemanticName)}
 onMouseLeave={() => setSelectedSideMenu(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )
 }}
 />
 </Col>
 </Row>
 <h2>MenuSearch</h2>
 <Row gutter={12}>
 <Col span={18}>
 <MenuSearch
 data={menuData}
 defaultValue="小米"
 classNames={{
 root: 'my-menu-search__root',
 inputWrapper: 'my-menu-search__input-wrapper',
 input: 'my-menu-search__input',
 inputClear: 'my-menu-search__input-clear',
 close: 'my-menu-search__close',
 content: 'my-menu-search__content',
 header: 'my-menu-search__header',
 list: 'my-menu-search__list',
 listItem: 'my-menu-search__list-item',
 listItemTitle: 'my-menu-search__list-item-title',
 empty: 'my-menu-search__empty',
 footer: 'my-menu-search__footer',
 footerItem: 'my-menu-search__footer-item',
 footerItemIcon: 'my-menu-search__footer-item-icon',
 footerItemText: 'my-menu-search__footer-item-text',
 }}
 styles={{
 ...(selectedMenuSearch
 ? { [selectedMenuSearch]: { outline: '2px solid #ffbe0a' } }
 : {}),
 }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素' },
 { title: 'inputWrapper', description: '输入区外层' },
 { title: 'input', description: '输入框' },
 { title: 'inputClear', description: '清空按钮' },
 { title: 'close', description: '关闭按钮' },
 { title: 'content', description: '结果内容区' },
 { title: 'header', description: '结果标题' },
 { title: 'list', description: '结果列表' },
 { title: 'listItem', description: '结果项' },
 { title: 'listItemTitle', description: '结果项标题' },
 { title: 'empty', description: '无结果提示' },
 { title: 'footer', description: '底部快捷键区' },
 { title: 'footerItem', description: '快捷键项' },
 { title: 'footerItemIcon', description: '快捷键图标' },
 { title: 'footerItemText', description: '快捷键文案' },
 ]}
 render={(dataItem) => {
 return (
 <div
 onMouseEnter={() =>
 setSelectedMenuSearch(dataItem.title as MenuSearchSemanticName)
 }
 onMouseLeave={() => setSelectedMenuSearch(undefined)}
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

### Menu Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| data | 菜单项数据列表 | MenuDataItem\[] | - | \[] |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | HiBaseFieldNames | - | - |
| defaultActiveId | 默认激活的菜单项 id | ReactText | - | "" |
| activeId | 激活的菜单项 id | ReactText | - | - |
| placement | 设置菜单水平或垂直展示 | "horizontal" \| "vertical" | "horizontal" \| "vertical" | "vertical" |
| collapsed | 是否收起子菜单，菜单垂直展示时有效 | boolean | true \| false | - |
| defaultCollapsed | 默认是否收起子菜单，菜单垂直展示时有效 | boolean | true \| false | false |
| showCollapse | 是否显示收缩开关，菜单垂直展示时有效 | boolean | true \| false | false |
| showAllSubMenus | 是否以胖菜单的形式展开所有子菜单（仅在水平菜单时有效） | boolean | true \| false | false |
| accordion | 手风琴模式，菜单水平展示时有效 | boolean | true \| false | - |
| overlayClassName | 下拉框根类名 | string | - | - |
| expandedType | 弹出层展开方式 | "collapse" \| "pop" | "collapse" \| "pop" | "collapse" |
| defaultExpandAll | 首次渲染默认展开所有菜单项，为非受控模式 | boolean | true \| false | false |
| defaultExpandedIds | 首次渲染默认展开菜单项 ids 列表，为非受控模式 | ReactText\[] | - | \[] |
| expandedIds | 展开菜单项 ids 列表，开启受控 | ReactText\[] | - | - |
| onExpand | 展开菜单时回调 | ((expandedIds: ReactText\[]) => void) | - | - |
| onClick | 点击菜单选项时的回调 | ((menuId: ReactText, menuItem: MenuDataItem) => void) | - | - |
| onClickSubMenu | 点击父菜单项时的回调 | ((subMenuId: ReactText, expandedIds: ReactText\[]) => void) | - | - |
| onCollapse | 点击收缩开关时的回调 | ((collapsed: boolean) => void) | - | - |
| footerRender | 底部渲染器 | ((props: MenuFooterRenderProps) => ReactNode) | - | - |
| render | 自定义渲染菜单项 | ((menuItem: MenuDataItem, level?: number) => ReactNode) \| undefined | (menuItem: MenuDataItem, level?: number \| undefined) => ReactNode | - |
| extraHeader | 额外的头部内容 | ReactNode | - | - |
| size | 设置菜单项的尺寸 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |
| showTitleOnMini | 是否在 mini 模式下显示菜单项的标题 | boolean | true \| false | false |
| classNames | | MenuSemanticClassNames | - | - |
| styles | | MenuSemanticStyles | - | - |


### Sidebar Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| data | 菜单项数据列表 | MenuDataItem\[] | - | \[] |
| defaultActiveId | 默认激活的菜单项 id | ReactText | - | "" |
| activeId | 激活的菜单项 id | ReactText | - | - |
| showCollapse | 是否显示收缩开关，菜单垂直展示时有效 | boolean | true \| false | true |
| defaultExpandAll | 首次渲染默认展开所有菜单项，为非受控模式 | boolean | true \| false | - |
| defaultCollapsed | 默认是否收起菜单 | boolean | true \| false | false |
| collapsed | 是否收起菜单 | boolean | true \| false | - |
| onClick | 点击菜单选项时的回调 | ((menuId: ReactText, menuItem: MenuDataItem) => void) | - | - |
| onCollapse | 点击收缩开关时的回调 | ((collapsed: boolean) => void) | - | - |
| render | 自定义渲染菜单项 | ((menuItem: MenuDataItem, level?: number) => ReactNode) \| undefined | (menuItem: MenuDataItem, level?: number \| undefined) => ReactNode | - |
| extraHeader | 额外的头部内容 | ReactNode | - | - |
| showMenuArrow | 是否显示菜单箭头 | boolean | true \| false | false |
| menuWidth | 设置菜单宽度 | string \| number | string \| number | 180 |
| collapsible | 菜单可折叠 | boolean | true \| false | true |


### MenuSearch Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ---- | --------------------------------------------- | ------------------------------- | ------ |
| innerRef | | RefObject\<MenuSearchHelper> | - | - |
| clearText | | ReactNode | - | - |
| placeholder | | string | - | - |
| notFoundContent | | ReactNode | - | - |
| width | | Width\<string \| number> | string \| number \| string & {} | - |
| visible | | boolean | true \| false | - |
| data | | MenuDataItem\[] | - | - |
| defaultValue | | string | - | "" |
| value | | string | - | - |
| onChange | | ((value: string) => void) | - | - |
| onSearch | | ((value: string) => void) | - | - |
| onSelect | | ((id: ReactText, item: MenuDataItem) => void) | - | - |
| onClear | | (() => void) | - | - |
| onClose | | (() => void) | - | - |
| onEsc | | (() => void) | - | - |
| classNames | | MenuSearchSemanticClassNames | - | - |
| styles | | MenuSearchSemanticStyles | - | - |


### MenuSearchInput Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---- | ---------------------------------------------------- | ---------------------------------------------------- | ------ |
| placeholder | | string | - | - |
| inputRef | | Dispatch\<SetStateAction\<HTMLInputElement \| null>> | Dispatch\<SetStateAction\<HTMLInputElement \| null>> | - |
| width | | Width\<string \| number> | string \| number \| string & {} | - |
| value | | string | - | - |
| onChange | | ((value: string) => void) | - | - |
| onClear | | (() => void) | - | - |
| onClose | | (() => void) | - | - |
| onKeyDown | | ((e: KeyboardEvent\<HTMLInputElement>) => void) | - | - |
| semanticClassNames | | Record\<string, string> \| undefined | Record\<string, string \| undefined> | - |
| semanticStyles | | Record\<string, CSSProperties> \| undefined | Record\<string, CSSProperties \| undefined> | - |


### GroupMenu Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------- | ------ | ------ |
| data | 菜单项数据列表 | MenuDataItem\[] | - | "\[]" |
| defaultActiveId | 默认激活的菜单项 id | ReactText | - | "" |
| activeId | 激活的菜单项 id | ReactText | - | - |
| onClick | 点击菜单选项时的回调 | ((evt: MouseEvent\<HTMLDivElement, MouseEvent>, menuId: ReactText, menuItem: MenuDataItem) => void) | - | - |
| titleRender | 自定义渲染菜单项标题 | ((menuItem: MenuDataItem) => ReactNode) | - | - |
| classNames | | GroupMenuSemanticClassNames | - | - |
| styles | | GroupMenuSemanticStyles | - | - |


### SideMenu Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------------- | ------------------------ | ------ |
| width | 侧边菜单宽度 | number | - | - |
| mini | 是否为迷你模式 | boolean | true \| false | - |
| defaultActiveId | 默认激活的菜单项 | ReactText \| null | null \| string \| number | null |
| activeId | 激活的菜单项 | ReactText \| null | null \| string \| number | - |
| selectedId | 选中的菜单项 | ReactText \| null | null \| string \| number | - |
| data | 侧边菜单数据 | MenuDataItem\[] | - | "\[]" |
| childrenContainerRef | 子菜单容器引用 | RefObject\<HTMLDivElement> | - | - |
| onClick | 点击侧边菜单项 | ((event: MouseEvent\<HTMLDivElement, MouseEvent>, id: ReactText, item: MenuDataItem) => void) | - | - |
| onMouseEnter | 鼠标移入侧边菜单项 | ((event: MouseEvent\<HTMLDivElement, MouseEvent>, id: ReactText, item: MenuDataItem) => void) | - | - |
| onMouseLeave | 鼠标移出侧边菜单项 | ((event: MouseEvent\<HTMLDivElement, MouseEvent>, id: ReactText, item: MenuDataItem) => void) | - | - |
| classNames | | SideMenuSemanticClassNames | - | - |
| styles | | SideMenuSemanticStyles | - | - |


## Type

### MenuDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------------------------ | -------------- | ------------- | ------ |
| id | 菜单项唯一标识 | ReactText | - | - |
| title | 菜单项标题 | ReactNode | - | - |
| icon | 菜单项 icon | ReactNode | - | - |
| disabled | 菜单项是否禁止点击 | boolean | true \| false | false |
| children | 子菜单项配置 | MenuDataItem[] | - | - |
