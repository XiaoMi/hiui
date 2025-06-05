import React from 'react'
import CheckTreeSelect from '../src'

/**
 * @title 选中项展示模式
 * @desc 不同模式下，选中项的内容不一样，默认是 `ALL` 模式，无论父子节点，选中后就会展示。
 */
export const CheckedMode = () => {
  const [data] = React.useState([
    {
      title: '手机类',
      id: '0',
      children: [
        {
          title: 'Redmi系列',
          id: '0-0',
          disabled: true,
          children: [
            {
              id: '0-0-1',
              title: 'Redmi K30',
            },
            {
              id: '0-0-2',
              title: 'Redmi K30 Pro',
            },
            {
              id: '0-0-3',
              title: 'Redmi 10X 5G',
            },
            {
              id: '0-0-4',
              title: 'Redmi Note 8',
            },
            {
              id: '0-0-5',
              title: 'Redmi 9',
            },
            {
              id: '0-0-6',
              title: 'Redmi 9A',
            },
          ],
        },
        {
          title: '小米手机',
          id: '0-1',
          children: [
            {
              id: '0-1-1',
              title: '小米10 Pro',
            },
            {
              id: '0-1-2',
              title: '小米10',
            },
            {
              id: '0-1-3',
              title: '小米10 青春版 5G',
            },
            {
              id: '0-1-4',
              title: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      title: '电视',
      id: '1',
      children: [
        {
          title: '小米电视 大师 65英寸OLED',
          id: '1-0',
        },
        {
          title: 'Redmi 智能电视 MAX 98',
          id: '1-1',
        },
        {
          title: '小米电视4A 60英寸',
          id: '1-2',
        },
      ],
    },
  ])

  return (
    <>
      <h1>Checked Mode</h1>
      <div className="check-tree-select-checked-mode__wrap">
        <h2>ALL（默认）</h2>
        <CheckTreeSelect style={{ width: 240 }} data={data} onChange={console.log} />

        <h2>PARENT</h2>
        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          onChange={console.log}
          checkedMode="PARENT"
        />

        <h2>CHILD</h2>
        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          onChange={console.log}
          checkedMode="CHILD"
        />

        <h2>SEPARATE</h2>
        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          onChange={console.log}
          checkedMode="SEPARATE"
        />
      </div>
    </>
  )
}
