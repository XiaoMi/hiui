import React from 'react'
import Tree from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic for Tree</h1>
      <div className="tree-basic__wrap">
        <Tree
          data={[
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
              title: '小米',
              children: [
                { id: 22, title: '技术' },
                { id: 66, title: '产品' },
              ],
            },
          ]}
        ></Tree>
      </div>
    </>
  )
}
