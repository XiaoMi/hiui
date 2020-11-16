import React, { useCallback } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import _ from 'lodash'

const Panel = ({
  key,
  arrow,
  header,
  disabled = false,
  isActive,
  children,
  onClickPanel,
  showArrow,
  panels,
  panelContainer,
  idx: panelIndex
}) => {
  const _panels = React.Children.toArray(panels)
  const classnames = classNames('collapse-item', {
    'collapse-item--show': isActive,
    'collapse-item--disabled': disabled
  })
  const onKeyDown = useCallback(
    (e) => {
      if ([13, 32].includes(e.keyCode)) {
        e.preventDefault()
        onClickPanel(key)
      }

      // home: 36 end: 35
      if (e.keyCode === 36) {
        e.preventDefault()
        const idx = _.findIndex(_panels, (p) => {
          return !p.props.disabled
        })
        panelContainer.current && panelContainer.current.querySelectorAll('.collapse-item__head')[idx].focus()
      }
      if (e.keyCode === 35) {
        e.preventDefault()
        const idx = _.findLastIndex(_panels, (p) => {
          return !p.props.disabled
        })
        panelContainer.current && panelContainer.current.querySelectorAll('.collapse-item__head')[idx].focus()
      }
      // 方向键
      if ([38, 40].includes(e.keyCode)) {
        e.preventDefault()
        const prevArr = []
        const nextArr = []
        _panels.forEach((p, idx) => {
          if (!p.props.disabled) {
            if (idx < panelIndex) {
              prevArr.push(idx)
            }
            if (idx > panelIndex) {
              nextArr.push(idx)
            }
          }
        })

        let prev
        let next
        if (prevArr.length > 0) {
          prev = prevArr[prevArr.length - 1]
        } else if (prevArr.length === 0 && nextArr.length > 0) {
          prev = nextArr[nextArr.length - 1]
        }
        if (nextArr.length > 0) {
          next = nextArr[0]
        } else if (nextArr.length === 0 && prevArr.length > 0) {
          next = prevArr[0]
        }
        if (e.keyCode === 38 && prev !== undefined) {
          panelContainer.current && panelContainer.current.querySelectorAll('.collapse-item__head')[prev].focus()
        }
        if (e.keyCode === 40 && next !== undefined) {
          panelContainer.current && panelContainer.current.querySelectorAll('.collapse-item__head')[next].focus()
        }
      }
    },
    [panels, panelContainer, panelIndex]
  )
  return (
    <div className={classnames}>
      <div
        className="collapse-item__head"
        onClick={() => onClickPanel(key)}
        tabIndex={disabled ? -1 : 0}
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
