import React from 'react'

export * from './basic.stories'
export * from './bordered.stories'
export * from './label-placement.stories'
export * from './col.stories'
export * from './vertical.stories'
export * from './vertical-border.stories'
export * from './label-width.stories'

export default {
  title: 'Data Display/Descriptions (Alpha 暂不推荐业务项目中使用)',
  decorators: [(story: Function) => <div style={{ width: '900px' }}>{story()}</div>],
}
