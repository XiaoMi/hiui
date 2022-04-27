import React from 'react'
import TreeSelect from '../src'

/**
 * @title 异步加载数据
 */
export const Async = () => {
  const [data] = React.useState([
    {
      title: '手机类',
      id: '0',
      disabled: true,
      children: [
        {
          title: 'Redmi系列',
          id: '0-0',
          children: [
            {
              id: '0-0-1',
              title: 'Redmi K30',
            },
            {
              id: '0-0-2',
              title: 'Redmi K30 Pro',
            },
            {
              id: '0-0-3',
              title: 'Redmi 10X 5G',
            },
            {
              id: '0-0-4',
              title: 'Redmi Note 8',
            },
            {
              id: '0-0-5',
              title: 'Redmi 9',
            },
            {
              id: '0-0-6',
              title: 'Redmi 9A',
            },
          ],
        },
        {
          title: '小米手机',
          id: '0-1',
          children: [
            {
              id: '0-1-1',
              title: '小米10 Pro',
            },
            {
              id: '0-1-2',
              title: '小米10',
            },
            {
              id: '0-1-3',
              title: '小米10 青春版 5G',
            },
            {
              id: '0-1-4',
              title: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      title: '本地电视',
      id: '1',
      children: [
        {
          title: '小米电视',
          id: '2-0',
        },
        {
          title: 'Redmi MAX 98',
          id: '2-1',
        },
        {
          title: '小米电视4A',
          id: '2-2',
        },
      ],
    },
  ])

  return (
    <>
      <h1>Async</h1>
      <div className="tree-select-async__wrap">
        <TreeSelect
          clearable
          data={data}
          dataSource={(keyword) => {
            return {
              method: 'GET',
              key: 'id',
              params: { pId: keyword },
              url: 'http://my-json-server.typicode.com/hiui-group/db/fulldata',
              transformResponse: (resp: any) => {
                console.log('transformResponse', resp)
                return resp.map((item) => {
                  return {
                    ...item,
                    id: item.code || item.id,
                    title: item.name || item.title,
                  }
                })
              },
            }
          }}
        />
      </div>
    </>
  )
}
