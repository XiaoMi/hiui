import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const DotType = () => {
  return (
    <>
      <h1>dot type</h1>
      <h2>slider(default)</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>line</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel dotType={'line'}>{generateContent()}</Carousel>
      </div>
      <h2>dot</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel dotType={'dot'}>{generateContent()}</Carousel>
      </div>
    </>
  )
}
