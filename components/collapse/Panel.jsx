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
        const enablePanels = _panels.filter((p) => !p.props.disabled)
        const prevArr = []
        const nextArr = []
        enablePanels.forEach((p, idx) => {
          if (idx < panelIndex) {
            prevArr.push(idx)
          }
          if (idx > panelIndex) {
            nextArr.push(idx)
          }
        })
      }
    },
    [panels, panelContainer]
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
