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
  {
    id: '电视2',
    title: '电视2',
    children: [
      {
        id: '小米电视4C2',
        title:
          '手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本手机超长文本',
      },
      {
        id: '小米电视4A2',
        title: '小米电视4A2',
      },
    ],
  },
]

export const Nowrap = () => {
  return (
    <>
      <h1>Nowrap</h1>
      <div className="cascader-nowrap__wrap">
        <CheckCascader
          style={{ width: 300 }}
          searchable
          clearable
          wrap={false}
          placeholder="请选择品类"
          defaultValue={[
            '红米',
            '红米4',
            '小米电视4C',
            '小米',
            '小米3',
            '小米4',
            '电视',
            '小米电视4A',
            '电视2',
            '小米电视4A2',
            '小米电视4C2',
          ]}
          data={data}
        ></CheckCascader>
        <p>UI 测试：我是底部占位符</p>
        <p>UI 测试：我是底部占位符</p>
        <p>UI 测试：我是底部占位符</p>
      </div>
    </>
  )
}
