import React, { CSSProperties } from 'react'

interface ChartsProps {
  option: object
  style?: CSSProperties
  className?: string
  showLoading?: boolean
}

declare class Charts extends React.Component<ChartsProps, any> {}

export default Charts
