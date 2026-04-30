import React, { useState } from 'react'
import Table, { TableHelper } from '../src'
import Button from '@hi-ui/button'
/**
 * @title 虚拟列表
 * @desc 内嵌面板、表头分组等复杂场景暂不支持
 */
export const Virtual = () => {
  const MockData: any = []
  for (let index = 0; index < 10000; index++) {
    MockData.push({
      name: 'yun-' + index,
      age: Math.floor(Math.random() * 100),
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      phone: '1234567890',
      phone2: '1234567890',
    })
  }
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
    },
    {
      title: 'Age',
      dataKey: 'age',
    },
    {
      title: 'Address',
      dataKey: 'address',
    },
    {
      title: 'Phone',
      dataKey: 'phone',
    },
    {
      title: 'Phone2',
      dataKey: 'phone2',
    },
    {
      title: 'Email',
      dataKey: 'email',
    },
  ])
  const [data] = React.useState(MockData)
  const tableRef = React.useRef<TableHelper>(null)

  return (
    <>
      <h1>Virtual for Table</h1>
      <div className="table-virtual__wrap">
        <div style={{ marginBottom: '1em' }}>
          <Button
            onClick={() => {
              // key 为节点 id
              tableRef.current?.scrollTo?.({ key: 'yun-100', align: 'top' })
            }}
          >
            scroll to key: yun-100
          </Button>
        </div>
        <Table
          fieldKey="name"
          columns={columns}
          data={data}
          virtual
          innerRef={tableRef}
          // virtual={{
          //   onVisibleChange(...args) {
          //     console.log('onVisibleChange', ...args)
          //   },
          // }}
          rowSelection={{}}
          fixedToColumn={{ right: 'email' }}
        />
      </div>
    </>
  )
}
