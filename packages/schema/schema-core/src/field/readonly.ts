// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import type React from 'react' // 勿删
import type { TableColumnItem } from '@hi-ui/table'
import type { DescriptionsItemProps } from '@hi-ui/descriptions'
import { FieldCreator } from './base'

export class ReadonlyFieldCreator extends FieldCreator {
  // ReadonlyFieldCreator
}

type ReadonlyFieldCreatorParams = ConstructorParameters<typeof ReadonlyFieldCreator>

export const T = (...params: ReadonlyFieldCreatorParams) =>
  new FieldCreator<AnyObject, Partial<TableColumnItem>>(...params)

export const D = (...params: ReadonlyFieldCreatorParams) =>
  new FieldCreator<AnyObject, DescriptionsItemProps>(...params)
