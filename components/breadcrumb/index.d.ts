import React from 'react'

export type BreadcrumbItem = {
  content: string | JSX.Element
  path?: string
  href?: boolean
  icon?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
}

export interface BreadcrumbProps {
  data: BreadcrumbItem[]
  separator?: string
  onClick?: (path: string) => void
}

declare const Breadcrumb: React.ComponentType<BreadcrumbProps>

export default Breadcrumb
