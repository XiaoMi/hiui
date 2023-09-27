import React from 'react'
import Dropdown from '../src'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@hi-ui/icons'

/**
 * @title 设置选项大小
 */
export const Size = () => {
  const [list] = React.useState([
    {
      id: '添加',
      title: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
          <span style={{ marginLeft: 6 }}>添加</span>
        </span>
      ),
      children: [
        {
          id: '2019',
          title: '2019',
          children: [
            {
              id: 'Q1',
              title: 'Q1',
              children: [
                {
                  id: '01',
                  title: '01',
                },
                {
                  id: '02',
                  title: '02',
                },
                {
                  id: '03',
                  title: '03',
                },
              ],
            },
            {
              id: 'Q2',
              title: 'Q2',
              disabled: true,
            },
            {
              id: 'Q3',
              title: 'Q3',
            },
          ],
        },
        {
          id: '2020',
          title: '2020',
          children: [
            {
              id: 'Q1',
              title: 'Q1',
              children: [
                {
                  id: '01',
                  title: '01',
                },
                {
                  id: '02',
                  title: '02',
                },
                {
                  id: '03',
                  title: '03',
                },
              ],
            },
            {
              id: 'Q2',
              title: 'Q2',
              disabled: true,
            },
            {
              id: 'Q3',
              title: 'Q3',
            },
          ],
        },
      ],
    },
    {
      id: '编辑',
      title: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
          <span style={{ marginLeft: 6 }}>编辑</span>
        </span>
      ),
      children: [
        {
          id: '2019',
          title: '2019',
          children: [
            {
              id: 'Q1',
              title: 'Q1',
              disabled: true,
              children: [
                {
                  id: '01',
                  title: '01',
                },
                {
                  id: '02',
                  title: '02',
                  children: [
                    {
                      id: '02-01',
                      title: '02-01',
                    },
                    {
                      id: '02-02',
                      title: '02-02',
                    },
                  ],
                },
                {
                  id: '03',
                  title: '03',
                  children: [
                    {
                      id: '03-01',
                      title: '03-01',
                    },
                    {
                      id: '03-02',
                      title: '03-02',
                    },
                  ],
                },
              ],
            },
            {
              id: 'Q2',
              title: 'Q2',
            },
            {
              id: 'Q3',
              title: 'Q3',
            },
          ],
        },
        {
          id: '2020',
          title: '2020',
          children: [
            {
              id: 'Q1',
              title: 'Q1',
              disabled: true,
              children: [
                {
                  id: '01',
                  title: '01',
                },
                {
                  id: '02',
                  title: '02',
                  children: [
                    {
                      id: '02-01',
                      title: '02-01',
                    },
                    {
                      id: '02-02',
                      title: '02-02',
                    },
                  ],
                },
                {
                  id: '03',
                  title: '03',
                  children: [
                    {
                      id: '03-01',
                      title: '03-01',
                    },
                    {
                      id: '03-02',
                      title: '03-02',
                    },
                  ],
                },
              ],
            },
            {
              id: 'Q2',
              title: 'Q2',
            },
            {
              id: 'Q3',
              title: 'Q3',
            },
          ],
        },
      ],
    },
    {
      id: '删除',
      title: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <DeleteOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
          <span style={{ marginLeft: 6 }}>删除</span>
        </span>
      ),
    },
  ])

  return (
    <>
      <h1>Size</h1>
      <div className="dropdown-size__wrap">
        <h2>lg</h2>
        <Dropdown
          size="lg"
          data={list}
          title="左键单击"
          trigger={'click'}
          onClick={console.log}
        />
        <h2>md</h2>
        <Dropdown
          size="md"
          data={list}
          title="左键单击"
          trigger={'click'}
          onClick={console.log}
        />
        <h2>sm</h2>
        <Dropdown
          size="sm"
          data={list}
          title="左键单击"
          trigger={'click'}
          onClick={console.log}
        />
      </div>
    </>
  )
}
