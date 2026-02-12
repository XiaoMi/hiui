import type {
  FormGroupActionCtxType,
  ListActionCtxType,
  ListItemActionCtxType,
  FormEditTableToolbarCtxType,
  OpButtonRenderCtx,
  BottomRenderCtxType,
  TableToolbarCtxType,
  ProTableToolbarProps,
} from '../interface'

import { ActionCreator } from './base'

export * from './base'
export * from './type'

type ActionCreatorParams = ConstructorParameters<typeof ActionCreator>

export const A = (...params: ActionCreatorParams) => new ActionCreator(...params)

A.Any = (...params: ActionCreatorParams) => new ActionCreator<AnyType, AnyType>(...params)

A.FormGroup = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, FormGroupActionCtxType>(...params)
A.FormList = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, ListActionCtxType>(...params)
A.FormListItem = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, ListItemActionCtxType>(...params)
A.FormEditTableToolbar = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, FormEditTableToolbarCtxType>(...params)

A.EditTableRow = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, OpButtonRenderCtx<AnyObject>>(...params).Appearance('link')
A.EditTableBottom = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, BottomRenderCtxType>(...params)

A.TableToolbar = (...params: ActionCreatorParams) =>
  new ActionCreator<AnyObject, TableToolbarCtxType>(...params)
A.ProTableToolbar = (...params: ActionCreatorParams) =>
  // @ts-expect-error 忽略类型检查
  new ActionCreator<AnyObject, ProTableToolbarProps['ctx']>(...params)

A.Group = (...params: ActionCreatorParams) => new ActionCreator<AnyObject, AnyObject>(...params)
