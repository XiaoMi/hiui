import React from 'react'
import Transfer from '../src'

export const Basic = () => {
  const generateData = () => {
    const arr = []
    for (let i = 1; i < 16; i++) {
      arr.push({
        id: i,
        title: '选项' + i,
        disabled: i % 3 === 0,
      })
    }
    return arr
  }

  const data = generateData()
  const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

  return (
    <>
      <h1>Basic</h1>
      <div className="transfer-basic__wrap">
        <Transfer
          type="multiple"
          data={data}
          targetIds={targetIds}
          onChange={(ids) => setTargetIds(ids)}
        />
      </div>
    </>
  )
}
