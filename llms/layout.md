# Layout 布局组件

提供了布局框架

## 使用示例

### 基础布局


```tsx
import React from 'react'
import Layout, { Header, Sider, Content, Footer } from '@hi-ui/layout' 
export const Basic = () => {
 // 侧边栏导航是否折叠
 const [collapsed, setCollapsed] = React.useState(false)

 return (
 <> 
 <div className="layout-basic__wrap" style={{ width: '100%' }}>
 <div>
 <div style={{ height: 300, marginBottom: 16 }}>
 <Layout direction="column" style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
 <Header
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 <div>Header</div>
 </Header>
 <Content
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#2660ff',
 }}
 >
 Content
 </Content>
 <Footer
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 Footer
 </Footer>
 </Layout>
 </div>
 <div style={{ height: 300, marginBottom: 16 }}>
 <Layout direction="column" style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
 <Header
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 <div>Header</div>
 </Header>
 <Layout direction="row">
 <Sider
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#4d82ff',
 boxShadow: 'none',
 }}
 resizable={false}
 collapsed={collapsed}
 onCollapse={setCollapsed}
 >
 Sider
 </Sider>
 <Content
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#2660ff',
 }}
 >
 Content
 </Content>
 </Layout>
 <Footer
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 Footer
 </Footer>
 </Layout>
 </div>
 <div style={{ height: 300, marginBottom: 16 }}>
 <Layout direction="column" style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
 <Header
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 <div>Header</div>
 </Header>
 <Layout direction="row">
 <Content
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#2660ff',
 }}
 >
 Content
 </Content>
 <Sider
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#4d82ff',
 boxShadow: 'none',
 }}
 resizable={false}
 collapsed={collapsed}
 onCollapse={setCollapsed}
 >
 Sider
 </Sider>
 </Layout>
 <Footer
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 Footer
 </Footer>
 </Layout>
 </div>
 <div style={{ height: 300, marginBottom: 16 }}>
 <Layout style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
 <Sider
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#4d82ff',
 boxShadow: 'none',
 }}
 resizable={false}
 collapsed={collapsed}
 onCollapse={setCollapsed}
 >
 Sider
 </Sider>
 <Layout direction="column">
 <Header
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 <div>Header</div>
 </Header>
 <Content
 style={{
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#2660ff',
 }}
 >
 Content
 </Content>
 <Footer
 style={{
 height: 60,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#74a2ff',
 }}
 >
 Footer
 </Footer>
 </Layout>
 </Layout>
 </div>
 </div>
 </div>
 </>
 )
}

```


### 侧边栏带普通菜单

默认情况下，侧边栏是展开的，可拖拽收起


