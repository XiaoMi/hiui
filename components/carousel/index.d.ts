import React from 'react'
export interface CarouselProps {
  duration?: number
  showDots?: boolean
  showArrows?: boolean
  defaultActive?: number
  showPages?: boolean
  children: JSX.Element[]
  style?: React.CSSProperties
  className?: string
}
declare const Carousel: React.ComponentType<CarouselProps>
export default Carousel
