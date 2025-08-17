import React from 'react'
import { MenuDataItem, GroupMenu, SideMenu, useSideMenuCascade } from '@hi-ui/menu'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons'
import Layout, { Sider, Content, SearchTrigger, FloatMenuContainer } from '../src'

/**
 * @title 带浮动菜单的侧边栏
 */
export const FloatMenu = () => {
  // 侧边栏导航是否折叠
  const [collapsed, setCollapsed] = React.useState(false)

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
  const [selectId, setSelectId] = React.useState<React.ReactText>('')
  const [activeId, setActiveId] = React.useState<React.ReactText>('xiaomi3')
  const [floatContainerVisible, setFloatContainerVisible] = React.useState(false)
  const floatContainerRef = React.useRef<HTMLDivElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const { submenuData, activeParentId } = useSideMenuCascade({
    data,
    selectId,
    activeId,
  })

  return (
    <>
      <h1>FloatMenu</h1>
      <div className="layout-float-menu__wrap" style={{ width: 800, height: 600 }}>
        <Layout style={{ height: '100%' }}>
          <Sider
            style={{ backgroundColor: '#edf2ff' }}
            collapsed={collapsed}
            onCollapse={setCollapsed}
          >
            <div style={{ padding: '16px 14px' }}>
              <div style={{ height: 32, backgroundColor: '#f2f4f7' }}></div>
            </div>
            <SearchTrigger mini={collapsed} data={data} />
            <SideMenu
              mini={collapsed}
              activeId={activeParentId}
              onClick={(event, id, item) => {
                if (!item.children || item.children.length === 0) {
                  setActiveId(id)
                }
              }}
              onMouseEnter={(event, id, item) => {
                if (item.children && item.children.length > 0) {
                  setSelectId(id)
                  setFloatContainerVisible(true)
                }

                if (timerRef.current) {
                  clearTimeout(timerRef.current)
                }
              }}
              onMouseLeave={() => {
                timerRef.current = setTimeout(() => {
                  setFloatContainerVisible(false)
                }, 100)
              }}
              data={data}
            />
          </Sider>
          <FloatMenuContainer
            ref={floatContainerRef}
            visible={floatContainerVisible}
            width={180}
            onMouseEnter={() => {
              setFloatContainerVisible(true)

              if (timerRef.current) {
                clearTimeout(timerRef.current)
              }
            }}
            onMouseLeave={() => {
              setFloatContainerVisible(false)
            }}
          >
            <GroupMenu
              activeId={activeId}
              data={submenuData}
              onClick={(evt, id, item) => {
                setActiveId(id)
              }}
            />
          </FloatMenuContainer>
          <Content style={{ backgroundColor: '#f7f9fc' }}>
            <div style={{ height: 32, margin: '14px 0', backgroundColor: '#f2f4f7' }}></div>
            <div style={{ flex: 1, marginBottom: 16, backgroundColor: '#f2f4f7' }}></div>
          </Content>
        </Layout>
      </div>
    </>
  )
}
