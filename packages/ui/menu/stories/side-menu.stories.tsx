import React from 'react'
import { SideMenu, useSideMenuCascade, MenuDataItem } from '../src'
import Button from '@hi-ui/button'
import { AppStoreOutlined, UserOutlined, SunOutlined, PadOutlined } from '@hi-ui/icons'

/**
 * @title 侧边菜单
 */
export const SideMenuDemo = () => {
  const [data] = React.useState<MenuDataItem[]>([
    {
      title: '首页',
      id: 1,
      icon: <AppStoreOutlined />,
    },
    {
      title: '电视',
      id: 2,
      icon: <UserOutlined />,
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
      icon: <SunOutlined />,
      children: [
        {
          title: '小米',
          id: 666,
          children: [
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
      icon: <PadOutlined />,
    },
  ])
  const [selectId, setSelectId] = React.useState<React.ReactText>('')
  const [activeId, setActiveId] = React.useState<React.ReactText>('xiaomi3')
  const [width, setWidth] = React.useState(180)

  const { submenuData, activeParentId } = useSideMenuCascade({
    data,
    selectId,
    activeId,
  })

  console.log(submenuData, activeParentId)

  return (
    <>
      <h1>SideMenu</h1>
      <div className="menu-basic__wrap" style={{}}>
        <Button onClick={() => setWidth(width === 180 ? 60 : 180)}>Collapse</Button>
        <br />
        <br />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexDirection: 'column',
            background: '#f5f7fa',
          }}
        >
          <SideMenu
            style={{ width }}
            mini={width === 60}
            activeId={activeParentId}
            onClick={(event, id, item) => {
              console.log(id, item)
              setActiveId(id)
            }}
            onMouseEnter={(event, id, item) => {
              setSelectId(id)
            }}
            onMouseLeave={(event, id, item) => {
              setSelectId('')
            }}
            data={data}
          />
        </div>
      </div>
    </>
  )
}
