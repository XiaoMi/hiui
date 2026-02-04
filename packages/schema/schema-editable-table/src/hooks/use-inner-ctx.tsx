import { useCallback, useMemo } from 'react'
import { useLatest } from 'ahooks'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import { EditableSchemaTableCtxType } from '../ctx'
import type { TableCtxRefType } from '../table'
import { getCellOpFn } from './use-table-meta'

type InnerCtxType<TData extends AnyObject = AnyObject> = Omit<
  EditableSchemaTableCtxType<TData>,
  'exposeCtxValueRef'
> &
  Omit<
    TableCtxRefType<TData>,
    // innerRef 等于 ctxValue
    | 'innerRef'
    // scrollIntoView在内部直接实现
    | 'scrollIntoView'
    // get/update/reset/set 四个方法从 globalActionsRef 上获取
    | 'getDataSource'
    | 'updateDataSource'
    | 'resetDataSource'
    | 'setDataSource'
    // getCellValue 和 setCellValue 从 getCellOpFn 上获取
    | 'getCellValue'
    | 'setCellValue'
    // setSelectedRowKeys 从 globalActionsRef 上获取
    | 'setSelectedRowKeys'
  >

/**
 * 组装内部上下文
 * @desc 没啥特殊逻辑，完全是Table里代码太多了，精简拆分一下
 */
export function useTableInnerCtx<TData extends AnyObject = AnyObject>(ctx: InnerCtxType<TData>) {
  const {
    table,
    setDynamicOpts,
    subscription,
    tableContainerRef,
    rowActions,
    rowSelectionState,
    paginationState,
    filterState,
    sorterState,
    propsRef,
    globalStaticRef,
    globalActionsRef,
    rerender,
    getFieldsValue,
    getGroupedValues,
  } = ctx

  const {
    // globalActions
    getDataSource,
    updateDataSource,
    resetDataSource,
    setDataSource,
    setSelectedRowKeys,
  } = globalActionsRef.current

  const scrollIntoView = useCallback(
    function scrollIntoView(behavior: ScrollBehavior = 'instant') {
      tableContainerRef.current?.scrollTo({ top: 0, left: 0, behavior })
    },
    [tableContainerRef]
  )

  const exposeCtxValue = () => {
    const exposed: TableCtxRefType<TData> = {
      table,
      subscription,
      rowActions,
      rerender,
      getFieldsValue,
      getGroupedValues,
      getDataSource,
      updateDataSource,
      resetDataSource,
      setDataSource,
      ...getCellOpFn(table),
      setSelectedRowKeys,
      scrollIntoView,
      innerRef: getInnerRef(),
    }

    return exposed
  }
  // 内部可能会需要暴露出去的值
  const exposeCtxValueRef = useLatest(exposeCtxValue) as ReadonlyRefObject<typeof exposeCtxValue>

  const ctxValue = useMemo(() => {
    const values: EditableSchemaTableCtxType<TData> = {
      table,
      setDynamicOpts,
      subscription,
      tableContainerRef,
      rowActions,
      rowSelectionState,
      paginationState,
      filterState,
      sorterState,
      propsRef,
      globalStaticRef,
      globalActionsRef,
      exposeCtxValueRef,
    }

    return values
  }, [
    table,
    setDynamicOpts,
    subscription,
    tableContainerRef,
    rowActions,
    rowSelectionState,
    paginationState,
    filterState,
    sorterState,
    propsRef,
    globalStaticRef,
    globalActionsRef,
    exposeCtxValueRef,
  ])

  function getInnerRef() {
    return { current: ctxValue }
  }

  return { ctxValue, exposeCtxValue }
}
