import React, { forwardRef, useState, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import Input from '@hi-ui/input'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { usePopper } from 'react-popper'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { CheckCascaderPanel } from './CheckCascaderPanel'
import { defaultSuffixIcon } from './icons'

const _role = 'check-cascader'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CheckCascader
 */
export const CheckCascader = forwardRef<HTMLDivElement | null, CheckCascaderProps>(
  ({ prefixCls = _prefix, role = _role, className, defaultValue, value: valueProp, onChange ...rest }, ref) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const [menuVisible, menuVisibleAction] = useToggle()

    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)
    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [arrowElRef, setArrowElmRef] = useState<HTMLElement | null>(null)
    const cascaderRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick(cascaderRef, menuVisibleAction.off)

    const { styles, attributes } = usePopper(targetElRef, popperElRef.current, {
      placement: 'bottom-start',
      modifiers: [
        {
          enabled: true,
          name: 'arrow',
          options: {
            element: arrowElRef,
          },
        },
        {
          enabled: true,
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
    })

    const cls = cx(prefixCls, className)

    return (
      <div
        ref={useMergeRefs(ref, cascaderRef)}
        role={role}
        className={cls}
        onClick={(evt) => {
          evt.stopPropagation()
          menuVisibleAction.on()
        }}
      >
        <Input ref={setTargetElRef} suffix={defaultSuffixIcon} />
        {menuVisible ? (
          <div
            className={`${prefixCls}__modal`}
            ref={popperElRef}
            style={{ ...styles.popper, zIndex: 2 }}
            {...attributes.popper}
          >
            <div ref={setArrowElmRef} style={styles.arrow} />
            <CheckCascaderPanel value={value} onChange={tryChangeValue} {...rest} />
          </div>
        ) : null}
      </div>
    )
  }
)

export interface CheckCascaderProps {
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
}

if (__DEV__) {
  CheckCascader.displayName = 'CheckCascader'
}
