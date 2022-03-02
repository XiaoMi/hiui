import React from 'react'
import Card from '../src'

export * from './basic.stories'
export * from './img.stories'
export * from './size.stories'
export * from './loading.stories'
export * from './no-header.stories'
export * from './hoverable.stories'
export * from './subtitle.stories'

export default {
  title: 'Data Display/Card',
  component: Card,
  decorators: [(story: Function) => <div>{story()}</div>],
}
