import React from 'react'
import Table from '../src'

export const Empty = () => {
  return (
    <>
      <h1>Empty for Table</h1>
      <div className="table-empty__wrap" style={{ width: 800, background: '#eee' }}>
        <Table
          fixedToColumn={'type'}
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
        />
      </div>
    </>
  )
}
