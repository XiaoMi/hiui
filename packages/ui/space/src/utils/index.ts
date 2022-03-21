import { HiBaseSizeEnum } from '@hi-ui/core'
import { SizeType } from '../types'

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
export const handleTransformGap = (gap: SizeType) => {
  if (SIZE_ENUM_LIST.includes(gap as HiBaseSizeEnum)) {
    const activeSize = SizeValueEnum[gap as HiBaseSizeEnum]
    return activeSize || gap
  } else if (typeof gap === 'string' || typeof gap === 'number') {
    return Number(gap)
  } else if (Array.isArray(gap)) {
    return gap?.map((gapItem) => `${gapItem}px`).join(' ')
  } else {
    return gap
  }
}
