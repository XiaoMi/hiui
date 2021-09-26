import React from 'react'

export interface CounterProps {
  value?: number
  defaultValue?: number
  step?: number
  min?: number
  max?: number
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
declare const Counter: React.ComponentType<CounterProps>
export default Counter
