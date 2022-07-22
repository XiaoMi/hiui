import React from 'react'
import Transfer from '../src'

/**
 * @title 可全选
 * @desc 快速完成源集合的全部选择，避开冗余操作
 */
export const AllCheck = () => {
  const [data] = React.useState(() => {
    const generateData = () => {
      const arr = []
      for (let i = 1; i < 100; i++) {
        arr.push({
          id: i,
          title: '选项' + i,
          disabled: i % 6 === 0,
        })
      }
      return arr
    }

    const data = generateData()
    return data
  })

  const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

  return (
    <>
      <h1>AllCheck</h1>
      <div className="transfer-all-check__wrap">
        <Transfer
          type="multiple"
          data={data}
          targetIds={targetIds}
          onChange={(ids) => setTargetIds(ids)}
          emptyContent={['暂无数据']}
          showCheckAll
          title={['源数据', '目标数据']}
        />
      </div>
    </>
  )
}
