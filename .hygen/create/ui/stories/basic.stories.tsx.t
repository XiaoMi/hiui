---
to: <%= h.uiDir(`${name}/stories/basic.stories.tsx`) %>
---
import React from 'react'
import <%= h.camelCase(name) %> from '../src'

export const Basic = () => {
  return (
    <>
      <h1><%= h.camelCase(name) %></h1>
      <div className="<%= name %>-basic-wrap">
        <<%= h.camelCase(name) %>></<%= h.camelCase(name) %>>
      </div>
    </>
  )
}
