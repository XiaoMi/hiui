import React from 'react'
import Cascader from '../src'

const data = [
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
        disabled: true,
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
        disabledCheckbox: true,
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
    ],
  },
  {
    id: '1',
    title: '1',
    children: [
      {
        id: '1-0',
        title: '1-0',
        disabledCheckbox: true,
        children: [
          {
            id: '1-0-0',
            title: '1-0-0',
            checkable: false,
          },
          {
            id: '1-0-1',
            title: '1-0-1',
            children: [
              {
                id: '1-0-1-0',
                title: '1-0-1-0',
              },
              {
                id: '1-0-1-1',
                title: '1-0-1-1',
              },
            ],
          },
          {
            id: '1-0-2',
            title: '1-0-2',
          },
        ],
      },
      {
        id: '1-1',
        title: '1-1',
        checkable: false,
      },
      {
        id: '1-2',
        title: '1-2',
      },
      {
        id: '1-3',
        title: '1-3',
      },
    ],
  },
]

export const Disabled = () => {
  return (
    <>
      <h1>Disabled</h1>
      <div className="cascader-disabled__wrap">
        <Cascader
          placeholder="请选择品类"
          disabled
          searchPlaceholder="请输入搜索内容"
          data={data}
        />
      </div>

      <h1>Disabled Item</h1>
      <div className="cascader-disabled__wrap">
        <Cascader placeholder="请选择品类" searchPlaceholder="请输入搜索内容" data={data} />
      </div>
    </>
  )
}
