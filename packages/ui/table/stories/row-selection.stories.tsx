import React, { useState } from 'react'
import { RadioGroup } from '@hi-ui/radio'
import Table from '../src'

/**
 * @title 行选中
 * @desc 通过 rowSelection.type 属性来设置单选或多选，默认为 <code>checkbox</code>
 */
export const RowSelection = () => {
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
  const [type, setType] = React.useState<'checkbox' | 'radio'>('checkbox')

  React.useEffect(() => {
    if (type === 'radio' && selectedRowKeys.length > 1) {
      setSelectedRowKeys([selectedRowKeys[0]])
    }
  }, [selectedRowKeys, type])

  return (
    <>
      <h1>RowSelection for Table</h1>
      <div className="table-row-selection__wrap">
        <RadioGroup
          defaultValue={'checkbox'}
          type={'button'}
          data={[
            { title: '多选', id: 'checkbox' },
            { title: '单选', id: 'radio' },
          ]}
          onChange={(value) => {
            console.log('onChange', value)
            setType(value as 'checkbox' | 'radio')
          }}
          style={{ marginBottom: 16 }}
        />
        <Table
          rowSelection={{
            type,
            selectedRowKeys,
            onChange: (keys, target, shouldChecked, rows) => {
              console.log(keys, target, shouldChecked, rows)

              setSelectedRowKeys(keys)
            },
          }}
          columns={columns}
          data={data}
        />
      </div>
    </>
  )
}
