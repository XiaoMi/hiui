import './styles/index.scss'

import { Tag as _Tag } from './Tag'
import { TagGroup } from './TagGroup'

const Tag: typeof _Tag & {
  TagGroup: typeof TagGroup
} = _Tag as any

Tag.TagGroup = TagGroup

export { Tag }
export default Tag

export type { TagProps } from './Tag'
export type { TagGroupNode, TagGroupProps } from './TagGroup'
