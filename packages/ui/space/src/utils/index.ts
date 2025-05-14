import { invariant } from '@hi-ui/env'
import { SpaceSizeEnum } from '../types'

const sizeValueMap = {
  sm: 8,
  md: 16,
  lg: 24,
}

const SIZE_ENUM_LIST = Object.keys(sizeValueMap)

/**
 *
 * @param gap 组件间间距
 * @returns 处理成标准格式flex gap
 */
export const handleTransformGap = (gap: SpaceSizeEnum) => {
  if (SIZE_ENUM_LIST.includes(gap as string)) {
    const activeSize = sizeValueMap[gap as keyof typeof sizeValueMap]
    return activeSize
  }

  if (typeof gap === 'string' || typeof gap === 'number') {
    return Number(gap)
  }

  if (Array.isArray(gap)) {
    return gap.map((gapItem) => `${gapItem}px`).join(' ')
  }

  invariant(false, 'The gap prop is not valid value in Space')
  return gap
}
