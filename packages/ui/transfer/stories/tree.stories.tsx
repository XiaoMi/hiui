import React from 'react'
import Tree, { TreeDataItem } from '@hi-ui/tree'
import Transfer, { TransferProps, TransferDataItem } from '../src'

/**
 * @title 树形穿梭框
 * @desc 自定义穿梭框的渲染
 */
export const TreeTransfer = () => {
  interface TreeTransferProps extends TransferProps {
    data: TreeDataItem[]
  }

  // 树形穿梭框组件
  const TreeTransfer = ({ data, targetIds, ...restProps }: TreeTransferProps) => {
    const transferDataSource: TransferDataItem[] = []
    function flatten(list: TreeDataItem[] = []) {
      list.forEach((item) => {
        transferDataSource.push(item)
        flatten(item.children)
      })
    }
    flatten(data)

    const generateTree = (treeNodes: TreeDataItem[] = [], checkedIds: React.ReactText[] = []) =>
      treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedIds.includes(props.id as string),
        children: generateTree(children, checkedIds),
      }))

    return (
      <Transfer
        {...restProps}
        data={transferDataSource}
        targetIds={targetIds}
        type="multiple"
        showCheckAll={false}
        leftListRender={({ checkedIds, onCheck }) => {
          const ids = [...checkedIds, ...targetIds]
          return (
            <Tree
              checkable
              defaultExpandAll
              checkedIds={ids}
              data={generateTree(data, targetIds)}
              checkedMode="SEPARATE"
              onCheck={(checkedIds) => {
                onCheck(checkedIds.filter((item) => !targetIds.includes(item)))
              }}
            />
          )
        }}
      />
    )
  }

  const [data] = React.useState(() => {
    return [
      {
        id: 1,
        title: '小米',
        children: [
          {
            id: 2,
            title: '研发',
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
        title: '大米',
        children: [
          { id: 22, title: '可视化' },
          { id: 66, title: 'HiUI' },
        ],
      },
    ]
  })

  const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([3, 5])

  return (
    <>
      <h1>Tree</h1>
      <div className="transfer-tree__wrap">
        <TreeTransfer
          data={data}
          targetIds={targetIds}
          onChange={(ids) => {
            console.log('onChange', ids)
            setTargetIds(ids)
          }}
          emptyContent={['暂无数据']}
        />
      </div>
    </>
  )
}
