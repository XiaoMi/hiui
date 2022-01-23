import React from 'react'
import CheckCascader from '../src'

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
        //   const nextData = cloneTree(prev)
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
        <CheckCascader
          data={treeData}
          onLoadChildren={loadChildren}
          defaultValue={[[1]]}
          onChange={console.log}
        ></CheckCascader>
      </div>
    </>
  )
}