import React from 'react'
import { SearchOutlined, BellOutlined, AppStoreFilled, MenuOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import Avatar from '@hi-ui/avatar'
import { TabList } from '@hi-ui/tabs'
import Layout, { Header, Content, AppListPopover } from '../src'

/**
 * @title 顶部导航栏
 */
export const WithHeader = () => {
  const [appListPopoverVisible, setAppListPopoverVisible] = React.useState(false)
  const [activeAppId, setActiveAppId] = React.useState<React.ReactText | undefined>(undefined)

  return (
    <>
      <h1>WithHeader</h1>
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
              <Avatar style={{ marginInlineStart: 20 }} size="sm" />
            </div>
          </Header>
          <Content style={{ backgroundColor: '#fff' }}></Content>
        </Layout>
      </div>
    </>
  )
}
