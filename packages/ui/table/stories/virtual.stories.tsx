import React from 'react'
import Table from '../src'

/**
 * @title 虚拟列表
 */
export const Virtual = () => {
  const MockData: any = []
  for (let index = 0; index < 100; index++) {
    MockData.push({
      name: '小米-' + index,
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '3299.00',
      price1: '3299.00',
    })
  }
  const [column] = React.useState([
    {
      title: '商品名',
      dataKey: 'name',
      width: 120,
    },
    {
      title: '品类',
      dataKey: 'type',
      width: 80,
    },
    {
      title: '规格',
      dataKey: 'size',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price',
      width: 150,
    },
    {
      title: '规格',
      dataKey: 'size',
      width: 150,
    },
  ])
  const [data] = React.useState(MockData)

  return (
    <>
      <h1>Width for Table</h1>
      <div className="table-width__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table columns={column} data={data} />
      </div>
    </>
  )
}
