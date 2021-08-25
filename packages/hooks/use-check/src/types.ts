import React from 'react'

export type UseCheckItem = {
  id: React.ReactText
}

export type UseCascadeCheckItem = {
  id: React.ReactText
  parent?: UseCascadeCheckItem
  children?: UseCascadeCheckItem[]
}
