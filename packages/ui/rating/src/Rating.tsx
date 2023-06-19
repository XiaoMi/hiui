import React, { forwardRef, useState, useMemo, useRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import * as Icons from './icons'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import Tooltip from '@hi-ui/tooltip'
import { useDidMount } from '@hi-ui/use-did-mount'

const _role = 'rating'
const _prefix = getPrefixCls(_role)

/**
 * 评分
 */
export const Rating = forwardRef<HTMLUListElement | null, RatingProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
      disabled = false,
      readOnly = false,
      count = 5,
      value: valueProp,
      defaultValue = 0,
      onChange,
      allowHalf: allowHalfProp = false,
      character,
      useEmoji = false,
      halfPlacement = 'horizontal',
      characterRender,
      descRender,
      clearable = true,
      tooltips = [],
      color,
      onHover,
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
    const allowHalf = useEmoji ? false : allowHalfProp

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    // 使用 value 作为初始值，自动聚焦时可依据此值作为起始
    const [hoverValue, setHoverValue] = useState(value)

    const stepOrMinHoverValue = allowHalf ? 0.5 : 1

    const isHover = hoverValue > 0
    // hover 将展示对应的 ⭐️ 个数，对于展示层，hoverValue 优先级大于用户设置的 value
    const displayValue = isHover ? hoverValue : value

    const isNonInteractive = disabled || readOnly

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

      nextHoverValue = formatRangeValue(nextHoverValue, stepOrMinHoverValue, count)
      if (nextHoverValue !== hoverValue) {
        setHoverValue(nextHoverValue)
        onHover?.(nextHoverValue)
      }
    }

    const handleIconLeave = (evt: React.MouseEvent<HTMLUListElement>) => {
      if (isNonInteractive) return

      // 当鼠标移出时，设为原值
      setHoverValue(value)
      onMouseLeave?.(evt)
    }

    const ratingRef = useRef<HTMLUListElement>(null)
    const [focus, setFocus] = useState(false)

    const focusRating = useCallback(() => {
      if (!disabled) {
        ratingRef.current?.focus()
      }
    }, [disabled])

    useDidMount(() => {
      if (autoFocus) {
        focusRating()
      }
    })

    const handleFocus = useCallback(
      (evt: React.FocusEvent<HTMLUListElement>) => {
        if (disabled) return

        setFocus(true)
        onFocus?.(evt)
      },
      [disabled, onFocus]
    )

    const handleBlur = useCallback(
      (evt: React.FocusEvent<HTMLUListElement>) => {
        if (disabled) return

        setFocus(false)
        onBlur?.(evt)
      },
      [disabled, onBlur]
    )

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLUListElement>) => {
      if (disabled) return

      evt.stopPropagation()

      // right asc
      if (evt.keyCode === 39) {
        evt.preventDefault()
        const nextValue = hoverValue + stepOrMinHoverValue
        // 这里对快捷键构成循环式星星，当超出最大值时，继续增加评分，则变为 最小评分
        proxyTryChangeHoverValue(nextValue > count ? stepOrMinHoverValue : nextValue)
      }

      // left desc
      if (evt.keyCode === 37) {
        evt.preventDefault()
        const nextValue = hoverValue - stepOrMinHoverValue
        // 这里对快捷键构成循环式星星，当超出最小值时，继续减小评分，则变为 最大评分
        proxyTryChangeHoverValue(nextValue < stepOrMinHoverValue ? count : nextValue)
      }

      // enter confirm
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
      readOnly && `${prefixCls}--readonly`
    )
    const starCls = `${prefixCls}__star`
    const halfStarCls = `${prefixCls}__star__half`
    const starIconCls = `${prefixCls}__icon`

    const isVertical = halfPlacement === 'vertical'

    const rootStyle = useMemo(() => ({ ...style, color, fill: color }), [style, color])

    const stars = useMemo(() => Array(count).fill(undefined), [count])

    // TODO: 如何在不耦合 tooltip 的情况下对每个 ⭐️ 可以有单独的 tooltip 功能？
    // 可以把⭐️拆原子组件，给用户灵活组合（本质类似 radioGroup 和 radio）
    return (
      <>
        <ul
          ref={useMergeRefs(ref, ratingRef)}
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
          {stars.map((_, idx) => {
            // 满星值
            const indexValue = idx + 1
            // 半星值
            const halfIndexValue = allowHalf ? idx + 0.5 : indexValue

            return (
              <li className={starCls} key={indexValue}>
                <ToolTipWrapper title={tooltips[idx]}>
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
                      className={starIconCls}
                      disabled={isNonInteractive}
                      displayValue={displayValue}
                      allowHalf={allowHalf}
                      character={character}
                      useEmoji={useEmoji}
                      characterRender={characterRender}
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
                      className={starIconCls}
                      disabled={isNonInteractive}
                      displayValue={displayValue}
                      allowHalf={allowHalf}
                      character={character}
                      useEmoji={useEmoji}
                      characterRender={characterRender}
                    />
                  </div>
                </ToolTipWrapper>
              </li>
            )
          })}
        </ul>
        {descRender ? <div className={`${prefixCls}__desc`}>{descRender(displayValue)}</div> : null}
      </>
    )
  }
)

export interface RatingProps extends HiBaseHTMLFieldProps<'ul'> {
  /**
   * 禁用，无法进行交互,鼠标禁用交互效果
   */
  disabled?: boolean
  /**
   * 只读，无法进行交互
   */
  readOnly?: boolean
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
  /**
   * 悬停反馈，当用户的鼠标悬停在评分组件上时，可以获取对应的分值
   */
  onHover?: (value: number) => void
  /**
   * 是否自动获取焦点
   */
  autoFocus?: boolean
  /**
   * 自定义每项的提示信息
   */
  tooltips?: React.ReactNode[]
  /**
   * 是否使用表情
   */
  useEmoji?: boolean
  /**
   * 自定义渲染 character 函数
   */
  characterRender?: (value: number, index: number) => React.ReactNode
  /**
   * 自定义辅助文字函数
   */
  descRender?: (value: number) => React.ReactNode
}

if (__DEV__) {
  Rating.displayName = 'Rating'
}

function StarIcon({
  className,
  index,
  value,
  displayValue,
  disabled,
  allowHalf,
  character,
  useEmoji,
  characterRender,
}: StarIconProps) {
  if (typeof characterRender === 'function') {
    return characterRender(displayValue, value)
  }

  if (typeof character === 'function') {
    return character(displayValue, value)
  } else if (character) {
    return character
  }

  let svgIcon: any

  if (useEmoji) {
    const emojiValue = displayValue > 5 ? 5 : displayValue
    const Emojis = [
      Icons.EmojiOne,
      Icons.EmojiTwo,
      Icons.EmojiThree,
      Icons.EmojiFour,
      Icons.EmojiFive,
    ]
    if (value <= emojiValue) {
      svgIcon = React.createElement(Emojis[emojiValue - 1])
    } else {
      svgIcon = <Icons.EmojiDefault />
    }

    return <i className={className}>{svgIcon}</i>
  }

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
  useEmoji?: boolean
  characterRender?: (value: number, index: number) => React.ReactNode
}

const formatRangeValue = (val: number, min: number, max: number) => {
  if (val < min) {
    val = min
  } else if (val > max) {
    val = max
  }
  return val
}

function ToolTipWrapper({ children, title }: any) {
  return title ? (
    <Tooltip title={title}>
      <div>{children}</div>
    </Tooltip>
  ) : (
    children
  )
}
