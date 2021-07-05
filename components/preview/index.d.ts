import { CSSProperties } from "react"
interface Props {
  visible?: boolean
  showBar?: boolean
  showArrow?: boolean
  showCount?: boolean
  images?: string[] | object[]
  simpleData?: boolean
  activeIndex?: number
  onError?: (index: number) => void
  style?: CSSProperties
  className?: string
}
declare const Preview: React.ComponentType<Props>
export default Preview