```tsx
import React from 'react'
import {
 AppStoreFilled,
 QuestionCircleFilled,
 MonitorFilled,
 MobileFilled,
 PadFilled,
 EllipsisOutlined,
 PlusOutlined,
} from '@hi-ui/icons'
import {
 Button,
 Avatar,
 PageHeader,
 Space,
 Dropdown,
 Menu,
 Scrollbar,
 EllipsisTooltip,
} from '@hi-ui/hiui'
import Layout, { Sider, Content, SearchTrigger, ProfilePopover, ActionItem } from '@hi-ui/layout' 
export const WithMenu = () => {
 // 侧边栏导航是否折叠
 const [collapsed, setCollapsed] = React.useState(true)
 const [activeMenuId, setActiveMenuId] = React.useState<React.ReactText>(1)

 const [profileVisible, setProfileVisible] = React.useState(false)
 const [settingsValue, setSettingsValue] = React.useState({})

 const data = [
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: '电视',
 id: 2,
 icon: <MonitorFilled />,
 },
 {
 title: '手机',
 id: 3,
 icon: <MobileFilled />,
 children: [
 {
 title: '小米',
 id: 'xiaomi',
 },
 {
 title: '红米',
 id: 'redmi',
 },
 ],
 },
 {
 title: '平板',
 id: 4,
 icon: <PadFilled />,
 },
 ]

 return (
 <> 
 <div className="layout-with-menu__wrap" style={{ width: '100%', height: 600 }}>
 <Layout style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
 <Sider
 style={{ backgroundColor: '#edf2ff' }}
 collapsed={collapsed}
 onCollapse={setCollapsed}
 >
 <div
 style={{
 padding: '16px',
 display: 'flex',
 gap: 8,
 alignItems: 'center',
 }}
 >
 <div
 style={{
 width: 28,
 height: 28,
 borderRadius: 6,
 backgroundColor: 'rgba(124, 135, 166, 0.12)',
 }}
 ></div>
 {collapsed ? null : (
 <div style={{ flex: 1, overflow: 'hidden', fontWeight: 500, color: '#1a1d26' }}>
 <EllipsisTooltip>系统名称</EllipsisTooltip>
 </div>
 )}
 </div>
 <SearchTrigger mini={collapsed} data={data} />
 <Scrollbar>
 <Menu
 style={{
 backgroundColor: '#edf2ff',
 }}
 showTitleOnMini
 collapsed={collapsed}
 size="sm"
 defaultExpandedIds={[3]}
 activeId={activeMenuId}
 onClick={setActiveMenuId}
 data={data}
 />
 </Scrollbar>
 <div style={{ display: 'flex', flexDirection: 'column', margin: '12px 8px' }}>
 <ActionItem icon={<QuestionCircleFilled />} mini={collapsed}>
 使用手册
 </ActionItem>
 <ProfilePopover
 visible={profileVisible}
 header={
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <Avatar size="lg" />
 <div style={{ display: 'flex', flexDirection: 'column' }}>
 <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}>
 用户名
 </span>
 <span
 style={{
 fontSize: 14,
 lineHeight: '22px',
 fontWeight: 400,
 color: '#91959e',
 }}
 >
 admin@example.com
 </span>
 </div>
 </div>
 }
 footer={<div onClick={() => setProfileVisible(false)}>退出登录</div>}
 settings={{
 value: settingsValue,
 data: [
 {
 id: 'timezone',
 title: '时区',
 subtitle: 'UTC+08:00',
 children: [
 { id: 'timezone-1', title: '时区1' },
 { id: 'timezone-2', title: '时区2' },
 { id: 'timezone-3', title: '时区3' },
 ],
 },
 {
 id: 'language',
 title: '语言',
 subtitle: '中文',
 children: [
 { id: 'language-1', title: '语言1' },
 { id: 'language-2', title: '语言2' },
 { id: 'language-3', title: '语言3' },
 ],
 },
 ],
 onItemClick: (evt, item) => {
 // evt.preventDefault()
 },
 onChange: (value) => {
 setSettingsValue(value)
 setProfileVisible(false)
 },
 }}
 onClose={() => setProfileVisible(false)}
 >
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 height: 40,
 marginLeft: collapsed ? 12 : 10,
 fontSize: 14,
 cursor: 'pointer',
 }}
 onClick={() => setProfileVisible(!profileVisible)}
 >
 <Avatar size="xs" />
 {collapsed ? null : <span>用户名</span>}
 </div>
 </ProfilePopover>
 </div>
 </Sider>
 <Content>
 <PageHeader
 title="标题"
 backIcon={false}
 extra={
 <Space>
 <Dropdown
 data={[
 { id: 'add', title: '添加' },
 { id: 'edit', title: '编辑' },
 { id: 'delete', title: '删除' },
 ]}
 width={80}
 >
 <Button appearance="line" icon={<EllipsisOutlined />} />
 </Dropdown>
 <Button type="primary" appearance="line">
 次要操作
 </Button>
 <Button type="primary" icon={<PlusOutlined />}>
 主操作
 </Button>
 </Space>
 }
 />
 <div
 style={{
 flex: 1,
 borderStartStartRadius: 12,
 borderStartEndRadius: 12,
 backgroundColor: '#fff',
 boxShadow: '0 0 4px rgba(92, 94, 102, 0.06)',
 }}
 ></div>
 </Content>
 </Layout>
 </div>
 </>
 )
}

```


### 侧边栏带浮动菜单

菜单部分联动交互可根据需求自行实现，以下示例实现了一套默认联动交互


