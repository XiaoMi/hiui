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
  percent?: number
  content?: any
  type?: any
  radius?: any
  showInfo?: any
}

export type UseProgressReturn = ReturnType<typeof useProgress>
