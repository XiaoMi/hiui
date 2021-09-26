import React from "react"

export type RadioItem = {
  content: string
  id: string | number
  disabled?: boolean
}
export interface RadioProps {
  value?: string | number
  autoFocus?: boolean
  checked?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export interface RadioGroupProps {
  placement?: 'vertical' | 'horizontal'
  data: RadioItem[]
  value?: string | number
  defaultValue?: string | number
  disabled?: boolean
  type?: 'default' | 'button'
  onChange?: (value: string) => void
}
declare class Group extends React.Component<RadioGroupProps, any> {
}
declare class Radio extends React.Component<RadioProps, any> {
  static Group = Group
}
export default Radio

