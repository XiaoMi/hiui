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
import { Button, Avatar, PageHeader, Space, Dropdown, Menu, Scrollbar } from '@hi-ui/hiui'
import Layout, { Sider, Content, SearchTrigger, ProfilePopover, ActionItem } from '../src'

/**
 * @title 侧边栏带普通菜单
 * @desc 默认情况下，侧边栏是展开的，可拖拽收起
 */
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
            <div style={{ display: 'flex', flexDirection: 'column', margin: '12px 8px' }}>
              <ActionItem icon={<QuestionCircleFilled />} mini={collapsed}>
                使用手册
              </ActionItem>
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
