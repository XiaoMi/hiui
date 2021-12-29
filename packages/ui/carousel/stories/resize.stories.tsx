import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const Resize = () => {
  return (
    <>
      <h1>Resize</h1>
      <h2>760 X 320</h2>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '320px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>760 X 469</h2>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '469px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>760 X 200</h2>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '200px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
    </>
  )
}
