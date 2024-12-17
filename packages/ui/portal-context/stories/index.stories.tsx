import React from 'react'

export * from './basic.stories'

export default {
  title: 'Private（暂不对外）/PortalContext',
  decorators: [(story: Function) => <div>{story()}</div>],
}
