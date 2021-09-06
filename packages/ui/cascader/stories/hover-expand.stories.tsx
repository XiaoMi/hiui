import React from 'react'
import Cascader from '../src'

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

export const HoverExpand = () => {
  return (
    <>
      <h1>HoverExpand</h1>
      <div className="cascader-hover-expand__wrap">
        <Cascader
          searchable
          clearable
          expandTrigger="hover"
          placeholder="请选择品类"
          defaultValue="红米"
          data={data}
        ></Cascader>
      </div>
    </>
  )
}
