import React from 'react'
import { Cascader } from '../src'

export const FieldNames = () => {
  const [data] = React.useState([
    {
      value: '0',
      label: '0',
      children: [
        {
          value: '0-0',
          label: '0-0',
          children: [
            {
              value: '0-0-0',
              label: '0-0-0',
            },
            {
              value: '0-0-1',
              label: '0-0-1',
            },
            {
              value: '0-0-2',
              label: '0-0-2',
            },
          ],
        },
        {
          value: '0-1',
          label: '0-1',
          checkable: true,
          children: [
            {
              value: '0-1-0',
              label: '0-1-0',
            },
            {
              value: '0-1-1',
              label: '0-1-1',
            },
          ],
        },
        {
          value: '0-2',
          label: '0-2',
          checkable: true,
          children: [
            {
              value: '0-2-0',
              label: '0-2-0',
            },
            {
              value: '0-2-1',
              label: '0-2-1',
            },
          ],
        },
      ],
    },
    {
      value: '1',
      label: '1',
      children: [
        {
          value: '1-0',
          label: '1-0',
        },
        {
          value: '1-1',
          label: '1-1',
        },
      ],
    },
    {
      value: '2',
      label: '2',
      children: [
        {
          value: '2-0',
          label: '2-0',
        },
        {
          value: '2-1',
          label: '2-1',
        },
      ],
    },
  ])

  const getDataOnlyLeafCheckable = (data: any) => {
    return data.map((item) => {
      if (item.children) {
        item.checkable = item.checkable ?? false
        item.children = getDataOnlyLeafCheckable(item.children)
      } else {
        item.checkable = true
      }

      return item
    })
  }

  const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

  console.log(dataOnlyLeafCheckable)

  return (
    <>
      <h1>FieldNames</h1>
      <div className="cascader-field-names__wrap">
        <Cascader
          fieldNames={{
            id: 'value',
            title: 'label',
          }}
          defaultValue={['0', '0-0', '0-0-1']}
          data={dataOnlyLeafCheckable}
        />
      </div>
    </>
  )
}
