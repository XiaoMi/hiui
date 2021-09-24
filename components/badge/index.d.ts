import React from 'react'

export interface BadgeProps {
  content?: string | number
  type?:'bubble' | 'dot'
  max?: number
  visible?: boolean
  color?: string
  offset?: [number | string, number | string]
}

declare class Badge extends React.Component<BadgeProps, any> {}

export default Badge
