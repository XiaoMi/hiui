import React from 'react'
import type { AggregatedCellProps, AggregatedCellRenderCtxType } from './aggregated'

export type CustomCellType<TData extends AnyObject> = {
  /**
   * 聚合单元格【组件】
   * - 获得全量的渲染能力，内部全部的聚合单元格均会使用此组件
   * - 但使用难度较大，需自行实现内部的渲染判断逻辑
   * - 若仅需自定义已知聚合单元格的渲染逻辑，请使用 renderAggregatedCell
   */
  aggregatedCell?: (props: AggregatedCellProps<TData>) => React.ReactElement | null
  /**
   * 聚合单元格【渲染函数】
   * - 用于自定义已知聚合单元格的渲染逻辑
   * - 已知是指开启聚合后，页面已经展示的【有效聚合单元格】
   * - 无需再判断单元格是否已经是聚合单元格，可以仅关心所需的渲染逻辑
   * - 若需获取全量的渲染能力，请使用 aggregatedCell
   */
  renderAggregatedCell?: (ctx: AggregatedCellRenderCtxType<TData>) => React.ReactElement | null
}
