import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 统计行
 */
export const Calc = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
    },
    {
      title: 'Age',
      dataKey: 'age',
      total: true,
      avg: true,
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
      age: 30,
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      key: 1,
    },
    {
      name: 'Elina Voss',
      age: 27,
      address: '83 Dewdrop Road, Rivertown',
      email: 'elina.voss@sampleinbox.cc',
      key: 2,
    },
    {
      name: 'Darin Poe',
      age: 42,
      address: '12 Blossom Close, Newcrest',
      email: 'darin.poe@mockpost.io',
      key: 3,
    },
  ])

  return (
    <>
      <h1>Calc for Table</h1>
      <div className="table-calc__wrap">
        <Table columns={columns} data={data} />
      </div>
    </>
  )
}