```tsx
import React from 'react'
import {
 AppStoreFilled,
 MonitorFilled,
 MobileFilled,
 PadFilled,
 MenuOutlined,
 EllipsisOutlined,
 PlusOutlined,
 QuestionCircleFilled,
} from '@hi-ui/icons'
import {
 MenuDataItem,
 GroupMenu,
 SideMenu,
 useSideMenuCascade,
 Button,
 IconButton,
 Avatar,
 PageHeader,
 EllipsisTooltip,
 Space,
 Dropdown,
} from '@hi-ui/hiui'
import Layout, {
 Sider,
 Content,
 SearchTrigger,
 FloatMenuContainer,
 AppListPopover,
 ProfilePopover,
 ActionItem,
} from '@hi-ui/layout' 
export const FloatMenu = () => {
 const [data] = React.useState<MenuDataItem[]>([
 {
 title: '首页',
 id: 1,
 icon: <AppStoreFilled />,
 },
 {
 title: 'Hello World',
 id: 2,
 icon: <MonitorFilled />,
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
 title: 'Hello World Hello World',
 id: 3,
 icon: <MobileFilled />,
 children: [
 {
 title: '小米',
 id: 'xiaomi',
 children: [
 {
 title: '小米10',
 id: 'xiaomi10',
 },
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

 // 侧边栏导航是否折叠
 const [collapsed, setCollapsed] = React.useState(true)

 // 鼠标悬浮到侧边栏菜单项的 id
 const [selectMenuId, setSelectMenuId] = React.useState<React.ReactText>('')
 // 当前激活的菜单项的 id
 const [activeMenuId, setActiveMenuId] = React.useState<React.ReactText>('xiaomi3')
 // 定时器，用于优化浮动菜单的隐藏时体验
 const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
 const timerRef2 = React.useRef<ReturnType<typeof setTimeout> | null>(null)

 const sideMenuRef = React.useRef<HTMLDivElement>(null)
 const floatContainerRef = React.useRef<HTMLDivElement>(null)
 const siderRef = React.useRef<HTMLDivElement>(null)

 const { submenuData, activeParentId } = useSideMenuCascade({
 data,
 selectId: selectMenuId,
 activeId: activeMenuId,
 })
 console.log('submenuData', submenuData)

 // 浮动菜单是否显示
 const [floatContainerVisible, setFloatContainerVisible] = React.useState(false)
 // 浮动菜单是否折叠
 const [floatContainerCollapsed, setFloatContainerCollapsed] = React.useState(true)

 // 应用列表是否显示
 const [appListPopoverVisible, setAppListPopoverVisible] = React.useState(false)
 // 激活的应用 id
 const [activeAppId, setActiveAppId] = React.useState<React.ReactText>('')

 const [profileVisible, setProfileVisible] = React.useState(false)
 const [settingsValue, setSettingsValue] = React.useState({})

 return (
 <> 
 <div className="layout-float-menu__wrap" style={{ width: '100%', height: 600 }}>
 <Layout style={{ height: '100%', backgroundColor: '#f5f8fc' }}>
 <Sider
 ref={siderRef}
 style={{ backgroundColor: '#edf2ff' }}
 collapsed={collapsed}
 onCollapse={setCollapsed}
 >
 <div
 style={{
 padding: '16px',
 display: 'flex',
 gap: 8,
 flexWrap: 'wrap',
 alignItems: 'center',
 justifyContent: 'space-between',
 }}
 >
 <div
 style={{
 width: 28,
 height: 28,
 borderRadius: 6,
 backgroundColor: 'rgba(124, 135, 166, 0.12)',
 }}
 ></div>
 {collapsed ? null : (
 <div style={{ flex: 1, overflow: 'hidden', fontWeight: 500, color: '#1a1d26' }}>
 <EllipsisTooltip>系统名称</EllipsisTooltip>
 </div>
 )}
 <AppListPopover
 visible={appListPopoverVisible}
 activeId={activeAppId}
 data={[
 {
 icon: <AppStoreFilled />,
 iconBgColor: 'BLUE',
 id: 1,
 title: '应用1',
 },
 {
 icon: 'Y',
 iconBgColor: 'SKYBLUE',
 id: 2,
 title: '应用2',
 },
 {
 icon: '',
 iconBgColor: 'CYAN',
 id: 3,
 title: '应用3',
 },
 {
 iconBgColor: 'GREEN',
 id: 4,
 title: '很长很长很长很长很长的应用名称',
 },
 {
 iconBgColor: 'PURPLE',
 id: 5,
 title: '应用5',
 },
 {
 iconBgColor: 'YELLOW',
 id: 6,
 title: '应用6',
 },
 {
 iconBgColor: 'ORANGE',
 id: 7,
 title: '应用7',
 },
 {
 iconBgColor: 'BLUE',
 id: 8,
 title: '应用8',
 },
 ]}
 titleRender={(item) => {
 return <EllipsisTooltip>{item.title as string}</EllipsisTooltip>
 }}
 onItemClick={(item) => {
 setActiveAppId(item.id)
 setAppListPopoverVisible(false)
 }}
 onOutsideClick={() => setAppListPopoverVisible(false)}
 >
 <IconButton
 style={!collapsed ? { marginInlineStart: 'auto' } : { margin: '16px auto 0' }}
 icon={<MenuOutlined size={18} />}
 effectColor="rgba(124, 135, 166, 0.15)"
 effect
 onClick={() => {
 setAppListPopoverVisible(!appListPopoverVisible)
 }}
 />
 </AppListPopover>
 </div>
 <SearchTrigger
 mini={collapsed}
 data={data}
 onClick={(evt) => {
 // 阻止默认行为，设置后不会触发默认的搜索行为
 // evt.preventDefault()
 }}
 />
 <SideMenu
 ref={sideMenuRef}
 mini={collapsed}
 selectedId={selectMenuId}
 activeId={activeParentId}
 onClick={(event, id, item) => {
 if (!item.children || item.children.length === 0) {
 setActiveMenuId(id)
 setFloatContainerVisible(false)
 setFloatContainerCollapsed(true)
 setSelectMenuId(id)
 } else {
 const submenuFirstItem = submenuData[0]?.children?.[0]
 if (submenuFirstItem) {
 setActiveMenuId(submenuFirstItem.id)
 setFloatContainerVisible(true)
 setFloatContainerCollapsed(false)
 }
 }
 }}
 onMouseEnter={(event, id, item) => {
 timerRef2.current = setTimeout(() => {
 // hover 到一级菜单时，如果有二级菜单，则显示浮动菜单，并且更新选中的菜单项
 if (item.children && item.children.length > 0) {
 setSelectMenuId(id)
 setFloatContainerVisible(true)
 }
 // 如果没有二级菜单，并且激活的一级菜单有二级菜单，则将选中的菜单项设置为激活的一级菜单
 else if (
 (data.find((item) => item.id === activeParentId)?.children?.length || 0) > 0
 ) {
 setSelectMenuId(activeParentId)
 if (floatContainerCollapsed) {
 setFloatContainerVisible(false)
 }
 }
 }, 200)

 if (timerRef.current) {
 clearTimeout(timerRef.current)
 }
 }}
 onMouseLeave={(event, id, item) => {
 if (timerRef2.current) {
 clearTimeout(timerRef2.current)
 }
 // 当鼠标离开菜单时，将当前选中的菜单项设置为父级菜单项
 if (
 !sideMenuRef.current?.contains(event.relatedTarget as Node) &&
 !floatContainerRef.current?.contains(event.relatedTarget as Node) &&
 !siderRef.current?.contains(event.relatedTarget as Node)
 ) {
 // 如果选中的菜单项不是激活的一级菜单，并且激活的一级菜单有二级菜单，或者浮动菜单折叠，则将选中的菜单项设置为激活的一级菜单
 if (
 (id !== activeParentId &&
 (data.find((item) => item.id === activeParentId)?.children?.length || 0) >
 0) ||
 floatContainerCollapsed
 ) {
 setSelectMenuId(activeParentId)
 }
 }

 timerRef.current = setTimeout(() => {
 setFloatContainerVisible(false)
 }, 200)
 }}
 data={data}
 />
 <div
 style={{
 display: 'flex',
 flexDirection: 'column',
 margin: '12px 8px',
 marginBlockStart: 'auto',
 }}
 >
 <ActionItem icon={<QuestionCircleFilled />} mini={collapsed}>
 使用手册
 </ActionItem>
 <ProfilePopover
 visible={profileVisible}
 header={
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <Avatar size="lg" />
 <div style={{ display: 'flex', flexDirection: 'column' }}>
 <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}>
 用户名
 </span>
 <span
 style={{
 fontSize: 14,
 lineHeight: '22px',
 fontWeight: 400,
 color: '#91959e',
 }}
 >
 admin@example.com
 </span>
 </div>
 </div>
 }
 footer={<div onClick={() => setProfileVisible(false)}>退出登录</div>}
 settings={{
 value: settingsValue,
 data: [
 {
 id: 'timezone',
 title: '时区',
 subtitle: 'UTC+08:00',
 children: [
 { id: 'timezone-1', title: '时区1' },
 { id: 'timezone-2', title: '时区2' },
 { id: 'timezone-3', title: '时区3' },
 ],
 },
 {
 id: 'language',
 title: '语言',
 subtitle: '中文',
 children: [
 { id: 'language-1', title: '语言1' },
 { id: 'language-2', title: '语言2' },
 { id: 'language-3', title: '语言3' },
 ],
 },
 ],
 onItemClick: (evt, item) => {
 // evt.preventDefault()
 },
 onChange: (value) => {
 setSettingsValue(value)
 setProfileVisible(false)
 },
 }}
 onClose={() => setProfileVisible(false)}
 >
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 height: 40,
 marginLeft: collapsed ? 12 : 10,
 fontSize: 14,
 cursor: 'pointer',
 }}
 onClick={() => setProfileVisible(!profileVisible)}
 >
 <Avatar size="xs" />
 {collapsed ? null : <span>用户名</span>}
 </div>
 </ProfilePopover>
 </div>
 </Sider>
 <FloatMenuContainer
 ref={floatContainerRef}
 width={180}
 visible={floatContainerVisible}
 collapsed={floatContainerCollapsed}
 onCollapse={(collapsed) => {
 setFloatContainerCollapsed(collapsed)
 if (collapsed) {
 setFloatContainerVisible(false)
 } else {
 setFloatContainerVisible(true)
 }
 }}
 onMouseEnter={() => {
 setFloatContainerVisible(true)

 if (timerRef.current) {
 clearTimeout(timerRef.current)
 }
 }}
 onMouseLeave={(event) => {
 timerRef.current = setTimeout(() => {
 setFloatContainerVisible(false)
 }, 200)

 // 当鼠标离开菜单时，将当前选中的菜单项设置为父级菜单项
 if (
 !sideMenuRef.current?.contains(event.relatedTarget as Node) &&
 !floatContainerRef.current?.contains(event.relatedTarget as Node) &&
 !siderRef.current?.contains(event.relatedTarget as Node)
 ) {
 // 如果激活的一级菜单有二级菜单，或者浮动菜单折叠，则将选中的菜单项设置为激活的一级菜单
 if (
 (data.find((item) => item.id === activeParentId)?.children?.length || 0) > 0 ||
 floatContainerCollapsed
 ) {
 setSelectMenuId(activeParentId)
 }
 }
 }}
 >
 <GroupMenu
 activeId={activeMenuId}
 data={submenuData}
 onClick={(evt, id, item) => {
 setActiveMenuId(id)
 }}
 />
 </FloatMenuContainer>
 <Content style={!floatContainerCollapsed ? { paddingLeft: 0 } : {}}>
 <PageHeader
 title="标题"
 backIcon={false}
 extra={
 <Space>
 <Dropdown
 data={[
 { id: 'add', title: '添加' },
 { id: 'edit', title: '编辑' },
 { id: 'delete', title: '删除' },
 ]}
 width={80}
 >
 <Button appearance="line" icon={<EllipsisOutlined />} />
 </Dropdown>
 <Button type="primary" appearance="line">
 次要操作
 </Button>
 <Button type="primary" icon={<PlusOutlined />}>
 主操作
 </Button>
 </Space>
 }
 />
 <div
 style={{
 flex: 1,
 borderStartStartRadius: 12,
 borderStartEndRadius: 12,
 backgroundColor: '#fff',
 boxShadow: '0 0 4px rgba(92, 94, 102, 0.06)',
 }}
 ></div>
 </Content>
 </Layout>
 </div>
 </>
 )
}

```


