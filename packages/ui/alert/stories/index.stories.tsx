import React from 'react'

export * from './basic.stories'
export * from './content.stories'
export * from './closable.stories'
export * from './duration.stories'
export * from './banner.stories'
export * from './close-icon.stories'

export default {
  title: 'FeedBacck/Alert',
  decorators: [(story: Function) => <div>{story()}</div>],
}
