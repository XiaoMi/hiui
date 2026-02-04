import type React from 'react'
import type { PopoverProps } from '@hi-ui/popover'
import type { BuiltinTextFilterProps } from './filters/text'
import type { BuiltinNumberFilterProps } from './filters/number'
import type { BuiltinSelectFilterProps } from './filters/select'
import type { BuiltinDateFilterProps } from './filters/date'

export {
  // 内置过滤器 Props
  BuiltinTextFilterProps as TextFilterProps,
  BuiltinNumberFilterProps as NumberFilterProps,
  BuiltinSelectFilterProps as SelectFilterProps,
  BuiltinDateFilterProps as DateFilterProps,
}

export type FilterValueType = unknown[]

export type FilterType = 'text' | 'number' | 'select' | 'custom' | 'date'

// 基础的过滤器Props
export type CommonFilterProps = {
  /** 当前过滤值 */
  value?: FilterValueType
  /** 值变化回调 */
  onChange: (value?: FilterValueType) => void
  /** 关闭时回调 */
  onClose?: () => void
}

export type CustomFilterProps = Required<CommonFilterProps>

// TableFilter组件的Props
type BaseFilterProps = CommonFilterProps & {
  /** 自定义触发器 */
  trigger?: React.ReactNode
  /** 气泡卡片透传的属性配置 */
  popoverProps?: Partial<PopoverProps>
}

type DefineFilterProps<
  Type extends FilterType,
  BuiltinProps extends CommonFilterProps
> = BaseFilterProps &
  BuiltinProps &
  (Type extends 'custom'
    ? {
        type: Type
        // custom 必须传入 overlay
        overlay: React.ComponentType<BuiltinProps>
      }
    : {
        type: Type
        overlay?: undefined // 内置类型禁止传入 overlay
      })

export type TableFilterProps =
  | DefineFilterProps<'text', BuiltinTextFilterProps>
  | DefineFilterProps<'number', BuiltinNumberFilterProps>
  | DefineFilterProps<'select', BuiltinSelectFilterProps>
  | DefineFilterProps<'date', BuiltinDateFilterProps>
  | DefineFilterProps<'custom', CommonFilterProps>

/**
 * 从各个底层组件透传中取出的额外配置
 */
export type FilterExtraOptsType =
  // 如有需要可以继续扩展
  Pick<BuiltinSelectFilterProps, 'showCheckAll'>