### 顶部导航栏


```tsx
import React from 'react'
import { SearchOutlined, BellOutlined, AppStoreFilled, MenuOutlined } from '@hi-ui/icons'
import { Button, Avatar, EllipsisTooltip, TabList } from '@hi-ui/hiui'
import Layout, { Header, Content, AppListPopover, ProfilePopover } from '@hi-ui/layout' 
export const WithHeader = () => {
 const [appListPopoverVisible, setAppListPopoverVisible] = React.useState(false)
 const [activeAppId, setActiveAppId] = React.useState<React.ReactText | undefined>(undefined)
 const [profileVisible, setProfileVisible] = React.useState(false)
 const [settingsValue, setSettingsValue] = React.useState({})

 return (
 <> 
 <div
 className="layout-with-header__wrap"
 style={{
 width: '100%',
 height: 600,
 padding: 12,
 boxSizing: 'border-box',
 backgroundColor: '#f5f8fc',
 }}
 >
 <Layout direction="column" style={{ height: '100%' }}>
 <Header
 style={{
 height: 60,
 padding: '0 12px',
 alignItems: 'center',
 borderBottom: '1px solid #edeff2',
 backgroundColor: '#fff',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', marginInlineEnd: 20 }}>
 <div
 style={{
 width: 24,
 height: 24,
 backgroundColor: 'rgba(124, 135, 166, 0.12)',
 borderRadius: 6,
 marginInlineEnd: 8,
 }}
 ></div>
 <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1d26' }}>系统名称</div>
 </div>
 <div style={{ flex: 1 }}>
 <TabList
 size="lg"
 data={[
 { tabId: '1', tabTitle: '菜单1' },
 { tabId: '2', tabTitle: '菜单2' },
 { tabId: '3', tabTitle: '菜单3' },
 { tabId: '4', tabTitle: '菜单4' },
 { tabId: '5', tabTitle: '菜单5' },
 ]}
 />
 </div>
 <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center' }}>
 <Button icon={<SearchOutlined size={20} />} appearance="text" size="sm" />
 <Button icon={<BellOutlined size={20} />} appearance="text" size="sm" />
 <AppListPopover
 placement="bottom-end"
 visible={appListPopoverVisible}
 activeId={activeAppId}
 data={[
 {
 icon: <AppStoreFilled />,
 iconBgColor: 'BLUE',
 id: 1,
 title: '应用1',
 },
 {
 icon: 'Y',
 iconBgColor: 'SKYBLUE',
 id: 2,
 title: '应用2',
 },
 {
 icon: '',
 iconBgColor: 'CYAN',
 id: 3,
 title: '应用3',
 },
 {
 iconBgColor: 'GREEN',
 id: 4,
 title: '很长很长很长很长很长的应用名称',
 },
 {
 iconBgColor: 'PURPLE',
 id: 5,
 title: '应用5',
 },
 {
 iconBgColor: 'YELLOW',
 id: 6,
 title: '应用6',
 },
 {
 iconBgColor: 'ORANGE',
 id: 7,
 title: '应用7',
 },
 {
 iconBgColor: 'BLUE',
 id: 8,
 title: '应用8',
 },
 ]}
 titleRender={(item) => {
 return <EllipsisTooltip>{item.title as string}</EllipsisTooltip>
 }}
 onItemClick={(item) => {
 setActiveAppId(item.id)
 setAppListPopoverVisible(false)
 }}
 onOutsideClick={() => setAppListPopoverVisible(false)}
 >
 <Button
 icon={<MenuOutlined size={16} />}
 appearance="text"
 size="sm"
 onClick={() => {
 setAppListPopoverVisible(!appListPopoverVisible)
 }}
 />
 </AppListPopover>
 <ProfilePopover
 visible={profileVisible}
 placement="bottom-end"
 header={
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <Avatar size="lg" />
 <div style={{ display: 'flex', flexDirection: 'column' }}>
 <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}>
 用户名
 </span>
 <span
 style={{
 fontSize: 14,
 lineHeight: '22px',
 fontWeight: 400,
 color: '#91959e',
 }}
 >
 admin@example.com
 </span>
 </div>
 </div>
 }
 footer={<div onClick={() => setProfileVisible(false)}>退出登录</div>}
 settings={{
 value: settingsValue,
 data: [
 {
 id: 'timezone',
 title: '时区',
 subtitle: 'UTC+08:00',
 children: [
 { id: 'timezone-1', title: '时区1' },
 { id: 'timezone-2', title: '时区2' },
 { id: 'timezone-3', title: '时区3' },
 ],
 },
 {
 id: 'language',
 title: '语言',
 subtitle: '中文',
 children: [
 { id: 'language-1', title: '语言1' },
 { id: 'language-2', title: '语言2' },
 { id: 'language-3', title: '语言3' },
 ],
 },
 ],
 onItemClick: (evt, item) => {
 // evt.preventDefault()
 },
 onChange: (value) => {
 setSettingsValue(value)
 setProfileVisible(false)
 },
 }}
 onClose={() => setProfileVisible(false)}
 >
 <Avatar
 style={{ marginInlineStart: 20, cursor: 'pointer' }}
 size="sm"
 onClick={() => setProfileVisible(!profileVisible)}
 />
 </ProfilePopover>
 </div>
 </Header>
 <Content style={{ backgroundColor: '#fff' }}></Content>
 </Layout>
 </div>
 </>
 )
}

```


