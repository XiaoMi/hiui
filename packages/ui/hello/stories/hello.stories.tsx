import React from 'react'
import Hello from '../src'

export function Basic() {
  return (
    <div className="f-s hello-wrap">
      <Hello
        size={36}
        src="https://placeimg.com/80/80/animals"
        label="Tom"
        shape="none"
        placement="bottom"
      />
    </div>
  )
}
