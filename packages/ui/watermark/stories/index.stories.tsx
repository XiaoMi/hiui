import React from 'react'

export * from './basic.stories'

export default {
  title: 'Watermark',
  decorators: [(story: Function) => <div>{story()}</div>],
}
