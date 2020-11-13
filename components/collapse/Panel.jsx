import React, { useCallback } from 'react'
import classNames from 'classnames'
import Icon from '../icon'

const Panel = ({ key, arrow, header, disabled = false, isActive, children, onClickPanel, showArrow }) => {
  const classnames = classNames('collapse-item', {
    'collapse-item--show': isActive,
    'collapse-item--disabled': disabled
  })
  const onKeyDown = useCallback((e) => {
    if ([13, 32].includes(e.keyCode)) {
      e.preventDefault()
      onClickPanel(key)
    }
    // // home: 36 end: 35
    // if (e.keyCode === 36) {
    // }
    // if (e.keyCode === 35) {
    // }
    // 方向键
    // if ([37, 38, 39, 40].includes(e.keyCode)) {
    // }
  }, [])
  return (
    <div className={classnames}>
      <div
        className="collapse-item__head"
        onClick={() => onClickPanel(key)}
        tabIndex={!disabled && 0}
        onKeyDown={onKeyDown}
      >
        {showArrow && arrow === 'left' && <Icon name="down" className="collapse-item__icon" />}
        <div className="collapse-item__title">{header}</div>
        {showArrow && arrow === 'right' && <Icon name="down" className="collapse-item__icon" />}
      </div>
      <div className="collapse-item__content">{children}</div>
    </div>
  )
}

export default Panel
