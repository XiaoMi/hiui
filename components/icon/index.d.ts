import React from 'react'

interface IconProps {
  style?: React.CSSProperties
  className?: string
  filled?: boolean
  name?: string
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

declare class Icon extends React.Component<IconProps, any> {}

export default Icon
