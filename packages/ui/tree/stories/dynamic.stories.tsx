import React from 'react'
import Tree from '../src'
import { cloneTree, findNodeById } from '@hi-ui/tree-utils'
import Alert from '@hi-ui/alert'

export const Dynamic = () => {
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
      title: '小米',
      children: [
        { id: 22, title: '技术' },
        { id: 66, title: '产品' },
      ],
    },
  ])

  // 加载节点
  const loadChildren = async (node) => {
    return fetch(`https://my-json-server.typicode.com/hiui-group/db/conditiondata?id=${node.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data[0]) {
          data[0].id = Math.random()
          data[0].parent = treeData
        }

        // Utils Helper: import { cloneTree, findNodeById } from '@hi-ui/utils'
        setTreeData((prev) => {
          const nextData = cloneTree(prev)
          const loadNode = findNodeById(nextData, node.id)
          loadNode.children = data
          console.log(loadNode, nextData)
          return nextData
        })

        // return data
      })
  }

  return (
    <>
      <h1>Dynamic for Tree</h1>
      <div className="tree-basic__wrap">
        <Alert
          type="danger"
          closeable={false}
          showIcon={false}
          title={
            '注意：对于异步加载子节点，可以配合 `node.isLeaf: true` 来表明是否为叶子结点。以此来告诉组件该节点是否有下一级子树'
          }
        ></Alert>
        <br />
        <Tree data={treeData} onLoadChildren={loadChildren}></Tree>
      </div>
    </>
  )
}
