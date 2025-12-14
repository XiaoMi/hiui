import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 表头列合并
 * @desc 只支持表头列合并，被合并的表头需要设置 colSpan 为 0，则该表头不显示
 */
export const HeaderColSpan = () => {
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
      title: 'Address + Email',
      dataKey: 'address',
      colSpan: 2,
    },
    {
      title: 'Email',
      dataKey: 'email',
      colSpan: 0,
    },
    {
      title: 'Phone',
      dataKey: 'phone',
    },
    {
      title: 'Phone2',
      dataKey: 'phone2',
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
  ])

  return (
    <>
      <h1>Header ColSpan</h1>
      <div className="table-header-colspan__wrap">
        <Table bordered columns={columns} data={data} />
      </div>
    </>
  )
}
