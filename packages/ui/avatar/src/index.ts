import './styles/index.scss'

import { Avatar as _Avatar } from './Avatar'
import { AvatarGroup } from './AvatarGroup'

const Avatar = Object.assign(_Avatar, { Group: AvatarGroup })

export default Avatar

export * from './Avatar'
