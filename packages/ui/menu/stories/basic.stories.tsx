import React from 'react'
import Menu from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="menu-basic__wrap">
        <Menu
          showCollapse
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
              children: [
                {
                  content: '小米',

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
