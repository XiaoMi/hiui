import React, { forwardRef } from 'react'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from '@hi-ui/array-utils'
import { useSelectContext } from './context'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { SelectItemEventData } from './types'

const optionPrefix = getPrefixCls('select-option')

export const SelectOption = forwardRef<HTMLDivElement | null, SelectOptionProps>(
  (
    {
      prefixCls = optionPrefix,
      className,
      children,
      option = {},
      depth,
      onClick,
      titleRender,
      focused,
      ...rest
    },
    ref
  ) => {
    const { onSelect, getSelectItemEventData } = useSelectContext()

    const eventDataRef = useLatestRef(getSelectItemEventData(option))
    const { selected, disabled } = eventDataRef.current

    const handleClick = useLatestCallback((evt) => {
      onSelect(eventDataRef.current)
      onClick?.(evt)
    })

    const cls = cx(
      prefixCls,
      className,
      selected && `${prefixCls}--selected`,
      disabled && `${prefixCls}--disabled`,
      focused && `${prefixCls}--focused`
    )

    return (
      <div ref={ref} className={cls} onClick={handleClick} {...rest}>
        {renderIndent(prefixCls, depth)}
        {renderTitle(prefixCls, eventDataRef.current, titleRender)}
        {/* <span className={`${prefixCls}__title`}>{option.title}</span> */}
      </div>
    )
  }
)

export interface SelectOptionProps extends HiBaseHTMLProps {}

;(SelectOption as any).HiName = 'SelectOption'
if (__DEV__) {
  SelectOption.displayName = 'SelectOption'
}

/**
 * 渲染空白占位
 */
const renderIndent = (prefixCls: string, depth: number) => {
  return times(depth, (index: number) => {
    return (
      <span key={index} style={{ alignSelf: 'stretch' }}>
        <span className={cx(`${prefixCls}__indent`)} />
      </span>
    )
  })
}

const renderTitle = (
  prefixCls: string,
  node: SelectItemEventData,
  titleRender?: (node: any) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(node) : true

  return <div className={`${prefixCls}__title`}>{title === true ? node.title : title}</div>
}
