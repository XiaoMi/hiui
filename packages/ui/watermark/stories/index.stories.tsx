import React from 'react'
import Watermark from '../src'

export * from './basic.stories'
export * from './density.stories'
export * from './container.stories'

export default {
  title: 'Others/Watermark',
  component: Watermark,
  decorators: [(story: Function) => <div>{story()}</div>],
}
