import type { VirtualizerOptions as OriginalOptions } from '@tanstack/react-virtual'
import type { BoolConfig } from '@hi-ui/schema-utils'

export type VirtualizerOptions = Partial<
  Omit<OriginalOptions<HTMLDivElement, HTMLDivElement>, 'count' | 'getScrollElement'>
>

// VirtualizeOpts 和 VirtualizeConfig 就是同一个东西
// VirtualizeOpts 是内部使用的完整配置
export type VirtualizeOpts = {
  row?: VirtualizerOptions
  column?: VirtualizerOptions
}

// VirtualizeConfig 是 Table 入口使用的可简化的配置
export type VirtualizeConfig = {
  row?: BoolConfig<VirtualizerOptions>
  column?: BoolConfig<VirtualizerOptions>
}

export type TableStickyOpts = {
  header?: boolean
  footer?: boolean
  headerTop?: number
  footerBottom?: number
}
