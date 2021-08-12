import React, { createContext, useContext } from 'react'

interface CascaderContext {}

const cascaderContext = createContext<CascaderContext>({})

export const CascaderProvider = cascaderContext.Provider

export const useCascaderContext = () => {
  const context = useContext(cascaderContext)

  if (!context) {
    throw new Error('The cascaderContext context is not defined.')
  }

  return context
}
