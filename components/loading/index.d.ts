import React from 'react'
export interface LoadingProps {
  size?: 'large' | 'default' | 'small'
  content?: string | JSX.Element
  visible?: boolean
  full?: boolean
  style?: React.CSSProperties
  className?: string
}

export type LoadingOptions = {
  content?: string | JSX.Element
  key: string | number
  duration?: number
  size?: 'large' | 'default' | 'small'
}
const OpenFun: (target: HTMLElement, options: LoadingOptions) => void
const CloseFun: (key: string | number) => void

declare class Loading extends React.Component<LoadingProps, any> {
  static open = OpenFun
  static close = CloseFun
}
export default Loading
