import React from 'react'
import Menu from '../src'
import {
  // HomeOutlined,
  UserOutlined,
  SunOutlined,
  PadOutlined,
  ManOutlined,
  LockOutlined,
} from '@hi-ui/icons'

/**
 * @title 基础用法
 * @desc 当导航的菜单项和层级较多时适用，可收起
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="menu-basic__wrap" style={{ background: '#ccc', padding: 20, minWidth: 600 }}>
        <Menu
          showCollapse
          defaultExpandedIds={[3]}
          data={[
            {
              title: '首页',
              id: 1,
              // icon: <HomeOutlined />,
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
                  icon: <LockOutlined />,
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
                      icon: <ManOutlined />,
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
                  disabled: true,
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
