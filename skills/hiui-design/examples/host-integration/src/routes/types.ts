import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

export type MenuRouteObject = RouteObject & {
  title?: string
  icon?: ReactNode
  examplePrompt?: string
  showInMenu?: boolean
  children?: MenuRouteObject[]
}
