import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 自定义页脚
 */
export const FooterRender = () => {
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
      title: 'Email',
      dataKey: 'email',
    },
  ])

  const [data] = useState([
    {
      name: 'Raynor Maverick',
      age: 31,
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      key: 1,
    },
    {
      name: 'Elina Voss',
      age: 26,
      address: '83 Dewdrop Road, Rivertown',
      email: 'elina.voss@sampleinbox.cc',
      key: 2,
    },
    {
      name: 'Darin Poe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'darin.poe@mockpost.io',
      key: 3,
    },
  ])

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<any>([])

  return (
    <>
      <h1>FooterRender for Table</h1>
      <div className="table-footer-render__wrap">
        <Table
          pagination={{
            pageSize: 5,
            total: data.length,
          }}
          columns={columns}
          data={data}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, target, shouldChecked, rows) => {
              console.log(keys, target, shouldChecked, rows)

              setSelectedRowKeys(keys)
            },
          }}
          footerRender={(pagination) => {
            return (
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  已选 <span style={{ color: '#237ffa' }}>{selectedRowKeys.length}</span> 项
                </div>
                {pagination}
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
