import React from 'react'
import Menu from '../src'

/**
 * @title 水平胖菜单
 * @desc 二级菜单项，以分组的形式展示，分组数不宜过多
 */
export const HorizontalFat = () => {
  return (
    <>
      <h1>水平胖菜单</h1>
      <div
        className="menu-horizontal-fat__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <Menu
          placement="horizontal"
          showAllSubMenus
          data={[
            {
              title: '电视',
              id: 1,
            },
            {
              title: '小米MIX',
              id: 2,
            },
            {
              title: '手机',
              id: 3,
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
              title: '数码产品',
              id: 4,
            },
            {
              title: '笔记本',
              id: 5,
            },
            {
              title: '智能生活',
              id: 6,
            },
          ]}
        />
      </div>
    </>
  )
}
