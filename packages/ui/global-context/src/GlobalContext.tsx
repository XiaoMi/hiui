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

// AIGC START
export type DrawerComponentConfig = ComponentStyleConfig
// AIGC END

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
  // AIGC START
  drawer?: DrawerComponentConfig
  // AIGC END
}
