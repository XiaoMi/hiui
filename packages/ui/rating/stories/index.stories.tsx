import React from 'react'
import Rating from '../src'

export * from './basic.stories'

export default {
  title: 'Data Input/Rating',
  component: Rating,
  decorators: [(story: Function) => <div>{story()}</div>],
}
