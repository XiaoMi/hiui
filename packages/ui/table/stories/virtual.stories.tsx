import React from 'react'
import Table from '../src'

/**
 * @title 虚拟列表
 */
export const Virtual = () => {
  const MockData: any = []
  for (let index = 0; index < 10000; index++) {
    MockData.push({
      name: '小米-' + index,
      type: '手机',
      size:
        '6G+64G 幻彩蓝' +
        (index % 10 === 0 ? 'f地方对了时间放的书法大师到了撒娇发了多少解封了的' : ''),
      price: '3299.00',
      operation: '查看',
    })
  }
  const [column] = React.useState([
    {
      title: '商品名',
      dataKey: 'name',
      width: 300,
    },
    {
      title: '品类',
      dataKey: 'type',
      width: 200,
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
      title: '操作',
      dataKey: 'operation',
      width: 150,
    },
  ])
  const [data] = React.useState(MockData)

  return (
    <>
      <h1>Width for Table</h1>
      <div className="table-width__wrap" style={{ width: 800, background: '#fff' }}>
        <Table
          fieldKey="name"
          columns={column}
          data={data}
          virtual={true}
          fixedToColumn={{ right: 'operation' }}
        />
      </div>
    </>
  )
}
