interface Props {
  type?: 'primary' | 'danger' | 'success' | 'warning'
  defaultValue?: number
  value?: number
  min?: number
  max?: number
  style?: CSSProperties
  className?: string
  disabled?: boolean
  ifShowRangeLabel?:boolean
  tipFormatter?: (value: number) => JSX.Element
  marks?: {
    [prop: number]: any
  }
  step?: number
  vertical?: boolean
  onChange?: (value: number) => void
}
declare const Slider: React.ComponentType<Props>
export default Slider
