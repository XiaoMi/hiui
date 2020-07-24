import React, { useState } from 'react'
import classnames from 'classnames'
import * as Icons from './Icons'
import ToolTip from '../tooltip'

const Rate = ({ value: trueVal, disabled, useEmoji, allowHalf, character, renderCharacter, defaultValue, className, style, count, prefixCls, tooltips, color, vertical, onChange, clearable, descRender, readOnly }) => {
  const [value, setValue] = useState(trueVal === undefined ? defaultValue : trueVal)
  const [hoverValue, setHoverValue] = useState(0)

  const handleIconLeave = () => {
    if (disabled) {
      return
    }
    setHoverValue(0)
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
      <Icon {...{ value: idx, currentValue, disabled, useEmoji, allowHalf, character, style, renderCharacter, readOnly }} />
    )
  }

  let currentValue = hoverValue || value
  const iconCount = Math.ceil(useEmoji ? 5 : count)
  const iconHalfCls = `${prefixCls}__star__half`
  const starCls = classnames(`${prefixCls}__star`, {
    [`${prefixCls}__star--disabled`]: disabled,
    [`${prefixCls}__star--readOnly`]: readOnly
  })

  const descCls = classnames(`${prefixCls}__desc`)

  return <div className='hi-rate__outter'>
    <ul
      className={classnames(prefixCls, className)}
      style={{ ...style, color }}
      onMouseLeave={handleIconLeave}
    >
      {Array(iconCount)
        .fill()
        .map((_, idx) => {
          const indexValue = idx + 1
          const halfValue = allowHalf ? idx + 0.5 : indexValue
          return (
            <ToolTipWrapper title={tooltips[idx]} key={idx}>
              <li className={starCls}>
                <div
                  className={classnames(iconHalfCls, `${iconHalfCls}--${vertical ? 'top' : 'left'}`, {
                    'grayscale': vertical ? indexValue > currentValue : currentValue < halfValue
                  })}
                  onMouseEnter={() => handleIconEnter(vertical ? indexValue : halfValue)}
                  onMouseMove={() => handleIconEnter(vertical ? indexValue : halfValue)}
                  onClick={() => handleIconClick(vertical ? indexValue : halfValue)}
                >
                  {renderIcon(indexValue)}
                </div>

                <div
                  className={classnames(iconHalfCls, `${iconHalfCls}--${vertical ? 'bottom' : 'right'}`, {
                    'grayscale': vertical ? currentValue < halfValue : indexValue > currentValue
                  })}
                  onMouseEnter={() => handleIconEnter(vertical ? halfValue : indexValue)}
                  onMouseMove={() => handleIconEnter(vertical ? halfValue : indexValue)}
                  onClick={() => handleIconClick(vertical ? halfValue : indexValue)}
                >
                  {renderIcon(indexValue)}
                </div>

              </li>
            </ToolTipWrapper>
          )
        })}
    </ul>
    {descRender && <span className={descCls}>{descRender(hoverValue || value)}</span>}
  </div>
}

Rate.defaultProps = {
  clearable: true,
  defaultValue: 0,
  count: 5,
  prefixCls: 'hi-rate',
  tooltips: [],
  desc: [],
  onChange: () => { },
  style: {
    fontSize: 24
  },
  color: '#FFCA28',
  vertical: false
}

function ToolTipWrapper ({ children, title }) {
  return title ? <ToolTip title={title}>{children}</ToolTip> : children
}

function Icon ({ value, currentValue, disabled, useEmoji, allowHalf, character, renderCharacter, readOnly }) {
  if (renderCharacter) {
    return renderCharacter(currentValue, value)
  }
  if (character) {
    return character
  }
  if (useEmoji) {
    if (currentValue > 5) {
      currentValue = 5
    }
    const Emojis = [
      Icons.EmojiOne,
      Icons.EmojiTwo,
      Icons.EmojiThree,
      Icons.EmojiFour,
      Icons.EmojiFive
    ]
    if (value <= currentValue) {
      return React.createElement(Emojis[currentValue - 1])
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
export default Rate
