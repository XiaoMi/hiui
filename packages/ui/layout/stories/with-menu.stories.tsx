import React from 'react'
import Menu from '@hi-ui/menu'
import Scrollbar from '@hi-ui/scrollbar'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons'
import Layout, { Sider, Content, SearchTrigger } from '../src'
import Button from '@hi-ui/button'
import Avatar from '@hi-ui/avatar'

/**
 * @title 带菜单的布局
 */
export const WithMenu = () => {
  // 侧边栏导航是否折叠
  const [collapsed, setCollapsed] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<React.ReactText>(1)

  const data = [
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
          ],
        },
        {
          title: '红米',
          id: 'hongmi',
        },
      ],
    },
    {
      title: '小米平板',
      id: 4,
      icon: <PadFilled />,
    },
  ]

  return (
    <>
      <h1>WithMenu</h1>
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
                flexWrap: 'wrap',
                gap: 8,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: collapsed ? 'column' : 'row',
              }}
            >
              <div
                style={{
                  width: collapsed ? 28 : `100%`,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: 'rgba(124, 135, 166, 0.12)',
                }}
              ></div>
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
            <div
              style={{
                padding: '16px',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Avatar size="xs" />
              {collapsed ? null : <span>用户名</span>}
            </div>
          </Sider>
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
