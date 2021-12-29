import React from 'react'
import Carousel from '../src'
import { generateContent } from './content'

export const Config = () => {
  return (
    <>
      <h1>config</h1>
      <h2>showPages = true</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel showPages>{generateContent()}</Carousel>
      </div>
      <h2>showDot = false</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel showDots={false}>{generateContent()}</Carousel>
      </div>
      <h2>showArrows = false</h2>
      <div style={{ width: '760px', height: '320px' }}>
        <Carousel showArrows={false}>{generateContent()}</Carousel>
      </div>
    </>
  )
}
