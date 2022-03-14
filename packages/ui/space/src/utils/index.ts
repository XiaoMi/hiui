import { SizeEnum, SizeType } from '../types'

const SizeValueEnum = {
  [SizeEnum.Small]: 8,
  [SizeEnum.Normal]: 16,
  [SizeEnum.Large]: 24,
}

const SIZE_ENUM_LIST = [SizeEnum.Large, SizeEnum.Normal, SizeEnum.Small]

/**
 *
 * @param gap 组件间间距
 * @returns 处理成标准格式flex gap
 */
export const handleTransformGap = (gap: SizeType) => {
  if (SIZE_ENUM_LIST.includes(gap as SizeEnum)) {
    const activeSize = SizeValueEnum[gap as SizeEnum]
    return activeSize || gap
  } else if (typeof gap === 'string' || typeof gap === 'number') {
    return Number(gap)
  } else if (Array.isArray(gap)) {
    return gap?.map((gapItem) => `${gapItem}px`).join(' ')
  } else {
    return gap
  }
}
