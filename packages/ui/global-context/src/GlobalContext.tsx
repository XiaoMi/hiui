import React, { createContext, useContext } from 'react'

export const GlobalContext = createContext<UseGlobalContext>({})

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)

  return context
}

export interface UseGlobalContext extends ConfigComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  prefix?: string
  customThemeClassName?: string
}

export interface ComponentStyleConfig {
  className?: string
  style?: React.CSSProperties
  classNames?: any
  styles?: any
}

export type AlertComponentConfig = ComponentStyleConfig

export type AnchorComponentConfig = ComponentStyleConfig

export type AnchorItemComponentConfig = ComponentStyleConfig

export type BreadcrumbComponentConfig = ComponentStyleConfig

export type ButtonComponentConfig = ComponentStyleConfig

export type CardComponentConfig = ComponentStyleConfig

export type CheckboxComponentConfig = ComponentStyleConfig

export type CollapsePanelComponentConfig = ComponentStyleConfig

export type CounterComponentConfig = ComponentStyleConfig

export type DescriptionsComponentConfig = ComponentStyleConfig

export type DrawerComponentConfig = ComponentStyleConfig

export type DropdownComponentConfig = ComponentStyleConfig

export type EmptyStateComponentConfig = ComponentStyleConfig

export type InputComponentConfig = ComponentStyleConfig

export type ListComponentConfig = ComponentStyleConfig

export interface ConfigComponentProps {
  alert?: AlertComponentConfig
  anchor?: AnchorComponentConfig
  anchorItem?: AnchorItemComponentConfig
  breadcrumb?: BreadcrumbComponentConfig
  button?: ButtonComponentConfig
  card?: CardComponentConfig
  checkbox?: CheckboxComponentConfig
  collapsePanel?: CollapsePanelComponentConfig
  counter?: CounterComponentConfig
  descriptions?: DescriptionsComponentConfig
  drawer?: DrawerComponentConfig
  dropdown?: DropdownComponentConfig
  emptyState?: EmptyStateComponentConfig
  input?: InputComponentConfig
  list?: ListComponentConfig
}
