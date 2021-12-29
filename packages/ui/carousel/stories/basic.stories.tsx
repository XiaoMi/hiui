import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '320px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
    </>
  )
}
