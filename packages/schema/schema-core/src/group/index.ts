import { GroupCreator } from './base'
import type { FormGroupType } from './type'

export * from './base'
export * from './type'
export * from './utils'

type GroupCreatorParams = ConstructorParameters<typeof GroupCreator>

export const G = (...params: GroupCreatorParams) => new GroupCreator(...params)
export const GS = (...params: GroupCreatorParams) => new GroupCreator<'simple'>(...params)

G.Form = (...params: GroupCreatorParams) => new GroupCreator<FormGroupType>(...params)
