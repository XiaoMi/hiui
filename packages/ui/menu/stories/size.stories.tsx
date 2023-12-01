import React from 'react'
import Menu from '../src'
import { AppStoreOutlined, UserOutlined, SunOutlined, PadOutlined } from '@hi-ui/icons'

/**
 * @title 设置尺寸
 * @desc 默认是 lg 尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div
        className="menu-size__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <h2>lg</h2>
        <Menu
          showCollapse
          size="lg"
          data={[
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
          ]}
        />
        <h2>md</h2>
        <Menu
          showCollapse
          size="md"
          data={[
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
          ]}
        />
        <h2>sm</h2>
        <Menu
          showCollapse
          size="sm"
          data={[
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
          ]}
        />
      </div>
    </>
  )
}
