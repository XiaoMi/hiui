import React from 'react'
import Select from '../src'

export const EmptyContent = () => {
  const [data] = React.useState([])

  return (
    <>
      <h1>EmptyContent</h1>
      <div className="select-empty-content__wrap">
        <Select style={{ width: 200 }} data={data} emptyContent="暂无选项" />
      </div>
    </>
  )
}
