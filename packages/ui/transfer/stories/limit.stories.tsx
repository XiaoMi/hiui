import React from 'react'
import Transfer from '../src'

export const Limit = () => {
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
  const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

  return (
    <>
      <h1>Limit</h1>
      <div className="transfer-limit__wrap">
        <Transfer
          data={data}
          targetLimit={6}
          targetIds={targetIds}
          onChange={(ids) => setTargetIds(ids)}
          emptyContent={['暂无数据']}
        />
      </div>
    </>
  )
}
