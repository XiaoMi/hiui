import React from 'react'

export * from './basic.stories'
export * from './viewbox.stories'

export default {
  title: 'Basic/SvgIcon',
  decorators: [(story: Function) => <div>{story()}</div>],
}
