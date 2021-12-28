import React from 'react'
import SvgIcon from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="svg-icon-basic__wrap">
        <SvgIcon aria-label="home">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
      </div>
    </>
  )
}
