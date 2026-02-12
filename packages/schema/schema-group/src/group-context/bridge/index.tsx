export { SchemaFormBridge } from './form'
export { SchemaTableBridge } from './table'
export { SchemaDescriptionsBridge } from './descriptions'
export { SchemaEditTableBridge } from './edit-table'

export type GroupBridgeProps<T> = T & {
  dataIndex?: string
}
