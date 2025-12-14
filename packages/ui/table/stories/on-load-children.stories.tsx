import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 异步加载 children
 */
export const OnLoadChildren = () => {
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
      <h1>OnLoadChildren for Table</h1>
      <div className="table-basic__wrap">
        <Table
          columns={columns}
          data={data}
          onLoadChildren={(item) => {
            const { depth } = item
            console.log('item', item)
            return new Promise((resolve) => {
              setTimeout(() => {
                // 模拟无子节点情况处理
                if (depth > 0) {
                  resolve([])
                } else {
                  const children = [
                    {
                      name: 'Jane Doe',
                      age: 30,
                      address: '32 Park Road, London',
                      email: 'jane.doe@example.com',
                      key: new Date().getTime(),
                    },
                    {
                      name: 'Jim Green',
                      age: 42,
                      address: 'London No. 1 Lake Park',
                      email: 'jim.green@example.com',
                      key: new Date().getTime() + 1,
                    },
                  ]
                  resolve(children)
                }
              }, 1000)
            })
          }}
        />
      </div>
    </>
  )
}
