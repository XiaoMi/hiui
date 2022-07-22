import React from 'react'
import TreeSelect from '../src'

/**
 * @title 字段别名
 * @desc 数据中的字段名非title，id或disabled时使用
 */
export const FieldNames = () => {
  const [data] = React.useState([
    {
      content: '手机类',
      id: '0',
      disabled: true,
      children: [
        {
          content: 'Redmi系列',
          id: '0-0',
          children: [
            {
              id: '0-0-1',
              content: 'Redmi K30',
            },
            {
              id: '0-0-2',
              content: 'Redmi K30 Pro',
            },
            {
              id: '0-0-3',
              content: 'Redmi 10X 5G',
            },
            {
              id: '0-0-4',
              content: 'Redmi Note 8',
            },
            {
              id: '0-0-5',
              content: 'Redmi 9',
            },
            {
              id: '0-0-6',
              content: 'Redmi 9A',
            },
          ],
        },
        {
          content: '小米手机',
          id: '0-1',
          children: [
            {
              id: '0-1-1',
              content: '小米10 Pro',
            },
            {
              id: '0-1-2',
              content: '小米10',
            },
            {
              id: '0-1-3',
              content: '小米10 青春版 5G',
            },
            {
              id: '0-1-4',
              content: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      content: '电视',
      id: '1',
      children: [
        {
          content: '小米电视 大师 65英寸OLED',
          id: '1-0',
        },
        {
          content: 'Redmi 智能电视 MAX 98',
          id: '1-1',
        },
        {
          content: '小米电视4A 60英寸',
          id: '1-2',
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
          fieldNames={{ title: 'content' }}
          onChange={(checkedIds, checkedNode) => {
            console.log('TreeSelect onChange: ', checkedIds, checkedNode)
          }}
        />
      </div>
    </>
  )
}
