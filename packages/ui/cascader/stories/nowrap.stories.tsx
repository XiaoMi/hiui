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

export const Nowrap = () => {
  return (
    <>
      <h1>Nowrap</h1>
      <p>注意：内部动态计算会消耗性能，对于高性能的表单场景不建议使用</p>
      <div className="cascader-nowrap__wrap">
        <Cascader
          searchable
          clearable
          placeholder="请选择品类"
          defaultValue={[
            '手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本',
            '红米',
            '红米4',
            '小米电视4C',
            '小米',
            '小米3',
            '小米4',
            '电视',
            '小米电视4A',
          ]}
          data={data}
        ></Cascader>
      </div>
    </>
  )
}
