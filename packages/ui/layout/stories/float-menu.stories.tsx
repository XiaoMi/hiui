import React from 'react'
import { MenuDataItem, GroupMenu, SideMenu, useSideMenuCascade } from '@hi-ui/menu'
import {
  AppStoreFilled,
  UserFilled,
  SunFilled,
  PadFilled,
  MenuOutlined,
  EllipsisOutlined,
  PlusOutlined,
  DetailsFilled,
} from '@hi-ui/icons'
import Button from '@hi-ui/button'
import IconButton from '@hi-ui/icon-button'
import Layout, {
  Sider,
  Content,
  SearchTrigger,
  FloatMenuContainer,
  AppListPopover,
  ProfilePopover,
} from '../src'
import PageHeader from '@hi-ui/page-header'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown'
import Avatar from '@hi-ui/avatar'

/**
 * @title 侧边栏带浮动菜单
 * @desc 菜单部分联动交互可根据需求自行实现，以下示例实现了一套默认联动交互
 */
export const FloatMenu = () => {
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
  const [floatContainerVisible, setFloatContainerVisible] = React.useState(submenuData.length > 0)
  // 浮动菜单是否折叠
  const [floatContainerCollapsed, setFloatContainerCollapsed] = React.useState(
    submenuData.length === 0
  )

  // 应用列表是否显示
  const [appListPopoverVisible, setAppListPopoverVisible] = React.useState(false)
  // 激活的应用 id
  const [activeAppId, setActiveAppId] = React.useState<React.ReactText>('')

  const [profileVisible, setProfileVisible] = React.useState(false)
  const [settingsValue, setSettingsValue] = React.useState({})

  return (
    <>
      <h1>FloatMenu</h1>
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
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: 'rgba(124, 135, 166, 0.12)',
                  }}
                ></div>
                {collapsed ? null : (
                  <div style={{ fontWeight: 500, color: '#1a1d26' }}>系统名称</div>
                )}
              </div>
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

                if (timerRef.current) {
                  clearTimeout(timerRef.current)
                }
              }}
              onMouseLeave={(event, id, item) => {
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
                }, 100)
              }}
              data={data}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '12px 16px',
                marginBlockStart: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  height: 40,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DetailsFilled size={16} color="#7c87a6" />
                </div>
                {collapsed ? null : <span>帮助反馈</span>}
              </div>
              <ProfilePopover
                visible={profileVisible}
                header={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="lg" />
                    用户名
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
                    fontSize: 14,
                    height: 40,
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
              setFloatContainerVisible(false)

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
                marginBottom: 16,
                borderRadius: 12,
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
