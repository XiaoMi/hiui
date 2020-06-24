import React, { useCallback, cloneElement, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
import ItemDropdown from './ItemDropdown'
import TabItem from './TabItem'
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group'
const noop = () => { }

const Tabs = ({
  onDrop,
  onDropEnd,
  onDragStart,
  defaultActiveId,
  activeId: activeIdProps,
  children,
  type,
  placement,
  max,
  onEdit,
  editable,
  className,
  theme,
  prefixCls,
  draggable,
  onTabClick }) => {
  const containRef = useRef()
  const getTabItems = () => {
    const showTabItems = []
    const hiddenTabItems = []

    React.Children.map(children, (child) => {
      if (child) {
        const { tabTitle, tabId, tabDesc, disabled, closeable, duration } = child.props
        const item = { tabTitle, tabId, tabDesc, disabled, closeable, duration }

        if ((type === 'card' || type === 'line') && placement === 'horizontal' && showTabItems.length >= max) { // 卡片式标签超过max时，其余标签的隐藏
          hiddenTabItems.push(item)
        } else {
          showTabItems.push(item)
        }
      }
    })
    return { showTabItems, hiddenTabItems }
  }
  const tabItems = getTabItems()
  const [showTabItems, setShowTabItems] = useState(tabItems.showTabItems)
  const [hiddenTabItems, setHiddentab] = useState(tabItems.hiddenTabItems)
  const [activeId, setActiveId] = useState(activeIdProps !== undefined ? activeIdProps : (defaultActiveId || (showTabItems && showTabItems[0] && showTabItems[0].tabId)))
  const [dragged, setDragged] = useState()
  const [over, setOver] = useState()
  const [crossBorder, setCrossBorder] = useState(false)
  const [deletetabId, setDeletetabId] = useState()
  const latestActiveId = useRef(activeId)

  useEffect(() => {
    if (deletetabId && (latestActiveId.current === activeId)) {
      setActiveId(children[0] && children[0].props.tabId)
    }
  }, [deletetabId])

  useEffect(() => {
    latestActiveId.current = activeId

    if (type === 'line') {
      const index = showTabItems.findIndex(item => item.tabId === activeId)
      PseudoPosition(index === -1 ? max : index)
    }
  }, [activeId])

  useEffect(() => {
    if (!activeId && showTabItems.length) {
      setActiveId(showTabItems[0].tabId)
    }
    judgePseudoPosition()
  }, [showTabItems])

  useEffect(() => {
    const tabItems = getTabItems()

    setShowTabItems(tabItems.showTabItems)
    setHiddentab(tabItems.hiddenTabItems)
  }, [children])

  const judgePseudoPosition = () => {
    if (type === 'line') {
      const index = showTabItems.findIndex(item => item.tabId === defaultActiveId)

      if (index !== -1) {
        PseudoPosition(index)
      } else {
        PseudoPosition(max)
      }
    }
  }

  const PseudoPosition = (index) => {
    const parentNode = containRef.current
    if (!parentNode.childNodes.length) {
      return
    }
    const child = parentNode.childNodes[index]

    const { width } = child.getBoundingClientRect()

    if (placement === 'horizontal') {
      const offsetLeft = child.offsetLeft
      document.styleSheets[0].addRule('.hi-tabs__header::after', `width:${width - 34}px !important`)
      document.styleSheets[0].addRule('.hi-tabs__header::after', `transform:translateX(${offsetLeft + 17}px)`)
    } else {
      const offsetTop = child.offsetTop
      document.styleSheets[0].addRule('.hi-tabs__header::after', `transform:translateY(${offsetTop}px)`)
    }
  }

  const addTab = useCallback(() => {
    if (editable) {
      onEdit('add', (children.length + 1))
      BoundaryJudge('add')
    }
  }, [children, editable])

  const BoundaryJudge = (opt) => {
    const current = containRef.current
    const { right: containRight, width: continWidth } = current.getBoundingClientRect()
    const theLastChild = current.childNodes[current.childNodes.length - 1]
    const { right: theLastRight = 0 } = theLastChild ? theLastChild.getBoundingClientRect() : {}
    const { width: hideNavWidth } = document.getElementsByClassName('hi-tabs__nav-hidden')[0].getBoundingClientRect()

    if (opt === 'add') {
      if (containRight < theLastRight + 100) {
        setCrossBorder(containRight < theLastRight + 100)
      }
    } else {
      if (hideNavWidth < continWidth) {
        setCrossBorder(false)
      }
    }
  }
  const deleteTab = useCallback((e, tabId, index) => {
    e.stopPropagation()
    setDeletetabId(tabId)

    if (editable) {
      onEdit('delete', index, tabId)
      Tooltip.close(`tab-${tabId}`)
      BoundaryJudge()
    }
  }, [editable])

  const checkEditable = () => editable && type === 'editable'

  const renderTabContent = (child, index) => {
    const { tabId, duration } = child.props
    console.log(latestActiveId.current, activeId)
    return cloneElement(child, {
      show: tabId === activeId,
      latestActiveIdIndex: latestActiveId.current ? latestActiveId.current.split('-')[1] : -1,
      activeIdIndex: activeId ? activeId.split('-')[1] : -1,
      index,
      duration,
      placement
    })
  }

  const dragStart = useCallback((e, item) => {
    if (type === 'card' || type === 'line' || type === 'editable') {
      setDragged(e.currentTarget)
      onDragStart(item)
    }
  }, [])

  const dragEnd = useCallback((e, item) => {
    if (type === 'card' || type === 'line' || type === 'editable') {
      if (!over) {
        return
      }

      over.classList.remove('drag-left', 'drag-right', 'drag-up', 'drag-down')

      var data = [...showTabItems]
      var from = Number(dragged.dataset.id)
      var to = Number(over.dataset.id)
      onDropEnd(item, showTabItems[to])
      data.splice(to, 0, data.splice(from, 1)[0])
      data = data.map((doc, index) => {
        doc.newIndex = index + 1
        return doc
      })
      setShowTabItems(data)
    }
  }, [over, showTabItems, dragged])

  const handleClick = useCallback((tab, e) => {
    if (tab.disabled) {
      return false
    }

    onTabClick(tab.tabId, e)

    setActiveId(tab.tabId)
  }, [showTabItems])

  const dragOver = useCallback((e) => {
    if (type === 'card' || type === 'line' || type === 'editable') {
      e.preventDefault()

      e.target = e.target.closest('.hi-tabs__item')

      if (!e.target) {
        return
      }

      const taIndex = JSON.parse(e.target.dataset.item).newIndex
      const dgIndex = JSON.parse(dragged.dataset.item).newIndex
      onDrop(showTabItems[taIndex], showTabItems[dgIndex])

      if (taIndex === dgIndex) {
        if (!over) return
        over.classList.remove('drag-left', 'drag-right', 'drag-up', 'drag-down')
        return
      }
      let animateName

      if (placement === 'horizontal') {
        animateName = dgIndex > taIndex ? 'drag-left' : 'drag-right'
      } else {
        animateName = dgIndex > taIndex ? 'drag-up' : 'drag-down'
      }

      if (over && e.target.dataset.item !== over.dataset.item) {
        over.classList.remove('drag-up', 'drag-down', 'drag-right', 'drag-left')
      }

      if (!e.target.classList.contains(animateName)) {
        e.target.classList.add(animateName)
        setOver(e.target)
      }
    }
  }, [over, dragged])

  const tabsClasses = classNames(prefixCls, className, `${prefixCls}--${type}`, `theme__${theme}`, {
    [`${prefixCls}--${placement}`]: type === 'card' || type === 'line'
  })

  const editableFlag = checkEditable()

  const animateDone = (tabId) => {
    Tooltip.close(`tab-${tabId}`)
  }
  let activeTabInHiddenItems = true

  return <div className={tabsClasses}>
    <div className={`${prefixCls}__header`}>

      <div className={`${prefixCls}__nav contain`} onDragOver={dragOver} ref={containRef}>
        <TransitionGroup className='todo-list' component={null} >
          {showTabItems.map((item, index) => {
            const { tabId } = item
            activeTabInHiddenItems = activeTabInHiddenItems && tabId !== activeId
            return <CSSTransition
              key={tabId}
              timeout={200}
              unmountOnExit
              onExit={() => animateDone(tabId)}
              classNames='tab-items'
            ><TabItem key={`${prefixCls}__item-${index}`} index={index} prefixCls={prefixCls} item={item} draggable={draggable} activeId={activeId} type={type} showTabItems={showTabItems} editable={editableFlag} crossBorder={crossBorder} handleClick={handleClick} deleteTab={deleteTab} dragStart={dragStart} dragEnd={dragEnd} /></CSSTransition>
          })}
        </TransitionGroup>

        {
          hiddenTabItems.length > 0 &&
          <div className={classNames(`${prefixCls}__item`, {
            [`${prefixCls}__item--active`]: activeTabInHiddenItems
          })}
          >
            <ItemDropdown
              active={activeTabInHiddenItems}
              activeId={activeId}
              theme={theme}
              defaultActiveId={defaultActiveId}
              items={hiddenTabItems}
              onChoose={(item, e) => {
                handleClick(item, e)
              }}
            />
          </div>
        }

      </div>

      {
        (type === 'editable') && <div className={`${prefixCls}__nav-hidden`}>
          {showTabItems.map((item, index) => <TabItem key={`${prefixCls}__item-${index}`} index={index} prefixCls={prefixCls} item={item} draggable={draggable} activeId={activeId} type={type} showTabItems={showTabItems} editable={editableFlag} crossBorder={crossBorder} handleClick={handleClick} deleteTab={deleteTab} dragStart={dragStart} dragEnd={dragEnd} />)}
        </div>
      }
      {
        editableFlag &&
        <div className={`${prefixCls}__add`}>
          <Icon onClick={addTab} name='plus' />
        </div>
      }
    </div>
    <div className={`${prefixCls}__content`}>

      {React.Children.map((children), (item, index) => item && renderTabContent(item, index))}
    </div>
  </div>
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
  onEdit: PropTypes.func,
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
  onEdit: noop,
  onDrop: noop,
  onDropEnd: noop,
  onDragStart: noop,
  draggable: false
}
export default Tabs
