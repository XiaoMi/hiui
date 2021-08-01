import React from 'react'
import Tree from '../src'

export const Draggable = () => {
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
      <div className="tree-basic__wrap">
        <Tree
          showLine
          draggable
          onDrop={(dragNode, dropNode, data, level) => {
            console.log('onDrop', dragNode, dropNode, data, level)
            // setTreeData(data.after)
            return true
          }}
          data={treeData}
        ></Tree>
      </div>
    </>
  )
}
