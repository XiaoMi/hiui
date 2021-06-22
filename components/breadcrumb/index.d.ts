import { CSSProperties } from "react"

type DataItem = {
  content: string | JSX.Element
  path: string
  href?: boolean
  icon?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
}

interface Props {
  data: DataItem[]
  separator: string
  onClick?: (path: string) => void
  
}
declare const Breadcrumb: React.ComponentType<Props>
export default Breadcrumb
