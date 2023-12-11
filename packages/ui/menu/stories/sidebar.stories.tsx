import React from 'react'
import { Sidebar, MenuDataItem, filterTreeData } from '../src'
import Search, { SearchDataItem } from '@hi-ui/search'
import Tooltip from '@hi-ui/tooltip'
import {
  AppStoreOutlined,
  UserOutlined,
  SunOutlined,
  PadOutlined,
  SearchOutlined,
} from '@hi-ui/icons'

/**
 * @title 基础用法
 * @desc 当导航的菜单项和层级较多时适用，可收起
 */
export const SidebarMenu = () => {
  const [activeId, setActiveId] = React.useState<React.ReactText>('xiaomi1')
  const [searchKey, setSearchKey] = React.useState<string>('')
  const [data] = React.useState<MenuDataItem[]>([
    {
      title: '首页',
      id: '1',
      icon: <AppStoreOutlined />,
      children: [
        {
          title: '新品发布',
          id: '1-1',
          icon: <AppStoreOutlined />,
          children: [
            {
              title: '新品发布',
              id: '1-1-1',
            },
          ],
        },
        {
          title: '在线反馈',
          id: '1-2',
          icon: <AppStoreOutlined />,
          children: [
            {
              title: '在线反馈',
              id: '1-2-1',
            },
            {
              title: '在线人员处理',
              id: '1-2-2',
            },
          ],
        },
      ],
    },
    {
      title: '小米MIX',
      id: '2',
      icon: <UserOutlined />,
      children: [
        {
          title: '小米Mix',
          id: '2-1',
          icon: <AppStoreOutlined />,
          children: [
            {
              title: '小米Mix1',
              id: '2-1-1',
            },
            {
              title: '小米Mix2',
              id: '2-1-2',
            },
            {
              title: '小米Mix3',
              id: '2-1-3',
            },
          ],
        },
      ],
    },
    {
      title: '手机',
      id: 'shouji',
      icon: <SunOutlined />,
      children: [
        {
          title: '小米',
          id: 'xiaomi',
          icon: <SunOutlined />,
          children: [
            {
              title: '小米1',
              id: 'xiaomi1',
            },
            {
              title: '小米2',
              id: 'xiaomi2',
              disabled: true,
            },
            {
              title: '小米3',
              id: 'xiaomi3',
            },
            {
              title: '小米4',
              id: 'xiaomi4',
            },
            {
              title: '小米5',
              id: 'xiaomi5',
            },
          ],
        },
        {
          title: '红米',
          id: 'hongmi',
          icon: <SunOutlined />,
          children: [
            {
              title: '红米1',
              id: 'redmi1',
            },
            {
              title: '红米2',
              id: 'redmi2',
            },
            {
              title: '红米3',
              id: 'redmi3',
            },
          ],
        },
        {
          title: '小米note',
          id: 'xiaominote',
          icon: <SunOutlined />,
          children: [
            {
              title: '小米 note7',
              id: 'xiaomi note7',
            },
            {
              title: '小米 note6',
              id: 'xiaomi note6',
            },
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
          ],
        },
      ],
    },
    {
      title: (
        <Tooltip title={'超长超长超长字符超长超长超长字符'} placement="right">
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            超长超长超长字符超长超长超长字符
          </div>
        </Tooltip>
      ),
      id: '4',
      icon: <PadOutlined />,
    },
  ])

  const showData = React.useMemo(() => {
    return (filterTreeData(data, searchKey, activeId, 2) ?? []) as SearchDataItem[]
  }, [activeId, data, searchKey])

  return (
    <>
      <h1>SidebarMenu</h1>
      <div
        className="menu-basic__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600, height: 400 }}
      >
        <div style={{ background: '#fff', height: '100%' }}>
          <Sidebar
            activeId={activeId}
            onClick={setActiveId}
            data={data}
            render={(data, level) => {
              return data.title
            }}
            extraHeader={
              <div style={{ marginBottom: 8 }}>
                <Search
                  prefix={<SearchOutlined />}
                  append={null}
                  placeholder="搜素"
                  data={showData}
                  onInput={(e) => {
                    // @ts-ignore
                    setSearchKey(e.target.value)
                  }}
                  onChange={setSearchKey}
                />
              </div>
            }
          />
        </div>
      </div>
    </>
  )
}