## Props

### Layout Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------- | -------- | ----------------- | ----------------- | ------ |
| direction | 布局方向 | "row" \| "column" | "row" \| "column" | "row" |


### Sider Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ------------------------------ | ------------- | ------ |
| width | 宽度 | number | - | - |
| maxWidth | 最大宽度 | number | - | - |
| resizable | 是否可调整宽度 | boolean | true \| false | true |
| collapsed | 是否折叠 | boolean | true \| false | - |
| onCollapse | 折叠回调 | ((collapsed: boolean) => void) | - | - |


### SearchTrigger Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | -------- | --------------------------------------------- | ------------------------------- | ------ |
| mini | 迷你模式 | boolean | true \| false | - |
| innerRef | | RefObject\<MenuSearchHelper> | - | - |
| clearText | | ReactNode | - | - |
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


### FloatMenuContainer Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------- | ------------------------------ | ------------- | ------ |
| width | 浮动宽度 | number | - | - |
| zIndex | 层级 | number | - | - |
| visible | 是否显示 | boolean | true \| false | - |
| collapsed | 是否折叠 | boolean | true \| false | - |
| onCollapse | 折叠回调 | ((collapsed: boolean) => void) | - | - |


### AppList Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --------------- | ----------------- | ----------------------------------------------------------------------------- | ------ | ------ |
| data | 应用列表数据 | AppListItem\[] | - | - |
| defaultActiveId | 默认激活的应用 id | ReactText | - | - |
| activeId | 激活的应用 id | ReactText | - | - |
| titleRender | 应用标题渲染 | ((item: AppListItem) => ReactNode) | - | - |
| onItemClick | 应用列表点击回调 | ((item: AppListItem, event: MouseEvent\<HTMLDivElement, MouseEvent>) => void) | - | - |


