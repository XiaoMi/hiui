import React from 'react'
import Tree from '../src'

function dig(path = '0', level = 3) {
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

export const VirtualList = () => {
  console.error(treeData)

  return (
    <>
      <h1>VirtualList for Tree</h1>
      <div className="tree-basic__wrap">
        <Tree height={300} data={treeData}></Tree>
      </div>
    </>
  )
}
