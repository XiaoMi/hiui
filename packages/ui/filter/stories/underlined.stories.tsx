import React from 'react'
import Filter, { FilterItem } from '../src'

export const Underlined = () => {
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
      <h1>Underlined</h1>
      <div className="filter-underlined__wrap">
        <Filter showUnderline label={'颜色'}>
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
