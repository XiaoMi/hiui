import React, { useState, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import * as Icons from './Icons'
import ToolTip from '../tooltip'

const Rate = (props) => {
  const {
    value: trueVal,
    disabled,
    useEmoji,
    allowHalf,
    character,
    renderCharacter,
    defaultValue,
    className,
    style,
    count: propCount,
    prefixCls,
    tooltips,
    color,
    vertical,
    onChange,
    descRender,
    readOnly
  } = props
  const clearable = props.clearable || props.allowClear // 兼容API 2.x 改为clearable
  const [value, setValue] = useState(trueVal === undefined ? defaultValue : trueVal)
  const [countArray, setCountArray] = useState(Array(useEmoji ? 5 : propCount).fill())
  const [hoverValue, setHoverValue] = useState(0)
  useEffect(() => {
    const iconCount = Math.ceil(useEmoji ? 5 : propCount)
    setCountArray(Array(iconCount).fill())
  }, [propCount, useEmoji])
  useEffect(() => {
    if (trueVal !== undefined) {
      setValue(trueVal)
    }
  }, [trueVal])

  const handleIconLeave = () => {
    if (disabled) {
      return
    }
    setHoverValue(value)
  }

  const handleIconEnter = (hoverValue) => {
    if (disabled || readOnly) {
      return
    }

    setHoverValue(hoverValue)
  }

  const handleIconClick = (valueIndex) => {
    if (disabled || readOnly) {
      return
    }
    if (!allowHalf) {
      valueIndex = Math.ceil(valueIndex)
    }
    if (valueIndex === value && clearable) {
      onChange && onChange(0)
      if (trueVal === undefined) {
        setValue(0)
      }
      return
    }

    if (trueVal === undefined) {
      setValue(valueIndex)
    }
    onChange && onChange(valueIndex)
  }

  const renderIcon = (idx) => {
    let currentValue = hoverValue || value
    if (!allowHalf) {
      currentValue = Math.ceil(currentValue)
    }
    return (
      <Icon
        {...{
          value: idx,
          currentValue,
          disabled,
          useEmoji,
          allowHalf,
          character,
          style,
          renderCharacter,
          readOnly
        }}
      />
    )
  }
  const handleKeyDown = useCallback(
    (evt) => {
      evt.stopPropagation()
      // right
      if (evt.keyCode === 39) {
        evt.preventDefault()
        const len = countArray.length
        const step = allowHalf ? 0.5 : 1
        handleIconEnter(hoverValue === len ? len : hoverValue + step)
      }
      // left
      if (evt.keyCode === 37) {
        evt.preventDefault()
        const step = allowHalf ? 0.5 : 1
        handleIconEnter(hoverValue <= 1 ? 1 : hoverValue - step)
      }
      // enter
      if (evt.keyCode === 13) {
        evt.preventDefault()
        handleIconClick(hoverValue)
      }
    },
    [hoverValue, countArray, handleIconClick, handleIconEnter]
  )
  const currentValue = hoverValue || value
  const iconHalfCls = `${prefixCls}__star__half`
  const starCls = classnames(`${prefixCls}__star`, {
    [`${prefixCls}__star--disabled`]: disabled,
    [`${prefixCls}__star--readOnly`]: readOnly
  })

  const descCls = classnames(`${prefixCls}__desc`)
  const isCustom = renderCharacter || character
  return (
    <div className="hi-rate__outter">
      {!isCustom && (
        <ul className={classnames(prefixCls, className)} style={{ ...style, color }}>
          {countArray.map((_, idx) => {
            const indexValue = idx + 1
            const halfValue = allowHalf ? idx + 0.5 : indexValue
            return (
              <li className={starCls} key={idx}>
                <div
                  className={classnames(iconHalfCls, `${iconHalfCls}--${vertical ? 'top' : 'left'}`, {
                    grayscale: vertical ? indexValue > currentValue : currentValue < halfValue
                  })}
                >
                  {renderIcon(indexValue)}
                </div>

                <div
                  className={classnames(iconHalfCls, `${iconHalfCls}--${vertical ? 'bottom' : 'right'}`, {
                    grayscale: vertical ? currentValue < halfValue : indexValue > currentValue
                  })}
                >
                  {renderIcon(indexValue)}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <ul
        className={classnames(prefixCls, className, { [`${prefixCls}_mask`]: !isCustom })}
        style={{ ...style, color }}
        onMouseLeave={handleIconLeave}
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onBlur={handleIconLeave}
      >
        {countArray.map((_, idx) => {
          const indexValue = idx + 1
          const halfValue = allowHalf ? idx + 0.5 : indexValue
          return (
            <li className={starCls} key={idx}>
              <ToolTipWrapper title={tooltips[idx]}>
                <div
                  className={classnames(iconHalfCls, `${iconHalfCls}--${vertical ? 'top' : 'left'}`, {
                    grayscale: vertical ? indexValue > currentValue : currentValue < halfValue
                  })}
                  onMouseEnter={() => {
                    handleIconEnter(vertical ? indexValue : halfValue)
                  }}
                  onClick={() => handleIconClick(vertical ? indexValue : halfValue)}
                >
                  {isCustom ? renderIcon(indexValue) : MaskIcon(indexValue)}
                </div>

                <div
                  className={classnames(iconHalfCls, `${iconHalfCls}--${vertical ? 'bottom' : 'right'}`, {
                    grayscale: vertical ? currentValue < halfValue : indexValue > currentValue
                  })}
                  onMouseEnter={() => {
                    handleIconEnter(vertical ? halfValue : indexValue)
                  }}
                  onClick={() => handleIconClick(vertical ? halfValue : indexValue)}
                >
                  {isCustom ? renderIcon(indexValue) : MaskIcon(indexValue)}
                </div>
              </ToolTipWrapper>
            </li>
          )
        })}
      </ul>
      {descRender && <span className={descCls}>{descRender(hoverValue || value)}</span>}
    </div>
  )
}

Rate.defaultProps = {
  clearable: true,
  defaultValue: 0,
  count: 5,
  prefixCls: 'hi-rate',
  tooltips: [],
  desc: [],
  onChange: () => {},
  style: {
    fontSize: 24
  },
  color: '#FFCA28',
  vertical: false
}

function ToolTipWrapper({ children, title }) {
  return title ? <ToolTip title={title}>{children}</ToolTip> : children
}

function Icon({ value, currentValue, disabled, useEmoji, allowHalf, character, renderCharacter, readOnly }) {
  if (renderCharacter) {
    return renderCharacter(currentValue, value)
  }
  if (character) {
    return character
  }
  if (useEmoji) {
    const emojiValue = currentValue > 5 ? 5 : currentValue
    const Emojis = [Icons.EmojiOne, Icons.EmojiTwo, Icons.EmojiThree, Icons.EmojiFour, Icons.EmojiFive]
    if (value <= emojiValue) {
      return React.createElement(Emojis[emojiValue - 1])
    } else {
      return <Icons.EmojiDefault />
    }
  }

  if (value <= currentValue) {
    return <Icons.StarActive />
  } else if (value === currentValue + 0.5 && allowHalf) {
    return disabled || readOnly ? <Icons.StarHalfReadonly /> : <Icons.StarHalfActive />
  } else {
    return disabled || readOnly ? <Icons.StarDisable /> : <Icons.StarDefault />
  }
}
function MaskIcon({ value, currentValue, useEmoji, character, renderCharacter }) {
  if (renderCharacter) {
    return renderCharacter(currentValue, value)
  }
  if (character) {
    return character
  }
  if (useEmoji) {
    return <Icons.EmojiDefault />
  }
  return <Icons.StarActive />
}
export default Rate
