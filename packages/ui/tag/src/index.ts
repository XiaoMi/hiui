import './styles/index.scss'

import { TagGroup } from './TagGroup'
import { Tag as _Tag } from './Tag'

const Tag: typeof _Tag & {
  Group: typeof TagGroup
} = _Tag as any
Tag.Group = TagGroup

export { Tag }
export { Tag as default } from './Tag'
export type { TagGroupNode, TagGroupProps } from './TagGroup'
export type { TagProps } from './Tag'
