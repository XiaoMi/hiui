import React from 'react'
import Picker from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="picker-basic__wrap">
        <Picker searchable trigger={<Button>Trigger</Button>}>
          content
        </Picker>
      </div>
    </>
  )
}
