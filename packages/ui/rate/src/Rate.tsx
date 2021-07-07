import React, { forwardRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
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
      readonly,
      count = 5,
      value: valueProp,
      defaultValue = 0,
      onChange,
      allowHalf = true,
      character,
      renderCharacter,
      halfPlacement = 'horizontal',
      descRender,
      clearable = false,
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

    const handleIconClick = (nextValue: number) => {
      if (isNonInteractive) return

      if (!allowHalf) {
        nextValue = Math.ceil(nextValue)
      }

      const shouldClear = clearable && nextValue === value

      if (shouldClear) {
        nextValue = 0
      }

      tryChangeValue(nextValue)
    }

    const handleIconLeave = (e: React.MouseEvent<HTMLUListElement>) => {
      if (isNonInteractive) return

      setHoverValue(value)
      onMouseLeave?.(e)
    }

    const handleIconEnter = (hoverValue: number) => {
      if (isNonInteractive) return
      setHoverValue(hoverValue)
    }

    const cls = cx(
      prefixCls,
      className,
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

    const countArray = useMemo(() => Array(count).fill(undefined), [count])
    console.log(value)

    return (
      <ul ref={ref} role={role} className={cls} onMouseLeave={handleIconLeave} {...rest}>
        {countArray.map((_, idx) => {
          const indexValue = idx + 1
          const halfIndexValue = allowHalf ? idx + 0.5 : indexValue

          return (
            <li className={starCls} key={idx}>
              {/* HalfStar1 */}
              <div
                className={cx(halfStarCls, `${halfStarCls}--${isVertical ? 'bottom' : 'left'}`, {
                  grayscale: halfIndexValue > displayValue,
                })}
                onMouseEnter={() => {
                  handleIconEnter(halfIndexValue)
                }}
                onClick={() => handleIconClick(halfIndexValue)}
              >
                <StarIcon
                  isVertical
                  className={`${prefixCls}__icon`}
                  value={indexValue}
                  index={0}
                  {...{
                    displayValue,
                    disabled: isNonInteractive,
                    allowHalf,
                    character,
                    renderCharacter,
                    readonly,
                  }}
                />
              </div>
              {/* HalfStar2 */}
              <div
                className={cx(halfStarCls, `${halfStarCls}--${isVertical ? 'top' : 'right'}`, {
                  grayscale: indexValue > displayValue,
                })}
                onMouseEnter={() => {
                  handleIconEnter(indexValue)
                }}
                onClick={() => handleIconClick(indexValue)}
              >
                <StarIcon
                  className={`${prefixCls}__icon`}
                  value={indexValue}
                  index={1}
                  {...{
                    displayValue,
                    disabled: isNonInteractive,
                    allowHalf,
                    character,
                    renderCharacter,
                    readonly,
                  }}
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
  disabled?: boolean
  readonly?: boolean
  count?: number
  value?: number
  defaultValue?: number
  onChange?: any
  useEmoji?: boolean
  allowHalf?: boolean
  character?: React.ReactNode
  renderCharacter?: React.ReactNode
  halfPlacement?: 'vertical' | 'horizontal'
  descRender?: any
  clearable?: boolean
  onMouseLeave?: (e: React.MouseEvent<HTMLUListElement>) => void
}

if (__DEV__) {
  Rate.displayName = 'Rate'
}

function StarIcon({
  isVertical,
  index,
  value,
  displayValue,
  disabled,
  allowHalf,
  character,
  renderCharacter,
  readonly,
  ...rest
}) {
  let svgIcon: any
  // svgIcon = <Icons.StarActive />
  // svgIcon = <Icons.StarDefault />
  // svgIcon = <Icons.StarDisable />

  if (value <= displayValue) {
    // 渲染整个星星
    svgIcon = <Icons.StarActive />
  } else if (allowHalf && value === displayValue + 0.5) {
    // 渲染半个星星（底层和覆盖层）
    // const first = <Icons.StarActive />
    // const second = disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
    // if (isVertical) {
    //   svgIcon = index === 1 ? second : first
    // } else {
    //   svgIcon = index === 1 ? second : first
    // }
    if (index === 1) {
      svgIcon = disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
    } else {
      svgIcon = <Icons.StarActive />
    }
  } else {
    // 渲染空星星
    svgIcon = disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
  }

  return <i {...rest}>{svgIcon}</i>
}
