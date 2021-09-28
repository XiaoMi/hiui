import React from 'react'
export interface TooltipProps {
  title: string | JSX.Element
  placement?: 'top' | 'right' | 'bottom' | 'left'
  visible?: boolean
}
export type TooltipOptions = {
  title: string | JSX.Element
  placement?: 'top' | 'right' | 'bottom' | 'left'
  key: string
}
const OpenFun: (target: HTMLElement, options: TooltipOptions) => void
const CloseFun: (key: string) => void
declare class Tooltip extends React.Component<TooltipProps, any> {
  static open = OpenFun
  static close = CloseFun
}
export default Tooltip

