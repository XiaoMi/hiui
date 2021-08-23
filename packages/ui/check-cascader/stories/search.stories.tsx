import React from 'react'
import CheckCascader from '../src'

const data = [
  {
    id: 'up-1',
    title: 'up',
    children: [
      {
        id: 'up-1-0',
        title: '小米',
        children: [
          {
            id: 'up-1-0-0',
            title: 'leaf',
          },
        ],
      },
      {
        id: 'up-1-1',
        title: '1-1',
      },
    ],
  },
  {
    id: '0',
    title: '0',
    children: [
      {
        id: '0-0',
        title: '0-0',
        children: [
          {
            id: '0-0-0',
            title: '0-0-0',
          },
          {
            id: '0-0-1',
            title: '0-0-1',
          },
          {
            id: '0-0-2',
            title: '0-0-2',
          },
        ],
      },
      {
        id: '0-1',
        title: '0-1',
        checkable: true,
        children: [
          {
            id: '0-1-0',
            title: '0-1-0',
          },
          {
            id: '0-1-1',
            title: '0-1-1',
          },
        ],
      },
      {
        id: '0-2',
        title: '0-2',
        checkable: true,
        children: [
          {
            id: '0-2-0',
            title: '0-2-0',
          },
          {
            id: '0-2-1',
            title: '0-2-1',
          },
        ],
      },
      {
        id: '0-3',
        title: '0-3',
        children: [
          {
            id: '0-3-0',
            title: '0-3-0',
          },
          {
            id: '0-3-1',
            title: '0-3-1',
          },
          {
            id: '0-3-2',
            title: '0-3-2',
          },
        ],
      },
      {
        id: '0-4',
        title: '0-4',
        checkable: true,
        children: [
          {
            id: '0-4-0',
            title: '0-4-0',
          },
          {
            id: '0-4-1',
            title: '0-4-1',
          },
        ],
      },
      {
        id: '0-5',
        title: '0-5',
        checkable: true,
        children: [
          {
            id: '0-5-0',
            title: '0-5-0',
          },
          {
            id: '0-5-1',
            title: '0-5-1',
          },
        ],
      },
      {
        id: '0-6',
        title: '0-6',
        children: [
          {
            id: '0-6-0',
            title: '0-6-0',
          },
          {
            id: '0-6-1',
            title: '0-6-1',
          },
          {
            id: '0-6-2',
            title: '0-6-2',
          },
        ],
      },
      {
        id: '0-7',
        title: '0-7',
        checkable: true,
        children: [
          {
            id: '0-7-0',
            title: '0-7-0',
          },
          {
            id: '0-7-1',
            title: '0-7-1',
          },
        ],
      },
      {
        id: '0-8',
        title: '0-8',
        checkable: true,
        children: [
          {
            id: '0-8-0',
            title: '0-8-0',
          },
          {
            id: '0-8-1',
            title: '0-8-1',
          },
        ],
      },
    ],
  },
  {
    id: '1',
    title: '1',
    children: [
      {
        id: '1-0',
        title: '1-0',
      },
      {
        id: '1-1',
        title: '1-1',
      },
    ],
  },
  {
    id: '2',
    title: '2',
    children: [
      {
        id: '2-0',
        title: '2-0',
      },
      {
        id: '2-1',
        title: '2-1',
      },
    ],
  },
]

const getDataOnlyLastCheckable = (data: any) => {
  return data.map((item) => {
    if (item.children) {
      item.checkable = item.checkable ?? false
      item.children = getDataOnlyLastCheckable(item.children)
    } else {
      item.checkable = true
    }

    return item
  })
}

const dataOnlyLastCheckable = getDataOnlyLastCheckable(data)

export const Search = () => {
  console.log(dataOnlyLastCheckable)

  return (
    <>
      <h1>Search</h1>
      <div className="cascader-search__wrap">
        <CheckCascader
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
          data={dataOnlyLastCheckable}
        />
      </div>

      <h1>Search with UpMatch</h1>
      <div className="cascader-search__wrap">
        <CheckCascader upMatch data={dataOnlyLastCheckable} />
      </div>
    </>
  )
}
