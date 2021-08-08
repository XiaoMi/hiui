import React from 'react'
import Tree from '../src'
import cloneDeep from 'lodash.clonedeep'

// 给定一个结合，根据 id 寻找节点
const findNode = (itemId, data) => {
  let node
  data.forEach((d, index) => {
    if (d.id === itemId) {
      node = d
    } else {
      if (d.children && findNode(itemId, d.children)) {
        node = findNode(itemId, d.children)
      }
    }
  })
  return node
}

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
        }

        // setTreeData((prev) => {
        //   const nextData = cloneDeep(prev)
        //   const loadNode = findNode(node.id, nextData)
        //   loadNode.children = data
        //   console.log(loadNode, nextData)
        //   return nextData
        // })

        return data
      })
  }

  return (
    <>
      <h1>Dynamic for Tree</h1>
      <div className="tree-basic__wrap">
        <Tree data={treeData} onLoadChildren={loadChildren}></Tree>
      </div>
    </>
  )
}
