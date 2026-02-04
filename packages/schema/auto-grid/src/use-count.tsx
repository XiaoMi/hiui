import React, { useEffect, useRef, useState } from 'react'
import { useDebounceFn, useLatest, usePrevious } from 'ahooks'

type BreakpointType = [width: number, column: number]

export type UseColumnCountCtxType = {
  /**
   * 列数，表示一行包含元素的数量
   * @default 3
   * @desc 传入此值时，列数固定，不因容器宽度变化而变化
   * @desc 不传时，但额外传入 wrapperElRef 时，列数会根据容器宽度变化而变化
   */
  columnCount?: number
  /**
   * 默认列数
   * @desc 与 columnCount 的区别是，仅会在初始化时使用
   * @desc 传入后，列数仍会根据容器宽度变化而变化
   */
  dftColumnCount?: number
  /**
   * 组件的外部包裹元素
   * @desc 传入此值，同时不传 columnCount 时，列数会根据容器宽度变化而变化
   */
  wrapperElRef?: React.RefObject<HTMLElement>
  /**
   * 实际可视列数变化回调
   */
  onColumnCountChange?: (columnCount: number) => void
  /**
   * 列数变化断点
   * @desc 默认值为 [632, 1], [958, 2], [1284, 3], [1610, 4], [1936, 4], [Infinity, 4]
   */
  breakpoints?: BreakpointType[]
  /**
   * 是否对初始布局变化敏感
   * @desc 当设置为 true 时，会等待布局稳定后再渲染内容，避免视觉跳动
   */
  layoutShiftSensitive?: boolean
}

export const dftColumnCount = 3

// 根据容器宽度动态计算列数
const dftBreakpoints: BreakpointType[] = [
  [632, 1], // 宽度小于 632px 时，使用 1 列
  [958, 2], // 宽度在 632px-958px 之间时，使用 2 列
  [1284, 3], // 宽度在 958px-1284px 之间时，使用 3 列
  [1610, 4], // 宽度在 1284px-1610px 之间时，使用 4 列
  [1936, 4], // 宽度在 1610px-1936px 之间时，使用 4 列
  [Infinity, 4], // 宽度大于 1936px 时，使用 4 列
]

export function useColumnCount(ctx: UseColumnCountCtxType) {
  const ctxRef = useLatest(ctx)
  const [columnCount, _setColumnCount] = useState(
    ctx.columnCount || ctx.dftColumnCount || dftColumnCount
  )
  const columnCountRef = useLatest(columnCount)

  const prevColumnCountRef = useLatest(usePrevious(columnCount))
  const onColumnCountChangeRef = useLatest(ctx.onColumnCountChange)

  const { run: setColumnCount } = useDebounceFn(
    function handleColumnCountChange(next: number) {
      _setColumnCount(next)

      // 如果外部有传入，并且实际可视列数变化了，则触发回调
      const onColumnCountChange = onColumnCountChangeRef.current
      if (onColumnCountChange && prevColumnCountRef.current !== next) {
        onColumnCountChange(next)
      }
    },
    { wait: 32 }
  )

  const isFirstCalcRef = useRef(true)
  const breakpointsRef = useLatest(ctx.breakpoints)

  useEffect(() => {
    // 外部有传入，直接使用
    if (ctx.columnCount) return setColumnCount(ctx.columnCount)

    // 元素不存在，退出
    const el = ctx.wrapperElRef?.current
    if (!el) return setColumnCount(ctxRef.current?.dftColumnCount || dftColumnCount)

    // 监听元素宽度变化
    const observer = new ResizeObserver((entries) => {
      // 如果开启了布局敏感，并且是第一次计算，则跳过
      if (ctxRef.current?.layoutShiftSensitive && isFirstCalcRef.current) {
        isFirstCalcRef.current = false

        // 不计算，但是要触发 onColumnCountChange
        setColumnCount(columnCountRef.current ?? dftColumnCount)
        return
      }

      const entry = entries[0]
      const width = entry.contentRect.width
      const breakpoints = breakpointsRef.current || dftBreakpoints
      setColumnCount(calcColumnCount(width, breakpoints))
    })
    observer.observe(el)

    // 卸载时，移除监听
    return () => observer.disconnect()
  }, [ctx.columnCount, ctx.wrapperElRef, ctxRef, setColumnCount, breakpointsRef, columnCountRef])

  return columnCount
}

export function calcColumnCount(width: number, breakpoints: BreakpointType[]) {
  let column = 1 // 默认为1列
  for (const [breakpoint, cols] of breakpoints) {
    if (width <= breakpoint) {
      column = cols
      break
    }
  }
  return column
}

export function calcRowCount(length: number, columnCount: number) {
  return Math.ceil(length / columnCount)
}
