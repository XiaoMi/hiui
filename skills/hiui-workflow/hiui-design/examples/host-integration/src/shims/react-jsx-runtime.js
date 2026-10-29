import React from 'react'

export const Fragment = React.Fragment

function normalizeProps(props, key) {
  if (key === undefined) return props || {}
  return {
    ...(props || {}),
    key,
  }
}

export function jsx(type, props, key) {
  return React.createElement(type, normalizeProps(props, key))
}

export const jsxs = jsx
export const jsxDEV = jsx
