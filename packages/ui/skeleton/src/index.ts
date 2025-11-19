import './styles/index.scss'

import { Skeleton as _Skeleton } from './Skeleton'
import { SkeletonGroup } from './SkeletonGroup'

const Skeleton = Object.assign(_Skeleton, { Group: SkeletonGroup })

export default Skeleton
export * from './Skeleton'
export * from './SkeletonGroup'
