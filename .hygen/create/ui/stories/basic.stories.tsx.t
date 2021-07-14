---
to: <%= h.uiDir(`${name}/stories/basic.stories.tsx`) %>
---
import React from 'react'
import <%= h.camelCase(name) %> from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic for <%= h.camelCase(name) %></h1>
      <div className="<%= name %>-basic__wrap">
        <<%= h.camelCase(name) %>></<%= h.camelCase(name) %>>
      </div>
    </>
  )
}
