import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'
import { debounce } from '@hi-ui/func-utils'
import { GRID_VIEWPORT_BREAKPOINTS } from '../types'

export type BreakpointType = [width: number, column: number]

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
  defaultColumnCount?: number
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
   * @desc 默认使用 GRID_VIEWPORT_BREAKPOINTS: [576, 1], [768, 2], [992, 3], [1200, 4], [Infinity, 4]
   */
  breakpoints?: BreakpointType[]
  /**
   * 是否对初始布局变化敏感
   * @desc 当设置为 true 时，会等待布局稳定后再渲染内容，避免视觉跳动
   */
  sensitive?: boolean
}

export const DEFAULT_COLUMN_COUNT = 3

/** 元素未挂载时轮询检查的最大时长（ms） */
const MAX_EL_READY_POLL_DURATION = 3000
/** 轮询检查元素的间隔（ms） */
const EL_READY_POLL_INTERVAL = 50

// 根据容器宽度动态计算列数（与 GridResponsiveSize 断点一致）
const DEFAULT_BREAKPOINTS: BreakpointType[] = [
  [GRID_VIEWPORT_BREAKPOINTS.sm, 1], // xs: 宽度 < 576px 时，1 列
  [GRID_VIEWPORT_BREAKPOINTS.md, 2], // sm: 576px~768px，2 列
  [GRID_VIEWPORT_BREAKPOINTS.lg, 3], // md: 768px~992px，3 列
  [GRID_VIEWPORT_BREAKPOINTS.xl, 4], // lg: 992px~1200px，4 列
  [Infinity, 4], // xl: 宽度 >= 1200px，4 列
]

export function useColumnCount(ctx: UseColumnCountCtxType) {
  const ctxRef = useLatestRef(ctx)
  const [columnCount, _setColumnCount] = useState(
    ctx.columnCount ?? ctx.defaultColumnCount ?? DEFAULT_COLUMN_COUNT
  )
  const columnCountRef = useLatestRef(columnCount)
  const onColumnCountChangeRef = useLatestRef(ctx.onColumnCountChange)

  const setColumnCount = useMemo(
    () =>
      debounce((next: number) => {
        const prev = columnCountRef.current
        _setColumnCount(next)

        // 如果外部有传入，并且实际可视列数变化了，则触发回调
        const fn = onColumnCountChangeRef.current
        if (fn && prev !== next) fn(next)
      }, 32),
    [columnCountRef, onColumnCountChangeRef]
  )

  const isFirstCalcRef = useRef(true)
  const breakpointsRef = useLatestRef(ctx.breakpoints)

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  useEffect(() => {
    // 外部有传入，直接使用
    if (ctx.columnCount != null) {
      setColumnCount(ctx.columnCount)
      return
    }

    const setupObserver = (targetEl: HTMLElement) => {
      // 监听元素宽度变化
      const observer = new ResizeObserver((entries) => {
        if (ctxRef.current?.sensitive && isFirstCalcRef.current) {
          isFirstCalcRef.current = false
          setColumnCount(columnCountRef.current ?? DEFAULT_COLUMN_COUNT)
          return
        }

        const entry = entries[0]
        const width = entry.contentRect.width
        const breakpoints = breakpointsRef.current ?? DEFAULT_BREAKPOINTS
        setColumnCount(calcColumnCount(width, breakpoints))
      })
      observer.observe(targetEl)
      observerRef.current = observer
    }

    const cleanup = () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      setColumnCount.cancel()
    }

    const el = ctx.wrapperElRef?.current
    // 元素已挂载时，直接启动监听
    if (el) {
      setupObserver(el)
      return cleanup
    }

    // 元素未挂载时，启动定时器轮询检查，超时后使用默认值
    // 元素未挂载时，启动定时器轮询检查
    const startTime = Date.now()
    pollTimerRef.current = setInterval(() => {
      // 1. 检查元素是否已挂载
      const currentEl = ctxRef.current?.wrapperElRef?.current
      if (currentEl) {
        // 2. 已挂载：清除定时器，设置 ResizeObserver
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current)
          pollTimerRef.current = null
        }
        setupObserver(currentEl)
        return
      }

      // 3. 未挂载且超时：清除定时器，使用默认列数
      if (Date.now() - startTime >= MAX_EL_READY_POLL_DURATION) {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current)
          pollTimerRef.current = null
        }
        setColumnCount(ctxRef.current?.defaultColumnCount ?? DEFAULT_COLUMN_COUNT)
      }
    }, EL_READY_POLL_INTERVAL)

    return cleanup
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
