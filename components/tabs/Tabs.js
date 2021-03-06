import React, { useCallback, cloneElement, useState, useEffect, useLayoutEffect, useRef } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
import ItemDropdown from './ItemDropdown'
import TabItem from './TabItem'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Provider from '../context'
import useTabItems from './hooks/useTabItems'
import useTranslate from './hooks/useTranslate'
const noop = () => {}

const Tabs = ({
  onDrop,
  onAdd,
  onDropEnd,
  onDragStart,
  defaultActiveId,
  activeId: activeIdProps,
  children,
  type,
  placement,
  max,
  canScroll,
  onDelete,
  editable,
  className,
  theme,
  localeDatas,
  prefixCls,
  draggable,
  onTabClick,
  onBeforeDelete
}) => {
  const containRef = useRef(null)
  const hiddenRef = useRef(null)
  const dropdownRef = useRef(null)
  const { leftBtn, rightBtn } = useTranslate({ elementRef: containRef, canScroll, prefixCls })
  const { showTabItems, hiddenTabItems, setShowTabItems } = useTabItems({ children, max, type, placement, canScroll })
  const [focusIndex, setFocusIndex] = useState(null)
  const [activeId, setActiveId] = useState(
    activeIdProps !== undefined
      ? activeIdProps
      : defaultActiveId || (showTabItems && showTabItems[0] && showTabItems[0].tabId)
  )
  const [dragged, setDragged] = useState()
  const [over, setOver] = useState()
  const [deletetabId, setDeletetabId] = useState()
  const [checkEditable, setCheckEditable] = useState(editable && type === 'editable')

  const latestActiveId = useRef(activeId)

  const inkRef = useRef()
  const childRef = useRef()

  useEffect(() => {
    setCheckEditable(editable && type === 'editable')
  }, [editable, type])

  useEffect(() => {
    if (deletetabId && latestActiveId.current === activeId) {
      setActiveId(children[0] && children[0].props.tabId)
    }
  }, [deletetabId])

  useEffect(() => {
    if (activeIdProps !== undefined) {
      setActiveId(activeIdProps)
    }
  }, [activeIdProps])

  useLayoutEffect(() => {
    const index = showTabItems.findIndex((item) => item.tabId === activeId)
    const hideIndex = hiddenTabItems.findIndex((item) => item.tabId === activeId)
    latestActiveId.current = index
    if (index === -1 && hideIndex === -1 && showTabItems.length > 0) {
      setActiveId(showTabItems[0].tabId)
    }
    if (type === 'line') {
      if (index !== -1) {
        handleRenderActiveLine(index)
      } else {
        if (hideIndex !== -1) {
          handleRenderActiveLine(max)
        }
      }
    }
  }, [activeId, showTabItems, type])

  // 过滤自定义属性
  const omitItem = useCallback((data) => {
    return _.omit(data, ['animation', 'disabled', 'tabDesc'])
  }, [])

  useEffect(() => {
    if (canScroll && children.length > childRef.current) {
      const contain = containRef.current
      setTimeout(() => {
        contain.scrollLeft = contain.scrollWidth - contain.clientWidth
      }, 0)
    }
  }, [children])

  // 计算激活状态下选中横线
  const pseudoPosition = useCallback(
    (index) => {
      const parentNode = containRef.current || {}
      const { childNodes = [] } = parentNode
      if (childNodes[index]) {
        const child = childNodes[index]
        const { width } = child.getBoundingClientRect()
        const ink = inkRef.current
        if (placement === 'horizontal' && ink) {
          const offsetLeft = child.offsetLeft
          if (index === 0) {
            ink.style.width = `${width - 17}px`
            ink.style.transform = `translateX(${offsetLeft}px)`
          } else {
            ink.style.width = `${width - 34}px`
            ink.style.transform = `translateX(${offsetLeft + 17}px)`
          }
        } else {
          const offsetTop = child.offsetTop
          ink.style.transform = `translateY(${offsetTop}px)`
        }
      }
    },
    [containRef, inkRef]
  )

  const handleRenderActiveLine = useCallback(
    (index) => {
      pseudoPosition(index)
      setTimeout(() => {
        // 前一个transform完成300ms动画后，重新获取最新位置进行计算
        pseudoPosition(index)
      }, 400)
    },
    [pseudoPosition]
  )

  const addTab = useCallback(() => {
    if (editable) {
      onAdd(children.length + 1)
      childRef.current = children.length
    }
  }, [children, editable, onAdd])

  const deleteTab = useCallback(
    (e, tabId, index, item) => {
      e.stopPropagation()
      setDeletetabId(tabId)
      if (editable) {
        if (onBeforeDelete) {
          const result = onBeforeDelete(item)
          if (result === true) {
            onDelete(item, index)
            Tooltip.close(`tab-${tabId}`)
          }
        } else {
          onDelete(item, index)
          Tooltip.close(`tab-${tabId}`)
        }
      }
    },
    [editable, activeId, onDelete]
  )

  const renderTabContent = useCallback(
    (child, index) => {
      const { tabId, animation } = child.props
      const activeIndex = showTabItems.findIndex((item) => item.tabId === activeId)

      return cloneElement(child, {
        show: tabId === activeId,
        latestActiveIdIndex: latestActiveId.current ? latestActiveId.current : -1,
        activeIdIndex: activeId ? activeIndex : -1,
        index,
        animation,
        placement
      })
    },
    [activeId, showTabItems]
  )

  const dragStart = useCallback((e, item) => {
    if (type === 'card' || type === 'line' || type === 'editable') {
      setDragged(e.currentTarget)
      e.currentTarget.classList.add('hi-tabs__item--disabled')
      onDragStart(omitItem(item))
    }
  }, [])

  const dragEnd = useCallback(
    (e, item) => {
      const items = containRef.current.getElementsByClassName('hi-tabs__item')
      const clientX = e.clientX
      const clientY = e.clientY
      const { left, right, top, bottom } = containRef.current.getBoundingClientRect()

      if (!(clientX >= left && clientX <= right && clientY <= bottom && clientY >= top)) {
        for (let i = 0; i < items.length; i++) {
          items[i].classList.remove('hi-tabs__item--disabled')
        }
        setOver(null)
        return
      }
      if (type === 'card' || type === 'line' || type === 'editable') {
        if (!over || !dragged) {
          return
        }
        var data = [...showTabItems]
        var from = Number(dragged.dataset.id)
        var to = Number(over.dataset.id)
        onDropEnd(omitItem(item), omitItem(showTabItems[to]))
        data.splice(to, 0, data.splice(from, 1)[0])
        data = data.map((doc, index) => {
          doc.newIndex = index + 1
          return doc
        })
        e.currentTarget.classList.remove('hi-tabs__item--disabled')

        setShowTabItems(data)
      }
    },
    [over, showTabItems, dragged]
  )

  const handleClick = useCallback(
    (tab, e) => {
      if (tab.disabled) {
        return false
      }
      if (activeIdProps === undefined) {
        setActiveId(tab.tabId)
      }
      onTabClick(tab.tabId, e)
    },
    [showTabItems]
  )

  const dragOver = useCallback(
    (e) => {
      if (type === 'card' || type === 'line' || type === 'editable') {
        e.preventDefault()

        e.target = e.target.closest('.hi-tabs__item')

        if (!e.target || !dragged) {
          return
        }

        const taIndex = JSON.parse(e.target.dataset.item).newIndex
        const dgIndex = JSON.parse(dragged.dataset.item).newIndex
        onDrop(omitItem(showTabItems[taIndex]), omitItem(showTabItems[dgIndex]))

        if (taIndex === dgIndex) {
          if (!over) return
          setOver(e.target)
          return
        }
        setOver(e.target)
      }
    },
    [over, dragged]
  )

  const handleKeyDown = useCallback(
    (e, tabIdx, tabRef, isDropdown) => {
      // ENTER OR SPACE
      if (e.keyCode === 32 || e.keyCode === 13) {
        e.preventDefault()
        if (isDropdown) {
          if (dropdownRef.current.state.visible !== true) {
            dropdownRef.current.toggle(false)
          }
        } else {
          tabRef.current.click()
        }
      }
      if (e.keyCode === 9) {
        dropdownRef.current.toggle(true)
      }

      if (!dropdownRef.current || dropdownRef.current.state.visible !== true) {
        const prevArr = []
        const nextArr = []
        // concat 的空对象为 “更多” tab
        let items = [...showTabItems]
        if (hiddenTabItems && hiddenTabItems.length > 0) {
          items = showTabItems.concat({})
        }
        items.forEach((item, idx) => {
          if (!item.disabled) {
            if (idx < tabIdx) {
              prevArr.push(idx)
            }
            if (idx > tabIdx) {
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
        if ([37, 38].includes(e.keyCode)) {
          e.preventDefault()
          dropdownRef.current && dropdownRef.current.toggle(true)
          containRef.current && containRef.current.querySelectorAll('.hi-tabs__item')[prev].focus()
        }
        if ([39, 40].includes(e.keyCode)) {
          e.preventDefault()
          dropdownRef.current && dropdownRef.current.toggle(true)
          containRef.current && containRef.current.querySelectorAll('.hi-tabs__item')[next].focus()
        }
      }
    },
    [showTabItems, containRef.current, dropdownRef.current, hiddenTabItems]
  )

  const moveFocus = useCallback(
    (direction) => {
      let newFocusIndex = null
      if (direction === 'up') {
        if (focusIndex === null) {
          newFocusIndex = hiddenTabItems.length - 1
        } else {
          newFocusIndex = focusIndex === 0 ? hiddenTabItems.length - 1 : focusIndex - 1
        }
      } else {
        if (focusIndex === null) {
          newFocusIndex = 0
        } else {
          newFocusIndex = focusIndex === hiddenTabItems.length - 1 ? 0 : focusIndex + 1
        }
      }
      setFocusIndex(newFocusIndex)
    },
    [focusIndex, hiddenTabItems]
  )

  const handleDropdownKeyDown = useCallback(
    (e) => {
      // ESC
      if (e.keyCode === 27) {
        e.preventDefault()
        dropdownRef.current.toggle(true)
        setFocusIndex(null)
      }
      if (dropdownRef.current && dropdownRef.current.state.visible === true) {
        // UP
        if (e.keyCode === 38) {
          e.preventDefault()
          moveFocus('up')
        }
        // DOWN
        if (e.keyCode === 40) {
          e.preventDefault()
          moveFocus('down')
        }
        // ENTER
        if (e.keyCode === 13) {
          e.preventDefault()
          handleClick(hiddenTabItems[focusIndex], e)
          dropdownRef.current.toggle(true)
          setFocusIndex(null)
        }
      }
    },
    [dropdownRef.current, focusIndex, moveFocus, handleClick, hiddenTabItems]
  )

  const getHeader = useCallback(() => {
    return (
      <>
        {leftBtn}
        <div className={`${prefixCls}__header`}>
          <div className={`${prefixCls}__nav contain`} onDragOver={dragOver} ref={containRef}>
            <TransitionGroup component={null}>
              {showTabItems.map((item, index) => {
                const { tabId } = item
                return (
                  <CSSTransition
                    key={tabId}
                    timeout={200}
                    unmountOnExit
                    onExit={() => animateDone(tabId)}
                    classNames={`${prefixCls}__tab-items`}
                  >
                    <TabItem
                      key={`${prefixCls}__item-${index}`}
                      handleKeyDown={handleKeyDown}
                      index={index}
                      prefixCls={prefixCls}
                      item={item}
                      draggable={draggable}
                      activeId={activeId}
                      type={type}
                      showTabItems={showTabItems}
                      editable={checkEditable}
                      handleClick={handleClick}
                      deleteTab={deleteTab}
                      dragStart={dragStart}
                      dragEnd={dragEnd}
                      canScroll={canScroll}
                    />
                  </CSSTransition>
                )
              })}
            </TransitionGroup>
            {hiddenTabItems.length > 0 && (
              <div
                className={classNames(`${prefixCls}__item`, {
                  [`${prefixCls}__item--active`]: hiddenTabItems.map((item) => item.tabId).includes(activeId)
                })}
                tabIndex={hiddenTabItems.map((item) => item.tabId).includes(activeId) ? 0 : -1}
                ref={hiddenRef}
                onKeyDown={(e) => {
                  handleKeyDown(e, showTabItems.length, hiddenRef, true)
                  handleDropdownKeyDown(e)
                }}
              >
                <ItemDropdown
                  active={hiddenTabItems.map((item) => item.tabId).includes(activeId)}
                  activeId={activeId}
                  theme={theme}
                  localeDatas={localeDatas}
                  defaultActiveId={defaultActiveId}
                  focusIndex={focusIndex}
                  items={hiddenTabItems}
                  ref={dropdownRef}
                  onChoose={(item, e) => {
                    handleClick(item, e)
                  }}
                />
              </div>
            )}
            {type === 'line' && (
              <div
                className={classNames(`${prefixCls}--line__ink`, {
                  [`${prefixCls}--line__ink-disabled`]: isActiveEffective
                })}
                ref={inkRef}
              />
            )}
          </div>
          {checkEditable && onAdd && !canScroll && (
            <div className={`${prefixCls}__add`} onClick={addTab}>
              <Icon name="plus" />
            </div>
          )}
        </div>
        {rightBtn}
      </>
    )
  })

  const tabsClasses = classNames(
    prefixCls,
    className,
    `${prefixCls}--${type}`,
    `theme__${theme}`,
    {
      [`${prefixCls}--${placement}`]: type === 'card' || type === 'line'
    },
    {
      [`${prefixCls}--scroll`]: canScroll
    }
  )

  const animateDone = (tabId) => {
    Tooltip.close(`tab-${tabId}`)
  }
  // 判断选中的元素是否为disabled 状态
  let isActiveEffective = false
  const arr = showTabItems.filter((item) => item.tabId === activeId)
  if (arr.length) {
    isActiveEffective = arr[0].disabled
  }

  return (
    <div className={tabsClasses}>
      {canScroll ? <div className={`${prefixCls}__scroll--outter`}>{getHeader()}</div> : getHeader()}
      <div className={`${prefixCls}__content`}>
        {React.Children.map(children, (item, index) => item && renderTabContent(item, index))}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  type: PropTypes.oneOf(['desc', 'card', 'button', 'editable', 'line']),
  placement: PropTypes.oneOf(['horizontal', 'vertical']),
  activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultActiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.number,
  editable: PropTypes.bool,
  className: PropTypes.string,
  renderTabBar: PropTypes.func,
  onTabClick: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onDrop: PropTypes.func,
  onDropEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  draggable: PropTypes.bool
}

Tabs.defaultProps = {
  prefixCls: 'hi-tabs',
  type: 'card',
  placement: 'horizontal',
  className: '',
  max: 6,
  editable: true,
  onTabClick: noop,
  onBeforeDelete: noop,
  onDrop: noop,
  onDropEnd: noop,
  onDragStart: noop,
  onDelete: noop,
  draggable: false
}
export default Provider(Tabs)
