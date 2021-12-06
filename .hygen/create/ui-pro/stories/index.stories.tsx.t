---
to: <%= h.uiDir(`${name}/stories/index.stories.tsx`) %>
---
import React from 'react'

export * from './basic.stories'

export default {
  title: '<%= h.camelCase(name) %>',
  decorators: [(story: Function) => <div>{story()}</div>],
}
