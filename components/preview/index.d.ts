import React from "react"

export interface PreviewProps {
  visible?: boolean
  showBar?: boolean
  showArrow?: boolean
  showCount?: boolean
  images?: string[] | object[]
  simpleData?: boolean
  activeIndex?: number
  style?: React.CSSProperties
  onError?: (index: number) => void
  className?: string
}
declare const Preview: React.ComponentType<PreviewProps>
export default Preview
