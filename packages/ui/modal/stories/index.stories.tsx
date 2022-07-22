import React from 'react'
import Modal from '../src'

export * from './basic.stories'
export * from './closeable.stories'
export * from './async-confirm.stories'
export * from './size.stories'
export * from './footer.stories'
export * from './popup.stories'
export * from './scroll.stories'
export * from './nested.stories'
// export * from './lock-scroll.stories'
export * from './container.stories'
export * from './with-api.stories'

export default {
  title: 'FeedBack/Modal',
  component: Modal,
  decorators: [(story: Function) => <div>{story()}</div>],
}
