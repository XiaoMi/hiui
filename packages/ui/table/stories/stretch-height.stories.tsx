import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 表格高度自动拉伸
 * @desc 使用该功能需要保证 Table 的父级元素有设置高度，具体请看示例中的用法
 */
export const StretchHeight = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
    },
    {
      title: 'Age',
      dataKey: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataKey: 'address',
      width: 200,
    },
    {
      title: 'Email',
      dataKey: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataKey: 'phone',
      width: 200,
    },
    {
      title: 'Phone2',
      dataKey: 'phone2',
      width: 200,
    },
  ])

  const [data] = useState([
    {
      name: 'Raynor Maverick',
      age: 31,
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      phone: '1234567890',
      phone2: '1234567890',
      key: 1,
    },
    {
      name: 'Elina Voss',
      age: 26,
      address: '83 Dewdrop Road, Rivertown',
      email: 'elina.voss@sampleinbox.cc',
      phone: '1234567890',
      phone2: '1234567890',
      key: 2,
    },
    {
      name: 'Darin Poe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'darin.poe@mockpost.io',
      phone: '1234567890',
      phone2: '1234567890',
      key: 3,
    },
    {
      name: 'John Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'john.doe@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 4,
    },
    {
      name: 'Jane Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 5,
    },
    {
      name: 'Jim Beam',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jim.beam@example.com',
      phone: '1234567890',
      phone2: '1234567890',
      key: 6,
    },
  ])

  return (
    <>
      <h1>StretchHeight for Table</h1>
      <div className="table-width__wrap">
        <div
          className="table-width__container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 300,
          }}
        >
          <div
            className="table-width__header"
            style={{ padding: 12, marginBottom: 12, background: '#f5f7f6' }}
          >
            头部内容
          </div>
          {/* 必须加上以下样式 */}
          <div className="table-width__body" style={{ flexGrow: 1, overflow: 'hidden' }}>
            <Table columns={columns} data={data} stretchHeight />
          </div>
        </div>
      </div>
    </>
  )
}
