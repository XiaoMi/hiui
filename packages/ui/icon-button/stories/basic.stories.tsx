import React from 'react'
import IconButton from '../src'
import { CloseOutlined } from '@hi-ui/icons'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="icon-button-basic__wrap">
        <IconButton icon={<CloseOutlined />} />
      </div>
    </>
  )
}
