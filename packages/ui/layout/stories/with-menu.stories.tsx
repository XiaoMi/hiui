import React from 'react'
import Menu from '@hi-ui/menu'
import Scrollbar from '@hi-ui/scrollbar'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons'
import Layout, { Sider, Content, SearchTrigger } from '../src'

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
      <div className="layout-with-menu__wrap" style={{ width: 800, height: 600 }}>
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
            <div style={{ padding: '16px 14px' }}>
              <div style={{ height: 32, backgroundColor: '#f2f4f7' }}></div>
            </div>
          </Sider>
          <Content style={{ backgroundColor: '#f7f9fc' }}>
            <div style={{ height: 32, margin: '14px 0', backgroundColor: '#f2f4f7' }}></div>
            <div style={{ flex: 1, marginBottom: 16, backgroundColor: '#f2f4f7' }}></div>
          </Content>
        </Layout>
      </div>
    </>
  )
}
