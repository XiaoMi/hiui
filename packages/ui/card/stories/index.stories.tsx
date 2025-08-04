import React from 'react'
import Card from '../src'

export * from './basic.stories'
export * from './size.stories'
export * from './extra.stories'
export * from './subtitle.stories'
export * from './no-header.stories'
export * from './text-card.stories'
export * from './img.stories'
export * from './no-border.stories'
export * from './hoverable.stories'
export * from './loading.stories'

export default {
  title: 'Data Display/Card',
  component: Card,
  decorators: [(story: Function) => <div>{story()}</div>],
}
