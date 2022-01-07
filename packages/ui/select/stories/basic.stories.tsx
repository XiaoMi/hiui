import React from 'react'
import Select from '../src'

export const Basic = () => {
  const [data] = React.useState([])

  return (
    <>
      <h1>Basic</h1>
      <div className="select-basic__wrap">
        <Select clearable={false} style={{ width: 200 }} data={data} />
      </div>
    </>
  )
}
