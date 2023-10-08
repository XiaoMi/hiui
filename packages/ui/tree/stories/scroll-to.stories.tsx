import React from 'react'
import Tree, { TreeHelper } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 设置滚动位置
 * @desc 仅在设置 height 属性即虚拟列表下有效
 */
export const ScrollTo = () => {
  const treeRef = React.useRef<TreeHelper>(null)

  const [treeData] = React.useState(() => {
    function dig(path = '0', level) {
      const list: { title: string; id: string; children: any[] }[] = []

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
      <h1>ScrollTo for Tree</h1>
      <div className="tree-scroll-to__wrap">
        <Button
          onClick={() => {
            // key 为节点 id
            treeRef.current?.scrollTo?.({ key: '0-2-2-0-0', align: 'top' })
          }}
        >
          scroll to key: 0-2-2-0-0
        </Button>
        <Tree
          innerRef={treeRef}
          height={300}
          defaultExpandAll
          data={treeData}
          expandOnSelect
        ></Tree>
      </div>
    </>
  )
}
