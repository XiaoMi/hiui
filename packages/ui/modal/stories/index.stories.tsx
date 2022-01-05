import React from 'react'
import Modal from '../src'

export * from './basic.stories'
export * from './closeable.stories'
export * from './nested.stories'
export * from './size.stories'
export * from './scroll.stories'
export * from './lock-scroll.stories'
export * from './container.stories'
export * from './with-api.stories'

export default {
  title: 'FeedBacck/Modal',
  component: Modal,
  decorators: [(story: Function) => <div>{story()}</div>],
}
