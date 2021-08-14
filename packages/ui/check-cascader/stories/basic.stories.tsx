import React from 'react'
import CheckCascader from '../src'

const data = [
  {
    id: '手机',
    title: '手机',
    children: [
      {
        id: '小米',
        title: '小米',
        children: [
          {
            id: '小米3',
            title: '小米3',
          },
          {
            id: '小米4',
            title: '小米4',
          },
        ],
      },
      {
        id: '红米',
        title: '红米',
        children: [
          {
            id: '红米3',
            title: '红米3',
          },
          {
            id: '红米4',
            title: '红米4',
          },
        ],
      },
    ],
  },
  {
    id: '电视',
    title: '电视',
    children: [
      {
        id: '小米电视4A',
        title: '小米电视4A',
      },
      {
        id: '小米电视4C',
        title: '小米电视4C',
      },
    ],
  },
]

const getDataOnlyLastCheckable = (data: any) => {
  return data.map((item) => {
    if (item.children) {
      item.checkable = false
      item.children = getDataOnlyLastCheckable(item.children)
    }

    return item
  })
}

const dataOnlyLastCheckable = getDataOnlyLastCheckable(data)
console.log(dataOnlyLastCheckable)

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="cascader-basic__wrap">
        <CheckCascader
          defaultValue={['手机', '红米', '红米4']}
          data={dataOnlyLastCheckable}
        ></CheckCascader>
      </div>
    </>
  )
}
