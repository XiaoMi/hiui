import React from 'react'
import Carousel from '../src'

export * from './basic.stories'
export * from './resize.stories'
export * from './arrow-size.stories'
export * from './duration.stories'
export * from './dot-type.stories'
export * from './dot-position.stories'
export * from './config.stories'
export * from './responsive.stories'

export default {
  title: 'Data Display/Carousel',
  component: Carousel,
  decorators: [(story: Function) => <div>{story()}</div>],
}
