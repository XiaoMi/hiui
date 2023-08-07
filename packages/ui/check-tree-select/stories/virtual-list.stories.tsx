import React from 'react'
import CheckTreeSelect from '../src'

/**
 * @title 大数据
 */
export const VirtualList = () => {
  const [data] = React.useState(() => {
    // 模拟 10^4 个数据量
    function dig(path = '0', level) {
      const list: any = []
      for (let i = 0; i < 5; i += 1) {
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
      <h1>virtualList</h1>
      <div className="check-tree-select-virtual-list__wrap">
        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          checkedMode="PARENT"
          onChange={console.log}
          virtual
          height={260}
        />
      </div>
    </>
  )
}
