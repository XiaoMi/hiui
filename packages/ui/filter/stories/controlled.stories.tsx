import React from 'react'
import Filter, { FilterItem } from '../src'

export const Basic = () => {
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
    },
    {
      id: 4,
      content: '金色',
    },
  ]

  return (
    <>
      <h1>Basic</h1>
      <div className="filter-basic__wrap">
        <Filter
          label={'颜色'}
          defaultValue={2}
          onChange={(value) => {
            console.log('value', value)
          }}
        >
          {data.map((item) => {
            return (
              <FilterItem key={item.id} value={item.id}>
                {item.content}
              </FilterItem>
            )
          })}
        </Filter>
      </div>
    </>
  )
}
