import React from 'react'
import Tree from '../src'

/**
 * @title 拖拽排序
 * @desc 通过鼠标拖拽行为，改变树的层级结构
 */
export const Draggable = () => {
  const [treeData] = React.useState([
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
        { id: 6, title: '产品' },
      ],
    },
    {
      id: 11,
      title: '大米',
      children: [
        { id: 22, title: '技术' },
        { id: 66, title: '产品' },
      ],
    },
  ])

  return (
    <>
      <h1>draggable for Tree</h1>
      <div className="tree-draggable__wrap">
        <Tree
          showLine
          draggable
          onDrop={(...args) => {
            console.log('onDrop', ...args)
            // setTreeData(data.after)
            return true
          }}
          data={treeData}
          onDragStart={console.log}
          onDragEnd={console.log}
          onDragOver={console.log}
          onDragLeave={console.log}
        />
      </div>
    </>
  )
}
