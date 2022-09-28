import React from 'react'
import Image from '../src'

export * from './basic.stories'
export * from './placeholder.stories'
export * from './fallback.stories'
export * from './preview.stories'

export default {
  title: 'Data Display/Image',
  component: Image,
  decorators: [(story: Function) => <div>{story()}</div>],
}
