export interface Props {
  density?: 	'low' | 'default' | 'high'
  content?: strgin | string[]
  logo?: any
  opacity?: number
  style?: CSSProperties
  className?: string
  allowCopy?: boolean
}
declare const Watermark: React.ComponentType<Props>
export default Watermark
