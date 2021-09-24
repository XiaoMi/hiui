import React from 'react'
export interface CardProps {
  title?: string | JSX.Element
  bordered?: boolean
  size?: 'small' | 'default' | 'large'
  type?: 'simple' | 'default'
  hoverable?: boolean
  extra?: JSX.Element
  extraType?: 'default' | 'hover'
  coverUrl?: string
  content?: string | JSX.Element
  style?: React.CSSProperties
  className?: string
  showHeaderDivider?: boolean
}
declare class Card extends React.Component<CardProps, any> {
}
export default Card
