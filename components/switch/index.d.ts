import React from "react"

export interface SwitchProps {
  content?: string[] | JSX.Element[]
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
  onChange?: (checked: boolean) => void
}
declare const Switch: React.ComponentType<SwitchProps>
export default Switch
