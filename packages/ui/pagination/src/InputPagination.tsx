import React, { forwardRef, useCallback, useEffect, useMemo } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCounter } from '@hi-ui/counter'
import { calculateCurrentPageSize, calculatePage, MIN_PAGE } from './util'
import { useLatestRef } from '@hi-ui/use-latest'
import { LeftOutlined, RightOutlined } from '@hi-ui/icons'

const _role = 'input-pagination'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is InputPagination
 */
export const InputPagination = forwardRef<HTMLDivElement | null, InputPaginationProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      onChange,
      className,
      total,
      current: currentProp,
      defaultCurrent = MIN_PAGE,
      pageSize = 10,
      showTotal = true,
      showJumper = true,
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

    return (
      <div ref={ref} role={role} {...rootProps}>
        <button {...getMinusButtonProps()}>
          <LeftOutlined />
        </button>
        {showJumper ? (
          <>
            <input {...getInputProps()} />
            {showTotal ? <span className={`${prefixCls}__total`}>{`/ ${maxPage}`}</span> : null}
          </>
        ) : null}
        <button {...getPlusButtonProps()}>
          <RightOutlined />
        </button>
      </div>
    )
  }
)

export interface InputPaginationProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
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
}

if (__DEV__) {
  InputPagination.displayName = 'InputPagination'
}
