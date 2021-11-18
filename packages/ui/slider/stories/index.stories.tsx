import React from 'react'

export * from './basic.stories'

export default {
  title: 'Slider',
  decorators: [(story: Function) => <div>{story()}</div>],
}
