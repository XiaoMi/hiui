import React from 'react'
import CascadeFilter from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="cascade-filter-basic__wrap">
        <CascadeFilter data={[]}></CascadeFilter>
      </div>
    </>
  )
}
