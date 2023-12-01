import React from 'react'
import Menu from '../src'
import { AppStoreOutlined, UserOutlined, SunOutlined, PadOutlined } from '@hi-ui/icons'

/**
 * @title 收缩态受控
 * @desc 根据页面内容宽度，自行调整 Menu 收缩或者展开以适应空间
 */
export const Mini = () => {
  const [mini, setMini] = React.useState(true)
  const [menuData] = React.useState([
    {
      title: '首页',
      id: 1,
      icon: <AppStoreOutlined />,
    },
    {
      title: '小米MIX',
      id: 2,
      icon: <UserOutlined />,
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
          ],
        },
        {
          title: '红米',
          id: 'hongmi',
        },
        {
          title: '小米note',
          id: 'xiaominote',

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
      title: '超长超长超长字符超长超长超长字符',
      id: 4,
      icon: <PadOutlined />,
    },
  ])

  return (
    <>
      <h1>Mini</h1>
      <div
        className="menu-mini__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <Menu showCollapse collapsed={mini} onCollapse={setMini} data={menuData} />
      </div>
    </>
  )
}
