import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const DotPosition = () => {
  return (
    <>
      <h1>dot position</h1>
      <h2>bottom(default)</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>left</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel dotPosition={'left'}>{generateContent()}</Carousel>
      </div>
      <h2>top</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel dotPosition={'top'}>{generateContent()}</Carousel>
      </div>
      <h2>right</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel dotPosition={'right'}>{generateContent()}</Carousel>
      </div>
      <h2>outer</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel dotPosition={'outer'}>{generateContent()}</Carousel>
      </div>
    </>
  )
}
