import { HiBaseSizeEnum } from '@hi-ui/core'
import { invariant } from '@hi-ui/env'
import { SpaceSizeEnum } from '../types'

const SizeValueEnum = {
  [HiBaseSizeEnum.SM]: 8,
  [HiBaseSizeEnum.MD]: 16,
  [HiBaseSizeEnum.LG]: 24,
}

const SIZE_ENUM_LIST = [HiBaseSizeEnum.SM, HiBaseSizeEnum.MD, HiBaseSizeEnum.LG]

/**
 *
 * @param gap 组件间间距
 * @returns 处理成标准格式flex gap
 */
export const handleTransformGap = (gap: SpaceSizeEnum) => {
  if (SIZE_ENUM_LIST.includes(gap as HiBaseSizeEnum)) {
    const activeSize = SizeValueEnum[gap as HiBaseSizeEnum]
    return activeSize
  }

  if (typeof gap === 'string' || typeof gap === 'number') {
    return Number(gap)
  }

  if (Array.isArray(gap)) {
    return gap.map((gapItem) => `${gapItem}px`).join(' ')
  }

  invariant(true, 'The gap prop is not valid value in Space')
  return gap
}
