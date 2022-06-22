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
      <div className="table-empty__wrap" style={{ width: 800, background: '#eee' }}>
        <Table
          columns={[
            {
              title: '商品名',
              dataKey: 'name',
            },
            {
              title: '品类',
              dataKey: 'type',
            },
            {
              title: '规格',
              dataKey: 'size',
            },
            {
              title: '单价',
              dataKey: 'price',
            },
            {
              title: '门店',
              dataKey: 'address',
            },
            {
              title: '库存',
              dataKey: 'stock',
            },
          ]}
          data={[]}
          emptyContent={<EmptyState title={'暂时没有数据，请联系管理员'} />}
        />
      </div>
    </>
  )
}
