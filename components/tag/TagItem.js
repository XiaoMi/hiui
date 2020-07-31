import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import './style'
import Icon from '../icon'
import { CSSTransition } from 'react-transition-group'

const noop = () => {}
const TagItem = ({
  type = 'primary',
  appearance = 'default',
  onClick,
  children,
  color,
  closable = false,
  editable,
  handleClose = noop,
  onDoubleClick = noop,
  style = {},
  id,
  isLongTag = false,
  onMouseEnter = noop,
  onMouseLeave = noop,
  hoverIndex = -1,
  shape = 'round'
}) => {
  const [vi, setVi] = useState(false)
  useEffect(() => {
    setVi(true)
  }, [])
  const tagStyle = color
    ? {
      background: appearance === 'default' ? color : '',
      borderColor: appearance === 'line' ? color : '',
      color: appearance === 'line' ? color : ''
    }
    : {}
  return (
    <CSSTransition
      in={vi}
      timeout={300}
      classNames={'tag-transition'}
      onExited={() => {
        setTimeout(() => handleClose(id), 300)
      }}
    >
      <span
        className={classNames('hi-tag', {
          [`hi-tag--${type}`]: type,
          'hi-tag--line': appearance === 'line',
          'hi-tag--square': shape === 'square'
        })}
        onClick={onClick}
        style={{ ...style, ...tagStyle }}
        onDoubleClick={() => {
          if (editable) {
            onDoubleClick(id, children)
          }
        }}
        onMouseEnter={() => {
          onMouseEnter(id)
        }}
        onMouseLeave={onMouseLeave}
      >
        {isLongTag ? children.slice(0, 20) + '...' : children}
        {closable && (
          <button className='hi-tag__btn' type='button'>
            <Icon
              name='close'
              onClick={(e) => {
                setVi(false)
              }}
            />
          </button>
        )}
      </span>
    </CSSTransition>
  )
}

export default TagItem
