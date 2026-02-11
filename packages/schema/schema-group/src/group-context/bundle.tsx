import React from 'react'
import { GroupMapProvider } from './ctx'

import {
  SchemaFormBridge,
  SchemaTableBridge,
  SchemaDescriptionsBridge,
  SchemaEditTableBridge,
} from './bridge'

export const GroupMap = {
  form: SchemaFormBridge,
  table: SchemaTableBridge,
  descriptions: SchemaDescriptionsBridge,
  'edit-table': SchemaEditTableBridge,
} satisfies Record<string, AnyComponent>

export type GroupMapType = typeof GroupMap

export function BuiltinGroupMapProvider(props: React.PropsWithChildren<unknown>) {
  return <GroupMapProvider groups={GroupMap}>{props.children}</GroupMapProvider>
}
