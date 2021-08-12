import React from 'react'

export type CascaderItem = {
  id: React.ReactText
  title: React.ReactNode
  disabled?: boolean
  children?: CascaderItem[]
  isLeaf?: boolean
}

export type FieldNames = {
  label?: string
  value?: string
  children?: string
}

export type ExpandTrigger = 'click' | 'hover'
