import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const Duration = () => {
  return (
    <>
      <h1>Duration</h1>
      <h2>0ms(default)(disabled)</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>5000ms</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel duration={5000}>{generateContent()}</Carousel>
      </div>
    </>
  )
}
