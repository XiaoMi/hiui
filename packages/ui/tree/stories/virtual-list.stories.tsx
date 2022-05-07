import React from 'react'
import Tree from '../src'

/**
 * @title 大数据
 */
export const VirtualList = () => {
  // 模拟 10^4 个数据量
  const [treeData] = React.useState(() => {
    function dig(path = '0', level) {
      const list = []
      for (let i = 0; i < 10; i += 1) {
        const id = `${path}-${i}`
        const treeNode = {
          title: id,
          id,
          children: [] as any[],
        }

        if (level > 0) {
          treeNode.children = dig(id, level - 1)
        }

        list.push(treeNode)
      }
      return list
    }

    const treeData = dig('0', 4)
    return treeData
  })

  return (
    <>
      <h1>VirtualList for Tree</h1>
      <div className="tree-virtual-list__wrap">
        <Tree height={300} data={treeData}></Tree>
      </div>
    </>
  )
}
