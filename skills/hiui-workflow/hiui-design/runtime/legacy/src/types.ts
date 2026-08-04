export type LegacyPageType =
  | 'table-stat'
  | 'table-basic'
  | 'tree-table'
  | 'tree-split'
  | 'drawer-form'
  | 'drawer-detail'
  | 'full-page-edit'
  | 'full-page-detail'
  | 'feedback-status'

export type LegacyActionSlot = {
  id: string
  text: string
  kind?: 'primary' | 'default' | 'danger' | 'link'
  visible?: boolean
  disabled?: boolean
  handler?: string
}

export type LegacyActionHandlerContext = {
  action: LegacyActionSlot
  record?: Record<string, unknown>
}

export type LegacyActionHandlers = Record<string, (context: LegacyActionHandlerContext) => void>

export type LegacyQueryFieldSlot = {
  name: string
  label: string
  type: 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'treeSelect'
  placeholder?: string
  options?: Array<{ label: string; value: string | number | boolean }>
  defaultValue?: unknown
}

export type LegacyTableColumnSlot = {
  title: string
  dataIndex: string
  width?: number
  sorter?: boolean
  fixed?: boolean | 'left' | 'right'
  renderType?: 'text' | 'status' | 'amount' | 'date' | 'datetime' | 'actions'
}

export type LegacyMetricSlot = {
  name: string
  valueKey: string
  formatter?: 'number' | 'percent' | 'amount' | 'text'
  trendKey?: string
}

export type LegacyFieldSlot = {
  name: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'date' | 'dateRange' | 'number' | 'switch' | 'radio' | 'checkbox'
  required?: boolean
  options?: Array<{ label: string; value: string | number | boolean }>
}

export type LegacyDetailFieldSlot = {
  label: string
  dataIndex: string
  valueType?: 'text' | 'status' | 'amount' | 'date' | 'datetime'
}

export type LegacyTreeFieldSlot = {
  title: string
  key: string
  items?: LegacyTreeFieldSlot[]
}

export type LegacyApiBindingSlot = {
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  queryParams?: Record<string, string>
  responseMapping?: Record<string, string>
}

export type LegacyPageSlotsByType = {
  'table-stat': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    queryFields: LegacyQueryFieldSlot[]
    statItems: LegacyMetricSlot[]
    tableColumns: LegacyTableColumnSlot[]
    rowActions: LegacyActionSlot[]
    cellEditRules: Record<string, unknown>
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'table-basic': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    queryFields: LegacyQueryFieldSlot[]
    tableColumns: LegacyTableColumnSlot[]
    rowActions: LegacyActionSlot[]
    cellEditRules: Record<string, unknown>
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'tree-table': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    queryFields: LegacyQueryFieldSlot[]
    tableColumns: LegacyTableColumnSlot[]
    rowActions: LegacyActionSlot[]
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'tree-split': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    treeFields: LegacyTreeFieldSlot[]
    queryFields: LegacyQueryFieldSlot[]
    tableColumns: LegacyTableColumnSlot[]
    rowActions: LegacyActionSlot[]
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'drawer-form': {
    pageTitle: string
    formFields: LegacyFieldSlot[]
    validationRules: Record<string, unknown>
    footerActions: LegacyActionSlot[]
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'drawer-detail': {
    pageTitle: string
    detailFields: LegacyDetailFieldSlot[]
    footerActions: LegacyActionSlot[]
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'full-page-edit': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    formFields: LegacyFieldSlot[]
    validationRules: Record<string, unknown>
    footerActions: LegacyActionSlot[]
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'full-page-detail': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    detailFields: LegacyDetailFieldSlot[]
    supportingSections: Array<{ title: string; fields: LegacyDetailFieldSlot[] }>
    mockData: Record<string, unknown>[]
    apiBinding: LegacyApiBindingSlot
  }
  'feedback-status': {
    pageTitle: string
    headerExtra: LegacyActionSlot[]
    statusTitle: string
    statusDescription: string
    primaryAction: LegacyActionSlot | null
    secondaryAction: LegacyActionSlot | null
  }
}

export type LegacyPageSlots<TPageType extends LegacyPageType> = LegacyPageSlotsByType[TPageType]
