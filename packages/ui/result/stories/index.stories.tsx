import React from 'react'

export * from './basic.stories'
export * from './type.stories'
export * from './complete.stories'
// export * from './size.stories'
export * from './custom.stories'

export default {
  title: 'FeedBack/Result',
  decorators: [(story: Function) => <div>{story()}</div>],
}
