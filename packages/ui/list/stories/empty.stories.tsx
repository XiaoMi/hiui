import React from 'react'
import List from '../src'

export const Empty = () => {
  return (
    <>
      <h1>数据为空</h1>
      <div className="list-basic__wrap">
        <List
          data={[]}
          render={(dataItem) => {
            return <List.Item {...dataItem} />
          }}
        />
      </div>
    </>
  )
}
