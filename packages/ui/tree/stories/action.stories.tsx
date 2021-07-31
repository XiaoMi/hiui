import React from 'react'
import Tree, { useTreeEdit } from '../src'

const data = [
  {
    id: 1,
    title: '小米',
    children: [
      {
        id: 2,
        title: '研发',
        children: [
          { id: 3, title: '后端' },
          { id: 4, title: '运维' },
          { id: 5, title: '前端' },
        ],
      },
      { id: 6, title: '产品' },
    ],
  },
  {
    id: 11,
    title: '大米',
    children: [
      { id: 22, title: '可视化' },
      { id: 66, title: 'HiUI' },
    ],
  },
]

export const Action = () => {
  const treeProps = useTreeEdit({
    editable: true,
    data,
  })

  return (
    <>
      <h1>Action for Tree</h1>
      <div className="tree-search__wrap">
        <Tree {...treeProps} />
      </div>
    </>
  )
}
