import React, { useState, useEffect, forwardRef } from 'react'
import classNames from 'classnames'
import './style'
import Icon from '../icon'
import { CSSTransition } from 'react-transition-group'

const noop = () => {}
const InternalTagItem = ({
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
  shape = 'round',
  innerRef,
  transition
}) => {
  const [vi, setVi] = useState(false)
  useEffect(() => {
    setVi(transition)
  }, [transition])
  const tagStyle = color
    ? {
        background: appearance === 'default' ? color : '',
        borderColor: color,
        color: appearance === 'line' ? color : ''
      }
    : {}
  return (
    <CSSTransition in={vi} timeout={300} classNames={'tag-transition'}>
      <span
        className={classNames('hi-tag', {
          [`hi-tag--${type}`]: type,
          'hi-tag--line': appearance === 'line',
          'hi-tag--square': shape === 'square'
        })}
        ref={innerRef}
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
          <button className="hi-tag__btn" type="button">
            <Icon
              name="close"
              onClick={(e) => {
                handleClose(id)
              }}
            />
          </button>
        )}
      </span>
    </CSSTransition>
  )
}

const TagItem = forwardRef((props, ref) => {
  return <InternalTagItem {...props} innerRef={ref} />
})
export default TagItem
