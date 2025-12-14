import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 固定表头
 * @desc 设置 maxHeight 来控制表格的高度
 */
export const FixedHeader = () => {
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
    {
      name: 'John Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'john.doe@example.com',
      key: 4,
    },
    {
      name: 'Jane Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jane.doe@example.com',
      key: 5,
    },
    {
      name: 'Jim Beam',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jim.beam@example.com',
      key: 6,
    },
    {
      name: 'Jill Bean',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jill.bean@example.com',
      key: 7,
    },
  ])

  return (
    <>
      <h1>FixedHeader for Table</h1>
      <div className="table-fixed-header__wrap">
        <Table maxHeight={200} columns={columns} data={data} />
      </div>
    </>
  )
}
