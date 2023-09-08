import React from 'react'
import Alert from '../src'

export * from './basic.stories'
export * from './content.stories'
export * from './closable.stories'
export * from './duration.stories'
export * from './banner.stories'
export * from './close-icon.stories'
export * from './carousel.stories'
export * from './size.stories'

export default {
  title: 'FeedBack/Alert',
  component: Alert,
  decorators: [(story: Function) => <div>{story()}</div>],
}