### AppListPopover Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| visible | 应用列表是否可见 | boolean | true \| false | - |
| onOpen | 应用列表打开回调 | (() => void) | - | - |
| onClose | 应用列表关闭回调 | (() => void) | - | - |
| data | 应用列表数据 | AppListItem\[] | - | - |
| defaultActiveId | 默认激活的应用 id | ReactText | - | - |
| activeId | 激活的应用 id | ReactText | - | - |
| titleRender | 应用标题渲染 | ((item: AppListItem) => ReactNode) | - | - |
| onItemClick | 应用列表点击回调 | ((item: AppListItem, event: MouseEvent\<HTMLDivElement, MouseEvent>) => void) | - | - |
| title | 气泡卡片标题 | ReactNode | - | - |
| innerRef | | Ref\<PopoverHelper> | - | - |
| classNames | | PopoverSemanticClassNames | - | - |
| styles | | PopoverSemanticStyles | - | - |
| zIndex | 手动指定 css 展示层级 | number | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | - |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "auto" \| "auto-start" \| "auto-end" \| "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" | - |
| container | 指定 portal 的容器 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| arrow | 是否展示箭头 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: SyntheticEvent\<Element, Event>) => void) | - | - |
| closeOnOutsideClick | 开启点击外部时触发 onClose 回调&#xA;TODO: 移除，使用失焦控制 | boolean | true \| false | - |
| onEnter | 开始动画弹出时回调 | (() => void) | - | - |
| onEntered | 结束动画弹出时回调 | (() => void) | - | - |
| onExit | 开始动画隐藏时回调 | (() => void) | - | - |
| onExited | 结束动画隐藏时回调 | (() => void) | - | - |
| crossGap | 设置基于 reference 元素的正交偏移量 | number | - | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| shouldWrapChildren | 使用标签强制包裹 children，使触发器支持 trigger 的事件 | boolean | true \| false | - |
| autoWrapChildren | 使用标签自动包裹 children，使触发器支持 trigger 的事件 | boolean | true \| false | - |
| wrapTagName | 指定包裹 children 的标签 | ElementType\<any> | - | - |
| attachEl | 吸附的元素 | HTMLElement | - | - |
| showTitleDivider | 显示标题分割线 | boolean | true \| false | - |
| trigger | 气泡卡片触发方式 | PopoverTriggerActionEnum \| PopoverTriggerActionEnum\[] | "click" \| "contextmenu" \| "hover" \| "focus" \| PopoverTriggerActionEnum\[] | - |
| mouseEnterDelay | 鼠标移入展示延时，单位：毫秒 | number | - | - |
| mouseLeaveDelay | 鼠标移出后隐藏延时，单位：毫秒 | number | - | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| popperClassName | 自定义 Popper 的 className | string | - | - |


