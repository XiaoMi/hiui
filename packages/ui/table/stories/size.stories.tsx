import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
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

  return (
    <>
      <h1>Size for Table</h1>
      <div className="table-size__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table bordered columns={columns} data={data} size="sm" rowSelection={{}} />
        <br />
        <br />
        <Table bordered columns={columns} data={data} size="md" rowSelection={{}} />
        <br />
        <br />
        <Table bordered columns={columns} data={data} size="lg" rowSelection={{}} />
      </div>
    </>
  )
}
