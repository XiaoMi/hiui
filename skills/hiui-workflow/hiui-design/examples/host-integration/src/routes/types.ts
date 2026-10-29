import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

export type MenuRouteObject = RouteObject & {
  title?: string
  examplePrompt?: string
  icon?: ReactNode
  showInMenu?: boolean
  children?: MenuRouteObject[]
}