### Profile Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| header | | ReactNode | - | - |
| footer | | ReactNode | - | - |
| settings | | { value?: Record\<string, ReactText>; data: ProfileSettingsItem\[]; placement?: PopperPlacementEnum; onItemClick?: ((evt: MouseEvent<...>, item: ProfileSettingsItem) => void) \| undefined; onChange?: ((value: Record<...>, targetItem: ProfileSettingsItem) => void) \| undefined; } \| undefined | { value?: Record\<string, ReactText> \| undefined; data: ProfileSettingsItem\[]; placement?: PopperPlacementEnum; onItemClick?: ((evt: MouseEvent<...>, item: ProfileSettingsItem) => void) \| undefined; onChange?: ((value: Record<...>, targetItem: ProfileSettingsItem) => void) \| undefined; } | - |


### ProfilePopover Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| header | | ReactNode | - | - |
| footer | | ReactNode | - | - |
| settings | | { value?: Record\<string, ReactText>; data: ProfileSettingsItem\[]; placement?: PopperPlacementEnum; onItemClick?: ((evt: MouseEvent<...>, item: ProfileSettingsItem) => void) \| undefined; onChange?: ((value: Record<...>, targetItem: ProfileSettingsItem) => void) \| undefined; } \| undefined | { value?: Record\<string, ReactText> \| undefined; data: ProfileSettingsItem\[]; placement?: PopperPlacementEnum; onItemClick?: ((evt: MouseEvent<...>, item: ProfileSettingsItem) => void) \| undefined; onChange?: ((value: Record<...>, targetItem: ProfileSettingsItem) => void) \| undefined; } | - |
| title | 气泡卡片标题 | ReactNode | - | - |
| onClose | 关闭时回调 | (() => void) | - | - |
| innerRef | | Ref\<PopoverHelper> | - | - |
| visible | 控制气泡卡片的显示和隐藏（受控） | boolean | true \| false | - |
| classNames | | PopoverSemanticClassNames | - | - |
| styles | | PopoverSemanticStyles | - | - |
| zIndex | 手动指定 css 展示层级 | number | - | - |
| onOpen | 打开时回调 | (() => void) | - | - |
| matchWidth | 自动计算匹配吸附元素的宽度与其一致 | boolean | true \| false | - |
| placement | 相对吸附元素的位置 | PopperPlacementEnum | "auto" \| "auto-start" \| "auto-end" \| "top" \| "bottom" \| "right" \| "left" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" \| "right-start" \| "right-end" \| "left-start" \| "left-end" | "right-end" |
| container | 指定 portal 的容器 | HTMLElement \| (() => HTMLElement \| null) \| null | null \| HTMLElement \| () => HTMLElement \| null | - |
| disabledPortal | 禁用 portal | boolean | true \| false | - |
| arrow | 是否展示箭头 | boolean | true \| false | - |
| onOutsideClick | 外界元素点击数触发 | ((evt: SyntheticEvent\<Element, Event>) => void) | - | - |
| closeOnOutsideClick | 开启点击外部时触发 onClose 回调&#xA;TODO: 移除，使用失焦控制 | boolean | true \| false | - |
| onEnter | 开始动画弹出时回调 | (() => void) | - | - |
| onEntered | 结束动画弹出时回调 | (() => void) | - | - |
| onExit | 开始动画隐藏时回调 | (() => void) | - | - |
| onExited | 结束动画隐藏时回调 | (() => void) | - | - |
| crossGap | 设置基于 reference 元素的正交偏移量 | number | - | - |
| modifiers | 自定义 popper.js 的装饰器 | readonly Partial\<Modifier\<string, any>>\[] | - | - |
| shouldWrapChildren | 使用标签强制包裹 children，使触发器支持 trigger 的事件 | boolean | true \| false | - |
| autoWrapChildren | 使用标签自动包裹 children，使触发器支持 trigger 的事件 | boolean | true \| false | - |
| wrapTagName | 指定包裹 children 的标签 | ElementType\<any> | - | - |
| attachEl | 吸附的元素 | HTMLElement | - | - |
| showTitleDivider | 显示标题分割线 | boolean | true \| false | - |
| trigger | 气泡卡片触发方式 | PopoverTriggerActionEnum \| PopoverTriggerActionEnum\[] | "click" \| "contextmenu" \| "hover" \| "focus" \| PopoverTriggerActionEnum\[] | "click" |
| mouseEnterDelay | 鼠标移入展示延时，单位：毫秒 | number | - | - |
| mouseLeaveDelay | 鼠标移出后隐藏延时，单位：毫秒 | number | - | - |
| gutterGap | 设置基于 reference 元素的间隙偏移量 | number | - | - |
| popperClassName | 自定义 Popper 的 className | string | - | - |


### ActionItem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | --------- | ------------- | ------ |
| icon | | ReactNode | - | - |
| mini | | boolean | true \| false | - |

