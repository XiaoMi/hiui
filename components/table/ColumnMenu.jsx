import React, { useRef, useContext, useState } from 'react'
import Icon from '../icon'
import Popper from '../popper'
import TableContext from './context'
import classNames from 'classnames'
import useClickOutside from './hooks/useClickOutside'

const ColumnMenu = ({ columnKey, canSort, isSticky }) => {
  const menuRef = useRef(null)
  const popperMenu = useRef(null)
  useClickOutside(popperMenu, () => setShowPopper(false), menuRef)
  const {
    activeSorterColumn,
    setActiveSorterColumn,
    activeSorterType,
    setActiveSorterType,
    highlightColumns,
    setHighlightColumns,
    freezeColumn,
    setFreezeColumn,
    prefix,
    ceiling,
    theme
  } = useContext(TableContext)
  const [showPopper, setShowPopper] = useState(false)
  const _showPopper = ceiling ? isSticky && showPopper : showPopper

  return (
    <span
      ref={menuRef}
      onClick={() => {
        setShowPopper(!showPopper)
      }}
    >
      <Icon name="down" style={{ marginLeft: 4, cursor: 'pointer' }} />
      <Popper show={_showPopper} attachEle={menuRef.current} zIndex={1040} setOverlayContainer={() => document.body}>
        <div className={[`${prefix}__col-menu theme__${theme}`]} ref={popperMenu}>
          {canSort && (
            <div
              className={classNames(`${prefix}__col-menu__item`, {
                'col-menu__item--highlight': activeSorterType === 'ascend' && activeSorterColumn === columnKey
              })}
              onClick={(e) => {
                if (activeSorterType === 'ascend' && activeSorterColumn === columnKey) {
                  setActiveSorterType(null)
                  setActiveSorterColumn(null)
                } else {
                  setActiveSorterType('ascend')
                  setActiveSorterColumn(columnKey)
                }
                setShowPopper(false)
              }}
            >
              升序
              <Icon name="asc" />
            </div>
          )}
          {canSort && (
            <div
              className={classNames(`${prefix}__col-menu__item`, {
                'col-menu__item--highlight': activeSorterType === 'descend' && activeSorterColumn === columnKey
              })}
              onClick={(e) => {
                if (activeSorterType === 'descend' && activeSorterColumn === columnKey) {
                  setActiveSorterType(null)
                  setActiveSorterColumn(null)
                } else {
                  setActiveSorterType('descend')
                  setActiveSorterColumn(columnKey)
                }
                setShowPopper(false)
              }}
            >
              降序
              <Icon name="desc" />
            </div>
          )}
          <div
            className={classNames(`${prefix}__col-menu__item`, {
              'col-menu__item--highlight': highlightColumns.includes(columnKey)
            })}
            onClick={(e) => {
              if (highlightColumns.includes(columnKey)) {
                setHighlightColumns(highlightColumns.filter((c) => c !== columnKey))
              } else {
                setHighlightColumns(highlightColumns.concat(columnKey))
              }
              setShowPopper(false)
            }}
          >
            高亮
            <Icon name="mark" />
          </div>

          <div
            className={classNames(`${prefix}__col-menu__item`, {
              'col-menu__item--highlight': freezeColumn === columnKey
            })}
            onClick={(e) => {
              if (freezeColumn === columnKey) {
                setFreezeColumn(null)
              } else {
                setFreezeColumn(columnKey)
              }
              setShowPopper(false)
            }}
          >
            冻结
            <Icon name="lock" />
          </div>
        </div>
      </Popper>
    </span>
  )
}

export default ColumnMenu
