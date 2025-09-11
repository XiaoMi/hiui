import React from 'react'
import { MenuDataItem, GroupMenu, SideMenu, useSideMenuCascade } from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled, MenuOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import Layout, { Sider, Content, SearchTrigger, FloatMenuContainer, AppListPopover } from '../src'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 带浮动菜单的侧边栏
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
                gap: 8,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: collapsed ? 'column' : 'row',
              }}
            >
              <div
                style={{
                  width: collapsed ? 28 : `calc(100% - ${32}px)`,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: 'rgba(124, 135, 166, 0.12)',
                }}
              ></div>
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
                <Button
                  icon={<MenuOutlined />}
                  appearance="text"
                  size="xs"
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
          </Sider>
          <FloatMenuContainer
            ref={floatContainerRef}
            width={180}
            visible={floatContainerVisible}
            collapsed={floatContainerCollapsed}
            onCollapse={setFloatContainerCollapsed}
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
            <div
              style={{
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 500, color: '#161a2d' }}>标题</div>
              <div style={{}}>
                <Button type="primary">操作按钮</Button>
              </div>
            </div>
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
