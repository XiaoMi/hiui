import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const ArrowSize = () => {
  return (
    <>
      <h1>arrow size</h1>
      <h2>lg(large)</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel arrowSize={'lg'}>{generateContent()}</Carousel>
      </div>
      <h2>md(middle)</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel arrowSize={'md'}>{generateContent()}</Carousel>
      </div>
      <h2>sm(small)</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel arrowSize={'sm'}>{generateContent()}</Carousel>
      </div>
    </>
  )
}
