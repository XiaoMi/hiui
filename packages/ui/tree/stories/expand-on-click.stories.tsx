import React from 'react'
import Tree from '../src'

/**
 * @title 选中节点时展开其子节点
 */
export const ExpandOnSelect = () => {
  return (
    <>
      <h1>ExpandOnSelect for Tree</h1>
      <div className="tree-expand-on-click__wrap">
        <Tree
          expandOnSelect
          onSelect={console.log}
          data={[
            {
              id: 1,
              title: '小米',
              children: [
                {
                  id: 2,
                  title: '研发',
                  disabled: true,
                  children: [
                    { id: 3, title: '后端', disabled: true },
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
          ]}
        ></Tree>
      </div>
    </>
  )
}
