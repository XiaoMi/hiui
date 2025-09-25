import React from 'react'
import Menu from '@hi-ui/menu'
import Scrollbar from '@hi-ui/scrollbar'
import {
  AppStoreFilled,
  DetailsFilled,
  UserFilled,
  SunFilled,
  PadFilled,
  EllipsisOutlined,
  PlusOutlined,
} from '@hi-ui/icons'
import Layout, { Sider, Content, SearchTrigger } from '../src'
import Button from '@hi-ui/button'
import Avatar from '@hi-ui/avatar'
import PageHeader from '@hi-ui/page-header'
import Space from '@hi-ui/space'
import Dropdown from '@hi-ui/dropdown'

/**
 * @title 侧边栏带普通菜单
 * @desc 默认情况下，侧边栏是展开的，可拖拽收起
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
              {collapsed ? null : <div style={{ fontWeight: 500, color: '#1a1d26' }}>系统名称</div>}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, margin: '20px 16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 14,
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
                  <DetailsFilled size={18} color="#60636b" />
                </div>
                {collapsed ? null : <span>帮助反馈</span>}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 14,
                }}
              >
                <Avatar size="xs" />
                {collapsed ? null : <span>用户名</span>}
              </div>
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
