import React from 'react'

export * from './basic.stories'
export * from './bordered.stories'
export * from './vertical.stories'
export * from './vertical-border.stories'

export default {
  title: 'Descriptions',
  decorators: [(story: Function) => <div style={{ width: '900px' }}>{story()}</div>],
}
