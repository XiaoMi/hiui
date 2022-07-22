import React from 'react'
import CheckSelect from '../src'

/**
 * @title 全选
 */
export const CheckAll = () => {
  const [value, setValue] = React.useState<React.ReactText[]>(['3'])

  const [data] = React.useState([
    { title: '红米 5A', id: '3' },
    { title: '红米 6A', id: '2' },
    { title: '红米 note8', id: '5' },
    { title: '小米电视E65A', id: '12' },
    { title: '小米电视4S', id: '13' },
    { title: '小米电视4C', id: '14' },
  ])

  return (
    <>
      <h1>CheckAll</h1>
      <div className="select-check-all__wrap">
        <CheckSelect
          style={{ width: 240 }}
          data={data}
          placeholder="请选择"
          showCheckAll
          showOnlyShowChecked
          value={value}
          onChange={(selectedId) => {
            setValue(selectedId)
          }}
        />
      </div>
    </>
  )
}
