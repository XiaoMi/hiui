import React, { React.CSSProperties } from 'react'

export interface ChartsProps {
  option: object
  style?: React.CSSProperties
  className?: string
  showLoading?: boolean
}

declare class Charts extends React.Component<ChartsProps, any> {}

export default Charts
