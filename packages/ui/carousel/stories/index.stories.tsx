import React from 'react'

export * from './basic.stories'
export * from './resize.stories'
export * from './arrow-size.stories'
export * from './duration.stories'
export * from './dot-type.stories'
export * from './dot-position.stories'
export * from './config.stories'

export default {
  title: 'Data Display/Carousel',
  decorators: [(story: Function) => <div>{story()}</div>],
}
