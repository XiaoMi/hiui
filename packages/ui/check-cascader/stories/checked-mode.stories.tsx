import React from 'react'
import CheckCascader from '../src'

/**
 * @title 回显模式
 * @desc 不同模式下，选中项的内容不一样，默认是 `ALL` 模式，无论父子节点，选中后就会展示。
 */
export const CheckedMode = () => {
  const [data] = React.useState([
    {
      id: 1,
      title: '小米',
      children: [
        {
          id: 2,
          title: '技术',
          children: [
            { id: 3, title: '后端' },
            { id: 4, title: '运维' },
            { id: 5, title: '前端' },
          ],
        },
        { id: 6, title: '产品' },
      ],
    },
    {
      id: 11,
      title: '小米',
      children: [
        { id: 22, title: '技术' },
        { id: 66, title: '产品' },
      ],
    },
  ])

  return (
    <>
      <h1>Checked Mode</h1>
      <div className="cascader-checked-mode__wrap">
        <h2>ALL（默认）</h2>
        <CheckCascader
          style={{ width: 240 }}
          searchable={false}
          placeholder="请选择品类"
          changeOnSelect
          data={data}
          onChange={console.log}
        ></CheckCascader>

        <h2>PARENT</h2>
        <CheckCascader
          style={{ width: 240 }}
          searchable={false}
          placeholder="请选择品类"
          changeOnSelect
          checkedMode="PARENT"
          data={data}
          onChange={console.log}
        ></CheckCascader>

        <h2>CHILD</h2>
        <CheckCascader
          style={{ width: 240 }}
          searchable={false}
          placeholder="请选择品类"
          changeOnSelect
          checkedMode="CHILD"
          data={data}
          onChange={console.log}
        ></CheckCascader>

        <h2>SEPARATE</h2>
        <CheckCascader
          style={{ width: 240 }}
          searchable={false}
          placeholder="请选择品类"
          changeOnSelect
          checkedMode="SEPARATE"
          data={data}
          onChange={console.log}
        ></CheckCascader>
      </div>
    </>
  )
}
