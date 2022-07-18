import React from 'react'

export * from './basic.stories'
export * from './type.stories'
export * from './complete.stories'
export * from './size.stories'
export * from './custom.stories'

export default {
  title: 'FeedBack/Result (Alpha 暂不推荐业务项目中使用)',
  decorators: [(story: Function) => <div>{story()}</div>],
}
