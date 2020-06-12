import React, { useState } from 'react'
import classnames from 'classnames'
import * as Icons from './Icons'
import ToolTip from '../tooltip'

const Rate = ({ value: trueVal, disabled, useEmoji, allowHalf, character, renderCharacter, defaultValue, className, style, count, prefixCls,
  tooltips,
  color,
  vertical,
  showDesc, desc, onChange, clearable }) => {
  const [value, setValue] = useState(trueVal === undefined ? defaultValue : trueVal)
  const [hoverValue, setHoverValue] = useState(0)

  const handleIconLeave = () => {
    if (disabled) {
      return
    }
    setHoverValue(0)
  }

  const handleIconEnter = (hoverValue) => {
    if (disabled) {
      return
    }

    setHoverValue(hoverValue)
  }

  const handleIconClick = (valueIndex) => {
    if (disabled) {
      return
    }
    if (!allowHalf) {
      valueIndex = Math.ceil(valueIndex)
    }
    if (valueIndex === value && clearable) {
      onChange && onChange({ value: 0 })
      setValue(0)
      return
    }
    onChange && onChange(valueIndex)
    setValue(valueIndex)
  }

  const renderIcon = (idx) => {
    let currentValue = hoverValue || value
    if (!allowHalf) {
      currentValue = Math.ceil(currentValue)
    }

    return (
      <Icon {...{ value: idx, currentValue, disabled, useEmoji, allowHalf, character, style, renderCharacter }} />
    )
  }

  let currentValue = hoverValue || value
  const iconCount = Math.ceil(useEmoji ? 5 : count)
  const iconHalfCls = `${prefixCls}__star__half`
  const starCls = classnames(`${prefixCls}__star`, {
    [`${prefixCls}__star--disabled`]: disabled
  })
  // if (showDesc && !desc.length) {
  //   desc = Array(count).fill().map((item, index) => `${index + 1}分`)
  // }
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
    {
      (showDesc && desc.length > 0) && <span className={descCls}>{hoverValue ? desc[Math.ceil(hoverValue) - 1] : desc[Math.ceil(value) - 1]}</span>
    }
    {
      (showDesc && desc.length === 0) && <span className={descCls} style={{color: '#EB5252'}}>{currentValue}分</span>
    }
  </div >
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

function Icon ({ value, currentValue, disabled, useEmoji, allowHalf, character, renderCharacter }) {
  if (renderCharacter) {
    return renderCharacter(currentValue, value)
  }
  if (character) {
    return character
  }
  if (useEmoji) {
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
    return disabled ? <Icons.StarHalfReadonly /> : <Icons.StarHalfActive />
  } else {
    return disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
  }
}
export default Rate
