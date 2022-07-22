import './styles/index.scss'

import { TagGroup as Group } from './TagGroup'
import { Tag as _Tag } from './Tag'

const Tag = Object.assign(_Tag, { Group })

export default Tag

export * from './Tag'
export * from './TagGroup'
