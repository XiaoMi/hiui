import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 异步展开渲染
 */
export const AsyncExpandedRender = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 100,
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
      <h1>AsyncExpandedRender for Table</h1>
      <div className="table-async-expanded-render__wrap">
        <Table
          defaultExpandedEmbedRowKeys={[1]}
          expandedRender={(rowData, index) => {
            console.log('expandedRender', rowData, index)

            return new Promise((resolve) => {
              // 模拟异步
              setTimeout(() => {
                const embedTable = (
                  <Table
                    striped
                    columns={columns}
                    data={[
                      {
                        name: 'Jane Doe',
                        age: 30,
                        address: '32 Park Road, London',
                        email: 'jane.doe@example.com',
                        key: 2,
                      },
                    ]}
                  />
                )

                resolve(embedTable)
              }, 3000)
            })
          }}
          columns={columns}
          data={data}
        />
      </div>
    </>
  )
}
