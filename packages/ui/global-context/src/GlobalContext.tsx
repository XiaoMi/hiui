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

export type CascaderComponentConfig = ComponentStyleConfig

export type CheckboxComponentConfig = ComponentStyleConfig

export type CheckCascaderComponentConfig = ComponentStyleConfig

export type CheckSelectComponentConfig = ComponentStyleConfig

export type CheckTreeSelectComponentConfig = ComponentStyleConfig

export type CollapsePanelComponentConfig = ComponentStyleConfig

export type CounterComponentConfig = ComponentStyleConfig

export type DatePickerComponentConfig = ComponentStyleConfig

export type DescriptionsComponentConfig = ComponentStyleConfig

export type DrawerComponentConfig = ComponentStyleConfig

export type DropdownComponentConfig = ComponentStyleConfig

export type EmptyStateComponentConfig = ComponentStyleConfig

export type FormComponentConfig = ComponentStyleConfig

export type FormItemComponentConfig = ComponentStyleConfig

export type InputComponentConfig = ComponentStyleConfig

export type ListComponentConfig = ComponentStyleConfig

export type LoadingComponentConfig = ComponentStyleConfig

export type MessageComponentConfig = ComponentStyleConfig

export type MenuComponentConfig = ComponentStyleConfig

export type GroupMenuComponentConfig = ComponentStyleConfig

export type SideMenuComponentConfig = ComponentStyleConfig

export type MenuSearchComponentConfig = ComponentStyleConfig

export type ModalComponentConfig = ComponentStyleConfig

export type NotificationComponentConfig = ComponentStyleConfig

export type NumberInputComponentConfig = ComponentStyleConfig

export type PageHeaderComponentConfig = ComponentStyleConfig

export type PaginationComponentConfig = ComponentStyleConfig

export type PickerComponentConfig = ComponentStyleConfig

export type PopperComponentConfig = ComponentStyleConfig

export type PopConfirmComponentConfig = ComponentStyleConfig

export type PopoverComponentConfig = ComponentStyleConfig

export type PreviewComponentConfig = ComponentStyleConfig

export type ProgressComponentConfig = ComponentStyleConfig

export type RadioComponentConfig = ComponentStyleConfig

export type RadioGroupComponentConfig = ComponentStyleConfig

export type RatingComponentConfig = ComponentStyleConfig

export type ResultComponentConfig = ComponentStyleConfig

export type SelectComponentConfig = ComponentStyleConfig

export type SliderComponentConfig = ComponentStyleConfig

export type StepperComponentConfig = ComponentStyleConfig

export type SwitchComponentConfig = ComponentStyleConfig

export type TextareaComponentConfig = ComponentStyleConfig

export type TabsComponentConfig = ComponentStyleConfig

export type TabListComponentConfig = ComponentStyleConfig

export type TimePickerComponentConfig = ComponentStyleConfig

export type TimelineComponentConfig = ComponentStyleConfig

export type TransferComponentConfig = ComponentStyleConfig

export type TableComponentConfig = ComponentStyleConfig

export type TreeComponentConfig = ComponentStyleConfig

export type TreeSelectComponentConfig = ComponentStyleConfig

export type TooltipComponentConfig = ComponentStyleConfig

export type UploadComponentConfig = ComponentStyleConfig

export interface ConfigComponentProps {
  alert?: AlertComponentConfig
  anchor?: AnchorComponentConfig
  anchorItem?: AnchorItemComponentConfig
  breadcrumb?: BreadcrumbComponentConfig
  button?: ButtonComponentConfig
  card?: CardComponentConfig
  cascader?: CascaderComponentConfig
  checkbox?: CheckboxComponentConfig
  checkCascader?: CheckCascaderComponentConfig
  checkSelect?: CheckSelectComponentConfig
  checkTreeSelect?: CheckTreeSelectComponentConfig
  collapsePanel?: CollapsePanelComponentConfig
  counter?: CounterComponentConfig
  datePicker?: DatePickerComponentConfig
  descriptions?: DescriptionsComponentConfig
  drawer?: DrawerComponentConfig
  dropdown?: DropdownComponentConfig
  emptyState?: EmptyStateComponentConfig
  form?: FormComponentConfig
  formItem?: FormItemComponentConfig
  input?: InputComponentConfig
  list?: ListComponentConfig
  loading?: LoadingComponentConfig
  message?: MessageComponentConfig
  menu?: MenuComponentConfig
  groupMenu?: GroupMenuComponentConfig
  sideMenu?: SideMenuComponentConfig
  menuSearch?: MenuSearchComponentConfig
  modal?: ModalComponentConfig
  notification?: NotificationComponentConfig
  numberInput?: NumberInputComponentConfig
  pageHeader?: PageHeaderComponentConfig
  pagination?: PaginationComponentConfig
  picker?: PickerComponentConfig
  popper?: PopperComponentConfig
  popConfirm?: PopConfirmComponentConfig
  popover?: PopoverComponentConfig
  preview?: PreviewComponentConfig
  progress?: ProgressComponentConfig
  radio?: RadioComponentConfig
  radioGroup?: RadioGroupComponentConfig
  rating?: RatingComponentConfig
  result?: ResultComponentConfig
  select?: SelectComponentConfig
  slider?: SliderComponentConfig
  stepper?: StepperComponentConfig
  switch?: SwitchComponentConfig
  textarea?: TextareaComponentConfig
  tabs?: TabsComponentConfig
  tabList?: TabListComponentConfig
  timePicker?: TimePickerComponentConfig
  timeline?: TimelineComponentConfig
  table?: TableComponentConfig
  transfer?: TransferComponentConfig
  tooltip?: TooltipComponentConfig
  tree?: TreeComponentConfig
  treeSelect?: TreeSelectComponentConfig
  upload?: UploadComponentConfig
}
