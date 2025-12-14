import React from 'react'
import Table from '../src'
import EmptyState from '@hi-ui/empty-state'

/**
 * @title 空状态
 */
export const Empty = () => {
  return (
    <>
      <h1>Empty for Table</h1>
      <div className="table-empty__wrap">
        <Table
          columns={[
            { title: 'Name', dataKey: 'name' },
            { title: 'Age', dataKey: 'age' },
            { title: 'Address', dataKey: 'address' },
            { title: 'Email', dataKey: 'email' },
          ]}
          data={[]}
          emptyContent={<EmptyState title={'暂时没有数据，请联系管理员'} />}
        />
      </div>
    </>
  )
}
