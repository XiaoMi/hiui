import React from 'react'
import Menu from '../src'

export const VerticalFat = () => {
  return (
    <>
      <h1>垂直胖菜单</h1>
      <div className="menu-basic__wrap" style={{ background: '#ccc', padding: 20 }}>
        <Menu
          placement="vertical"
          showAllSubMenus
          data={[
            {
              content: '电视',
              id: 1,
            },
            {
              content: '小米MIX',
              id: 2,
            },
            {
              content: '手机',
              id: 3,
              children: [
                {
                  content: '小米',
                  id: 666,

                  children: [
                    {
                      content: '小米9',
                      id: 'xiaomi9',
                    },
                    {
                      content: '小米8',
                      id: 'xiaomi8',
                      disabled: true,
                    },
                    {
                      content: '小米7',
                      id: 'xiaomi7',
                    },
                    {
                      content: '小米6',
                      id: 'xiaomi6',
                    },
                    {
                      content: '小米5',
                      id: 'xiaomi5',
                    },
                    {
                      content: '小米4',
                      id: 'xiaomi4',
                    },
                    {
                      content: '小米3',
                      id: 'xiaomi3',
                    },
                  ],
                },
                {
                  content: '红米',
                  id: 'hongmi',
                },
                {
                  content: '小米note',
                  disabled: true,
                  id: 'xiaominote',
                  children: [
                    {
                      content: '小米 note7',
                      id: 'xiaomi note7',
                    },
                    {
                      content: '小米 note6',
                      id: 'xiaomi note6',
                    },
                    {
                      content: '小米 note5',
                      id: 'xiaomi note5',
                    },
                    {
                      content: '小米 note4',
                      id: 'xiaomi note4',
                    },
                    {
                      content: '小米 note3',
                      id: 'xiaomi note3',
                    },
                  ],
                },
              ],
            },
            {
              content: '超长超长超长字符超长超长超长字符',
              id: 4,
            },
          ]}
        />
      </div>
    </>
  )
}
