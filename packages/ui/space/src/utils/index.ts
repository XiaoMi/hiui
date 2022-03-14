import { SizeEnum } from '../types'

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
export const handleTransformGap = (
  gap: SizeEnum.Large | SizeEnum.Normal | SizeEnum.Small | number | string | number[] | string[]
) => {
  if (SIZE_ENUM_LIST.includes(gap as SizeEnum)) {
    const activeSize = SizeValueEnum[gap as SizeEnum]
    return activeSize || gap
  } else if (typeof gap === 'string' && typeof gap === 'number') {
    return String(gap)
  } else if (Array.isArray(gap)) {
    return gap.join(' ')
  } else {
    return gap
  }
}
