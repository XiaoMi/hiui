import React from 'react'
export interface WatermarkProps {
  density?: 	'low' | 'default' | 'high'
  content?: string | string[]
  logo?: any
  opacity?: number
  style?: React.CSSProperties
  className?: string
  allowCopy?: boolean
}
declare const Watermark: React.ComponentType<WatermarkProps>
export default Watermark
