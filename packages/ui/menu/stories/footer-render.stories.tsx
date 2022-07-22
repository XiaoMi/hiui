import React from 'react'
import Menu from '../src'
import { AppStoreOutlined, SunOutlined } from '@hi-ui/icons'

/**
 * @title 自定义 Footer 渲染
 * @desc 自行控制底部内容展示，支持插入额外的元素等场景
 */
export const FooterRender = () => {
  return (
    <>
      <h1>FooterRender</h1>
      <div
        className="menu-footer-render__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <Menu
          showCollapse
          footerRender={({ collapsed, collapseNode }) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {collapseNode}
                {collapsed ? null : <div style={{ paddingRight: 10 }}>我是谁</div>}
              </div>
            )
          }}
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
