import { isArray } from '@hi-ui/type-assertion'
import { TriggerActionEnum } from '../types'

/**
 * 抹平 trigger 结构为数组
 *
 * @param trigger
 * @returns
 */
export const normalizeTrigger = (trigger: TriggerActionEnum | TriggerActionEnum[]) =>
  isArray(trigger) ? Array.from(new Set(trigger)) : [trigger]
