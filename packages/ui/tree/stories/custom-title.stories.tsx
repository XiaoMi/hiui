import React from 'react'
import Tree from '../src'
import { TreeNodeData } from '../src/TreeNode'

const CustomTreeNodeTitle = (node: TreeNodeData) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        {/* 自定义 title 的前缀 icon */}
        <span className="custom-left-icon" style={{ marginRight: 12 }}>
          😄
        </span>
        <span>{node.title}</span>
      </div>
      {/* 自定义 title 的后缀 icon */}
      <div>
        {Array.isArray(node.children) && node.children.length > 0 ? null : (
          <span className="custom-right-icon">❤</span>
        )}
      </div>
    </div>
  )
}

export const CustomTitle = () => {
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
      children: [
        { id: 22, title: '技术' },
        { id: 66, title: '产品' },
      ],
    },
  ])

  return (
    <>
      <h1>CustomTitle for Tree</h1>
      <div className="tree-basic__wrap">
        <Tree data={treeData} titleRender={CustomTreeNodeTitle}></Tree>
      </div>
    </>
  )
}
