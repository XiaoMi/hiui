import React from 'react'
import Menu from '../src'
import { AppStoreOutlined, SunOutlined } from '@hi-ui/icons'

/**
 * @title 默认展开所有
 * @desc 在初次渲染时，展开所有节点
 */
export const DefaultExpandAll = () => {
  return (
    <>
      <h1>DefaultExpandAll</h1>
      <div
        className="menu-expand-all__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <Menu
          showCollapse
          defaultExpandAll
          data={[
            {
              title: '首页',
              id: 1,
              icon: <AppStoreOutlined />,
            },
            {
              title: '小米手机',
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
                      disabled: true,
                    },
                    {
                      title: '小米7',
                      id: 'xiaomi7',
                    },
                    {
                      title: '小米6',
                      id: 'xiaomi6',
                    },
                  ],
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
                  ],
                },
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
