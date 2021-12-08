import React from 'react'

export type UseCheckItem = Record<string, any>

export type UseCascadeCheckItem = {
  id: React.ReactText
  parent?: UseCascadeCheckItem
  children?: UseCascadeCheckItem[]
}
