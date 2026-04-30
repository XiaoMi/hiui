import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'

const _prefix = getPrefixCls('switch')

/**
 * 开关
 */
export const Switch = forwardRef<HTMLDivElement | null, SwitchProps>(
  (
    {
      prefixCls = _prefix,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      size: sizeProp,
      onChange,
      content,
      checked: checkedProp,
      defaultChecked = false,
      disabled = false,
      onClick,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const globalContext = useGlobalContext() as ReturnType<typeof useGlobalContext> & {
      switch?: { classNames?: any; styles?: any }
    }
    const { size: globalSize } = globalContext
    const switchConfig = globalContext.switch
    let size = sizeProp ?? globalSize ?? 'md'
    if (size === 'xs') {
      size = 'sm'
    }

    const [checked, tryChangeChecked] = useUncontrolledState(defaultChecked, checkedProp, onChange)

    const { classNames, styles } = useMergeSemantic<
      SwitchSemanticClassNames,
      SwitchSemanticStyles,
      SwitchProps
    >({
      classNamesList: [switchConfig?.classNames, classNamesProp],
      stylesList: [switchConfig?.styles, stylesProp],
      info: { props: { ...rest, checked, disabled, size } },
    })

    const changeSwitch = useCallback(() => {
      if (disabled) return
      tryChangeChecked((prev) => !prev)
    }, [disabled, tryChangeChecked])

    const handleKeydown = useCallback(
      (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if ([13, 32].includes(evt.keyCode)) {
          evt.preventDefault()
          evt.stopPropagation()

          changeSwitch()
        }
      },
      [changeSwitch]
    )

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
      `${prefixCls}--${checked ? 'open' : 'closed'}`,
      disabled && `${prefixCls}--disabled`,
      size && `${prefixCls}--size-${size}`
    )

    return (
      <div
        ref={ref}
        role="switch"
        className={cls}
        style={{ ...style, ...styles?.root }}
        tabIndex={disabled ? -1 : 0}
        onClick={mockDefaultHandlers(onClick, changeSwitch)}
        onKeyDown={mockDefaultHandlers(onKeyDown, handleKeydown)}
        {...rest}
      >
        {Array.isArray(content) && content.length === 2 ? (
          <span className={cx(`${prefixCls}__text`, classNames?.text)} style={styles?.text}>
            {checked ? content[0] : content[1]}
          </span>
        ) : null}
        <span className={cx(`${prefixCls}__handle`, classNames?.handle)} style={styles?.handle} />
      </div>
    )
  }
)

export type SwitchSemanticName = 'root' | 'text' | 'handle'
export type SwitchSemanticClassNames = SemanticClassNamesType<SwitchProps, SwitchSemanticName>
export type SwitchSemanticStyles = SemanticStylesType<SwitchProps, SwitchSemanticName>
export type SwitchSemantic = ComponentSemantic<SwitchSemanticClassNames, SwitchSemanticStyles>

export interface SwitchProps extends HiBaseHTMLProps<'div'>, SwitchSemantic {
  /**
   * 开关大小
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否选中
   */
  checked?: boolean
  /**
   * 是否默认选中
   */
  defaultChecked?: boolean
  /**
   * 开关状态内容，用法：['开', '关']
   */
  content?: [React.ReactNode, React.ReactNode]
  /**
   * 状态改变时的回调
   */
  onChange?: (checked: boolean) => void
}

if (__DEV__) {
  Switch.displayName = 'Switch'
}
