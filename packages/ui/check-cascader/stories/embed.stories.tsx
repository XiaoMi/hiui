import React from 'react'
import { CheckCascaderPanel } from '../src'

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
console.log(dataOnlyLastCheckable)

export const Embed = () => {
  return (
    <>
      <h1>Embed</h1>
      <div className="cascader-basic__wrap">
        <CheckCascaderPanel defaultValue={['手机', '红米', '红米4']} data={dataOnlyLastCheckable} />
      </div>
    </>
  )
}
