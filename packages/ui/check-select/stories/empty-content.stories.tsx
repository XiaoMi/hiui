import React from 'react'
import CheckSelect from '../src'

/**
 * @title 自定义空内容
 */
export const EmptyContent = () => {
  const [data] = React.useState([])

  return (
    <>
      <h1>EmptyContent</h1>
      <div className="check-select-empty-content__wrap">
        <CheckSelect style={{ width: 240 }} data={data} emptyContent="暂无选项" />
      </div>
    </>
  )
}
