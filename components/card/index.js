import React from 'react'
import './style/index'
import SimpleCard from './SimpleCard'
import NormalCard from './NormalCard'
import CoverCard from './CoverCard'

const Card = ({
  style,
  className,
  size,
  hoverable,
  title,
  extra,
  cover,
  coverUrl,
  content,
  children,
  showHeaderDivider,
  type
}) => {
  if (cover || coverUrl) {
    return (
      <CoverCard
        cover={cover}
        coverUrl={coverUrl}
        size={size}
        title={title}
        style={style}
        content={content}
        hoverable={hoverable}
      >
        {children}
      </CoverCard>
    )
  }
  if (type === 'simple') {
    return (
      <SimpleCard size={size} style={style} className={className} hoverable={hoverable}>
        {children}
      </SimpleCard>
    )
  } else {
    return (
      <NormalCard
        size={size}
        title={title}
        extra={extra}
        style={style}
        className={className}
        showHeaderDivider={showHeaderDivider}
        hoverable={hoverable}
      >
        {children}
      </NormalCard>
    )
  }
}

export default Card
export { Card }
