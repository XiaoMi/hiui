import React from 'react'
import Filter, { FilterItem } from '../src'

export const Controlled = () => {
  const [value, setValue] = React.useState<React.ReactText>('1')

  const data = [
    {
      id: 1,
      content: '深空',
    },
    {
      id: 2,
      content: '白色',
    },
    {
      id: 3,
      content: '亮黑色',
      disabled: true,
    },
    {
      id: 4,
      content: '金色',
    },
  ]

  return (
    <>
      <h1>Controlled</h1>
      <div className="filter-controlled__wrap">
        <Filter
          label={'颜色'}
          value={value}
          onChange={(v) => {
            console.log('onChange', v)
            setValue(v)
          }}
        >
          {data.map((item) => {
            return (
              <FilterItem key={item.id} value={item.id} disabled={item.disabled}>
                {item.content}
              </FilterItem>
            )
          })}
        </Filter>
      </div>
    </>
  )
}
