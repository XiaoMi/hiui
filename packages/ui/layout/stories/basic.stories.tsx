import React from 'react'
import Menu from '@hi-ui/menu'
import Scrollbar from '@hi-ui/scrollbar'
import { AppStoreFilled, UserFilled, SunFilled, PadFilled } from '@hi-ui/icons'
import Layout, { Sider, Content, SearchTrigger } from '../src'

export const Basic = () => {
  // 侧边栏导航是否折叠
  const [collapsed, setCollapsed] = React.useState(false)
  const [activeMenuId, setActiveMenuId] = React.useState<React.ReactText>(1)

  return (
    <>
      <h1>Basic</h1>
      <div className="layout-basic__wrap" style={{ width: 800, height: 600 }}>
        <Layout style={{ height: '100%' }}>
          <Sider
            style={{ backgroundColor: '#edf2ff' }}
            collapsed={collapsed}
            onCollapse={setCollapsed}
          >
            <div style={{ padding: '16px 14px' }}>
              <div style={{ height: 32, backgroundColor: '#f2f4f7' }}></div>
            </div>
            <SearchTrigger mini={collapsed} />
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
                        ],
                      },
                      {
                        title: '红米',
                        id: 'hongmi',
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
            </Scrollbar>
            <i
              style={{
                display: 'block',
                height: 1,
                margin: '8px 20px',
                backgroundColor: '#dbdde0',
              }}
            />
            <div>
              {/* 最近使用菜单 */}
              <Menu
                style={{
                  backgroundColor: '#edf2ff',
                }}
                showTitleOnMini
                collapsed={collapsed}
                size="sm"
                activeId={activeMenuId}
                onClick={setActiveMenuId}
                data={[
                  {
                    title: '小米MIX',
                    id: 2,
                    icon: <UserFilled />,
                  },
                ]}
              />
            </div>
            <div style={{ padding: '12px 20px' }}>
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
