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

export type LoadingComponentConfig = ComponentStyleConfig

export type MessageComponentConfig = ComponentStyleConfig

export type ModalComponentConfig = ComponentStyleConfig

export type NotificationComponentConfig = ComponentStyleConfig

export type NumberInputComponentConfig = ComponentStyleConfig

export type PageHeaderComponentConfig = ComponentStyleConfig

export type PaginationComponentConfig = ComponentStyleConfig

export type PreviewComponentConfig = ComponentStyleConfig

export type ProgressComponentConfig = ComponentStyleConfig

export type RadioComponentConfig = ComponentStyleConfig

export type RadioGroupComponentConfig = ComponentStyleConfig

export type RatingComponentConfig = ComponentStyleConfig

export type ResultComponentConfig = ComponentStyleConfig

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
  loading?: LoadingComponentConfig
  message?: MessageComponentConfig
  modal?: ModalComponentConfig
  notification?: NotificationComponentConfig
  numberInput?: NumberInputComponentConfig
  pageHeader?: PageHeaderComponentConfig
  pagination?: PaginationComponentConfig
  preview?: PreviewComponentConfig
  progress?: ProgressComponentConfig
  radio?: RadioComponentConfig
  radioGroup?: RadioGroupComponentConfig
  rating?: RatingComponentConfig
  result?: ResultComponentConfig
}
