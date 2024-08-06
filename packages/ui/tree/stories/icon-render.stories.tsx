import { FileOutlined, FolderOpenOutlined, FolderOutlined } from '@hi-ui/icons'
import React from 'react'
import Tree from '../src'

/**
 * @title 自定义 Icon 函数
 */
export const IconRender = () => {
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
      <h1>IconRender for Tree</h1>
      <div className="tree-icon-render__wrap">
        <Tree
          data={treeData}
          expandOnSelect
          iconRender={(node) => {
            if (!node.children) {
              return <FileOutlined />
            }

            if (node.expanded) {
              return <FolderOpenOutlined />
            } else return <FolderOutlined />
          }}
        />
      </div>
    </>
  )
}
