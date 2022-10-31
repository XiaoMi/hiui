import React from 'react'
import TreeSelect from '../src'

/**
 * @title 字段别名
 * @desc 数据中的字段名非title，uid或disabled时使用
 */
export const FieldNames = () => {
  const [data] = React.useState([
    {
      content: '手机类',
      uid: '0',
      disabled: true,
      children: [
        {
          content: 'Redmi系列',
          uid: '0-0',
          children: [
            {
              uid: '0-0-1',
              content: 'Redmi K30',
            },
            {
              uid: '0-0-2',
              content: 'Redmi K30 Pro',
            },
            {
              uid: '0-0-3',
              content: 'Redmi 10X 5G',
            },
            {
              uid: '0-0-4',
              content: 'Redmi Note 8',
            },
            {
              uid: '0-0-5',
              content: 'Redmi 9',
            },
            {
              uid: '0-0-6',
              content: 'Redmi 9A',
            },
          ],
        },
        {
          content: '小米手机',
          uid: '0-1',
          children: [
            {
              uid: '0-1-1',
              content: '小米10 Pro',
            },
            {
              uid: '0-1-2',
              content: '小米10',
            },
            {
              uid: '0-1-3',
              content: '小米10 青春版 5G',
            },
            {
              uid: '0-1-4',
              content: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      content: '电视',
      uid: '1',
      children: [
        {
          content: '小米电视 大师 65英寸OLED',
          uid: '1-0',
        },
        {
          content: 'Redmi 智能电视 MAX 98',
          uid: '1-1',
        },
        {
          content: '小米电视4A 60英寸',
          uid: '1-2',
        },
      ],
    },
  ])

  return (
    <>
      <h1>FieldNames</h1>
      <div className="tree-select-field-names__wrap">
        <TreeSelect
          data={data}
          searchable
          searchMode="highlight"
          fieldNames={{ id: 'uid', title: 'content' }}
          onChange={(checkedIds, checkedNode) => {
            console.log('TreeSelect onChange: ', checkedIds, checkedNode)
          }}
        />
      </div>
    </>
  )
}
