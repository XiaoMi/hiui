import React from 'react'
import List from '../src'
import EmptyState from '@hi-ui/empty-state'

/**
 * @title 数据为空
 */
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
          emptyContent={() => <EmptyState />}
        />
      </div>
    </>
  )
}
