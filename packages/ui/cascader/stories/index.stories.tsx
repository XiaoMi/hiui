import React from 'react'

export * from './basic.stories'
export * from './disabled.stories'
export * from './search.stories'
export * from './select-change.stories'
export * from './nowrap.stories'
export * from './dynamic.stories'
export * from './display-render.stories'
export * from './flatted.stories'
// export * from './embed.stories'

export default {
  title: 'Cascader',
  decorators: [(story: Function) => <div>{story()}</div>],
}
