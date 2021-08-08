import React from 'react'
import Tree from '../src'

export const VirtualList = () => {
  const [treeData, setTreeData] = React.useState([
    {
      id: 1,
      title: '小米',
      children: [
        {
          id: 2,
          title: '技术',
          children: [
            { id: 3, title: '后端' },
            { id: 4, title: '运维' },
            { id: 5, title: '前端' },
          ],
        },
        {
          id: 6,
          title: '产品',

          children: [
            { id: 61, title: '后端' },
            { id: 62, title: '运维' },
            { id: 63, title: '前端' },
          ],
        },
        {
          id: 8,
          title: '发发发',

          children: [],
        },
      ],
    },
    {
      id: 11,
      title: '大米',
      children: Array(100)
        .fill(null)
        .map((_, index) => ({ id: '大米' + index, title: '技术' + index })),
    },
  ])

  return (
    <>
      <h1>VirtualList for Tree</h1>
      <div className="tree-basic__wrap">
        <Tree height={300} data={treeData}></Tree>
      </div>
    </>
  )
}
