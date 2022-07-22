import React from 'react'
import Transfer from '../src'

/**
 * @title 带标题
 */
export const Title = () => {
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
      <h1>Title</h1>
      <div className="transfer-title__wrap">
        <Transfer
          data={data}
          targetLimit={6}
          targetIds={targetIds}
          onChange={(ids) => setTargetIds(ids)}
          emptyContent={['暂无数据']}
          title={['源数据', '目标数据']}
        />
      </div>
    </>
  )
}
