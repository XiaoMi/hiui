---
to: <%= h.uiDir(`${name}/stories/index.stories.tsx`) %>
---
import React from 'react'
import <%= h.camelCase(name) %> from '../src'

export * from './basic.stories'

export default {
  title: '<%= h.camelCase(name) %>',
  component: <%= h.camelCase(name) %>,
  decorators: [(story: Function) => <div>{story()}</div>],
}
