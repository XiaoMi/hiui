import { ProgressDataItem } from './types'

export const useProgress = ({ ...rest }: UseProgressProps) => {
  return { rootProps: rest }
}

export interface UseProgressProps {
  value?: number
  bufferValue?: number
  color?: string
  formatText?: (value: number, bufferValue: number) => string
  textPlacement?: 'inside-left' | 'inside-right' | 'outline'
  mode?: 'indeterminate' | 'determinate'
}

export type UseProgressReturn = ReturnType<typeof useProgress>
