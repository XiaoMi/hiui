export interface Props {
  clearable?: boolean
  allowHalf?: boolean
  useEmoji?: boolean
  disabled?: boolean
  count?: number
  readOnly?: boolean
  defaultValue?: number
  value?: number
  tooltips?: string[]
  descRender?: (value: number, index: number) => JSX.Element
  character?: string | JSX.Element
  color?: string
  characterRender?: (value: number, index: number) => JSX.Element
  onChange?: (value: number) => void
  style?: CSSProperties
  className?: string
}
declare const Rate: React.ComponentType<Props>
export default Rate
