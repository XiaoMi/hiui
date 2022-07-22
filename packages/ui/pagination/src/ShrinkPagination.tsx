import React, { forwardRef, useCallback, useEffect, useMemo } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCounter } from '@hi-ui/counter'
import { calculateCurrentPageSize, calculatePage, MIN_PAGE } from './util'
import { useLatestRef } from '@hi-ui/use-latest'
import { PagerButton } from './PagerButton'
import Input from '@hi-ui/input'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _prefix = getPrefixCls('pagination-mini')

/**
 * TODO: What is ShrinkPagination
 */
export const ShrinkPagination = forwardRef<HTMLDivElement | null, ShrinkPaginationProps>(
  (
    {
      prefixCls = _prefix,
      role = 'pagination',
      onChange,
      className,
      total,
      current: currentProp,
      defaultCurrent = MIN_PAGE,
      pageSize = 10,
      showTotal = true,
      showJumper = true,
      autoHide = false,
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const [current, trySetCurrent] = useUncontrolledState(defaultCurrent, currentProp, onChange)

    const currentRef = useLatestRef(current)

    const proxyTrySetCurrent = useCallback(
      (nextCurrent: number) => {
        if (currentRef.current === nextCurrent) return
        trySetCurrent?.(nextCurrent, current, calculateCurrentPageSize(current, total, pageSize))
      },
      [current, total, pageSize, trySetCurrent, currentRef]
    )

    const maxPage = useMemo(() => {
      const computedPage = calculatePage(total, pageSize)
      return computedPage > MIN_PAGE ? computedPage : MIN_PAGE
    }, [total, pageSize])

    useEffect(() => {
      // 页码修正：在 minPage ~ maxPage 之间
      if (maxPage < current) {
        trySetCurrent(maxPage)
      } else {
        if (MIN_PAGE > current) {
          trySetCurrent(MIN_PAGE)
        }
      }
    }, [current, trySetCurrent, maxPage])

    const { rootProps, getInputProps, getPlusButtonProps, getMinusButtonProps } = useCounter({
      ...rest,
      prefixCls,
      className,
      role,
      value: current,
      min: MIN_PAGE,
      max: maxPage,
      onChange: proxyTrySetCurrent,
      focusOnStep: false,
    })

    // 优化数据在第一页且数据一页内时，不展示 pagination 配置项
    const hiddenPagination = autoHide && current === 1 && maxPage === 1

    if (hiddenPagination) return null

    return (
      <div ref={ref} role={role} {...rootProps}>
        {/* TODO: 分离实现
          分页的快捷键是回车下一页，
          counter 的快捷键焦点始终在 input 之上，上下控制加减
        */}
        <PagerButton {...getMinusButtonProps()} type="prev" />

        {showJumper ? (
          <>
            {/* @ts-ignore */}
            <Input {...getInputProps()} appearance="filled" />
            {showTotal ? <span className={`${prefixCls}__total`}>{`/ ${maxPage}`}</span> : null}
          </>
        ) : null}

        <PagerButton {...getPlusButtonProps()} type="next" />
      </div>
    )
  }
)

export interface ShrinkPaginationProps extends HiBaseHTMLProps<'div'> {
  /**
   * 当前页码
   */
  current?: number

  /**
   * 默认当前页码
   */
  defaultCurrent?: number
  /**
   * 	每页条数
   */
  pageSize?: number
  /**
   * 	数组总数
   */
  total: number
  /**
   * 	是否展示数组总数
   */
  showTotal?: boolean
  /**
   * 	是否显示跳转
   */
  showJumper?: boolean
  /**
   * 	页码改变时的回调
   */
  onChange?: (current: number, prev: number, pageSize: number) => void
  /**
   * 设置尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 	只有一页时是否隐藏分页器
   */
  autoHide?: boolean
}

if (__DEV__) {
  ShrinkPagination.displayName = 'ShrinkPagination'
}
