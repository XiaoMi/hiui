import { useEffect, useRef } from 'react'
import { useUpdate } from '@hi-ui/schema-hooks'
import type { Subscription } from '@hi-ui/use-subscription'

/**
 * 监听表格数据变化，并触发重渲染
 * @notice 仅在表格数据发生【全量变化】时触发重渲染
 * @param tableValue 表格数据
 * @returns 重渲染函数
 */
// NOTE 1. pendingRef存在的意义
// 避免在同一个微任务周期内，多次触发重渲染
// 例如在循环中，多次触发 rowActions.addRow()

// NOTE 2. 重渲染次数
// 此处内部的 rerender() 会触发一次重渲染
// 随后 useReactTable 接受到新的数据后，会再次触发一次重渲染
// 两次重渲染暂不可避免，仅在此处记录
export function useTableUpdate<T>(tableValue: Subscription<T[]>) {
  const [forceRerenderFlag, rerender] = useUpdate()
  const pendingRef = useRef(false)

  useEffect(() => {
    return tableValue.subscribe((notification) => {
      // 静默更新时，不再执行
      if (notification.extra?.silent) return

      if (notification.extra?.complete) {
        if (pendingRef.current) return

        pendingRef.current = true
        // 一个微任务周期内仅执行一个重渲染
        Promise.resolve().then(() => {
          pendingRef.current = false
          rerender()
        })
      }
    })
  }, [tableValue, rerender])

  return { rerender, forceRerenderFlag }
}
