import React from 'react'
export const useProgress = ({ ...rest }: UseProgressProps) => {
  return { rootProps: rest }
}

export interface UseProgressProps {
  percent?: number
  bufferPercent?: number
  color?: string
  formatText?: (percent: number, bufferPercent: number) => string
  placement?: 'inside' | 'outside'
  mode?: 'indeterminate' | 'determinate'
  type?: 'success' | 'danger' | 'warning' | 'primary'
  radius?: any
  showInfo?: boolean
  content?: React.ReactNode
  size?: 'md' | 'sm' | 'lg'
  strokeWidth?: number
  width?: number
  active?: boolean
}

export type UseProgressReturn = ReturnType<typeof useProgress>
