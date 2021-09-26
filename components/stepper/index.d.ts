import React from "react"

export type StepperItem = {
  title: string | JSX.Element
  content?: string | JSX.Element
  icon?: string | JSX.Element
}
export interface StepperProps {
  data: StepperItem[]
  current?: number
  placement?: 'vertical' | 'horizontal'
  itemLayout?: 'vertical' | 'horizontal'
}
declare const Stepper: React.ComponentType<StepperProps>
export default Stepper
