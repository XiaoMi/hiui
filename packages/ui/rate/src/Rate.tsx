import React, { forwardRef, useState, useMemo, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import * as Icons from './StarSVG'

const _role = 'rate'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Rate
 */
export const Rate = forwardRef<HTMLUListElement | null, RateProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      disabled = false,
      readonly = false,
      count = 5,
      value: valueProp,
      defaultValue = 0,
      onChange,
      allowHalf = true,
      character,
      renderCharacter,
      halfPlacement = 'horizontal',
      clearable = true,
      style,
      color,
      tabIndex = 0,
      autoFocus = false,
      onFocus,
      onBlur,
      onKeyDown,
      onMouseLeave,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    const [hoverValue, setHoverValue] = useState(0)

    const isHover = hoverValue > 0
    // hover 将展示对应的 ⭐️ 个数，对于展示层，优先级大于用户设置的 value
    const displayValue = isHover ? hoverValue : value

    const isNonInteractive = disabled || readonly

    const proxyTryChangeValue = (nextValue: number) => {
      if (isNonInteractive) return

      if (!allowHalf) {
        nextValue = Math.ceil(nextValue)
      }

      const shouldClear = clearable && nextValue === value

      if (shouldClear) {
        nextValue = 0
      }

      nextValue = formatRangeValue(nextValue, 0, count)
      if (nextValue !== value) {
        tryChangeValue(nextValue)
      }
    }

    const proxyTryChangeHoverValue = (nextHoverValue: number) => {
      if (isNonInteractive) return
      const minHoveredValue = allowHalf ? 0.5 : 1

      nextHoverValue = formatRangeValue(nextHoverValue, minHoveredValue, count)
      if (nextHoverValue !== hoverValue) {
        setHoverValue(nextHoverValue)
      }
    }

    const handleIconLeave = (evt: React.MouseEvent<HTMLUListElement>) => {
      if (isNonInteractive) return

      // 当鼠标移出时，设为原值
      setHoverValue(value)
      onMouseLeave?.(evt)
    }

    const rateRef = useRef<HTMLUListElement>(null)
    const [focus, setFocus] = useState(false)

    const focusRate = () => {
      if (!disabled) {
        rateRef.current?.focus()
      }
    }

    // TODO: useDidMount 抽离，如何更好地配合组件库使用
    // 思考：useFocus 把聚焦逻辑（涉及到表单交互组件都需要）抽离处理
    useEffect(() => {
      if (autoFocus) {
        focusRate()
      }
      // 不依赖 `autoFocus`，保证只触发第一次
    }, [])

    const handleFocus = (evt: React.FocusEvent<HTMLUListElement>) => {
      if (disabled) return

      setFocus(true)
      onFocus?.(evt)
    }

    const handleBlur = (evt: React.FocusEvent<HTMLUListElement>) => {
      if (disabled) return

      setFocus(false)
      onBlur?.(evt)
    }

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLUListElement>) => {
      if (disabled) return

      evt.stopPropagation()

      // right
      if (evt.keyCode === 39) {
        evt.preventDefault()
        const step = allowHalf ? 0.5 : 1
        proxyTryChangeHoverValue(hoverValue + step)
      }

      // left
      if (evt.keyCode === 37) {
        evt.preventDefault()
        const step = allowHalf ? -0.5 : -1
        proxyTryChangeHoverValue(hoverValue + step)
      }

      // enter
      if (evt.keyCode === 13) {
        evt.preventDefault()
        proxyTryChangeValue(hoverValue)
      }

      onKeyDown?.(evt)
    }

    const cls = cx(
      prefixCls,
      className,
      focus && `${prefixCls}--focus`,
      disabled && `${prefixCls}--disabled`,
      readonly && `${prefixCls}--readonly`
    )

    const starCls = cx(
      `${prefixCls}__star`,
      disabled && `${prefixCls}__star--disabled`,
      readonly && `${prefixCls}__star--readonly`
    )

    const halfStarCls = `${prefixCls}__star__half`

    const isVertical = halfPlacement === 'vertical'

    const rootStyle = useMemo(() => ({ ...style, color, fill: color }), [style, color])

    const countArray = useMemo(() => Array(count).fill(undefined), [count])

    return (
      <ul
        ref={useMergeRefs(ref, rateRef)}
        role={role}
        className={cls}
        tabIndex={tabIndex}
        style={rootStyle}
        onMouseLeave={handleIconLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {countArray.map((_, idx) => {
          // 满星值
          const indexValue = idx + 1
          // 半星值
          const halfIndexValue = allowHalf ? idx + 0.5 : indexValue

          return (
            <li className={starCls} key={indexValue}>
              {/* HalfStar 1 */}
              <div
                className={cx(
                  halfStarCls,
                  `${halfStarCls}--${isVertical ? 'bottom' : 'left'}`,
                  halfIndexValue > displayValue && 'grayscale'
                )}
                onClick={() => proxyTryChangeValue(halfIndexValue)}
                onMouseEnter={() => proxyTryChangeHoverValue(halfIndexValue)}
              >
                <StarIcon
                  index={0}
                  value={indexValue}
                  className={`${prefixCls}__icon`}
                  disabled={isNonInteractive}
                  displayValue={displayValue}
                  allowHalf={allowHalf}
                  character={character}
                />
              </div>
              {/* HalfStar 2 */}
              <div
                className={cx(
                  halfStarCls,
                  `${halfStarCls}--${isVertical ? 'top' : 'right'}`,
                  indexValue > displayValue && 'grayscale'
                )}
                onClick={() => proxyTryChangeValue(indexValue)}
                onMouseEnter={() => proxyTryChangeHoverValue(indexValue)}
              >
                <StarIcon
                  index={1}
                  value={indexValue}
                  className={`${prefixCls}__icon`}
                  disabled={isNonInteractive}
                  displayValue={displayValue}
                  allowHalf={allowHalf}
                  character={character}
                />
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
)

export interface RateProps {
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
   * 禁用，无法进行交互,鼠标禁用交互效果
   */
  disabled?: boolean
  /**
   * 只读，无法进行交互
   */
  readonly?: boolean
  /**
   * star 数量
   */
  count?: number
  /**
   * 当前数，受控值
   */
  value?: number
  /**
   * 默认值
   */
  defaultValue?: number
  /**
   * 选择时的回调
   */
  onChange?: (value: number) => void
  /**
   * 是否允许半选
   */
  allowHalf?: boolean
  /**
   * 自定义字符
   */
  character?: React.ReactNode
  /**
   * 自定义渲染 character 函数
   */
  renderCharacter?: (value: number, index: number) => React.ReactNode
  /**
   * 开启半选时，星星展示方式
   */
  halfPlacement?: 'vertical' | 'horizontal'
  /**
   * 是否允许再次点击后清除
   */
  clearable?: boolean
  /**
   * 自定义颜色，css 支持的颜色值
   */
  color?: string
  tabIndex?: number
  autoFocus?: boolean
  onFocus?: (evt: React.FocusEvent<HTMLUListElement>) => void
  onBlur?: (evt: React.FocusEvent<HTMLUListElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLUListElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLUListElement>) => void
}

if (__DEV__) {
  Rate.displayName = 'Rate'
}

function StarIcon({
  className,
  index,
  value,
  displayValue,
  disabled,
  allowHalf,
  character,
}: StarIconProps) {
  if (typeof character === 'function') {
    return character(displayValue, value)
  } else if (character) {
    return character
  }

  let svgIcon: any

  if (value <= displayValue) {
    // 渲染整个星星
    svgIcon = <Icons.StarActive />
  } else if (allowHalf && value === displayValue + 0.5) {
    // 渲染半个星星（底层和覆盖层）
    if (index === 1) {
      svgIcon = disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
    } else {
      svgIcon = <Icons.StarActive />
    }
  } else {
    // 渲染空星星
    svgIcon = disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
  }

  return <i className={className}>{svgIcon}</i>
}

interface StarIconProps {
  className?: string
  index: 0 | 1
  value: number
  displayValue: number
  disabled: boolean
  allowHalf: boolean
  character: React.ReactNode | ((value: number, index: number) => React.ReactNode)
}

const formatRangeValue = (val: number, min: number, max: number) => {
  if (val < min) {
    val = min
  } else if (val > max) {
    val = max
  }
  return val
}
