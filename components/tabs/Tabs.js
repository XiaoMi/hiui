import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
import ItemDropdown from './ItemDropdown'
import Provider from '../context'
// import {
//   CSSTransition,
//   TransitionGroup
// } from 'react-transition-group'
import TabItem from './TabItem'

const noop = () => { }

class Tabs extends Component {
  static propTypes = {
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

  static defaultProps = {
    prefixCls: 'hi-tabs',
    type: 'card',
    placement: 'horizontal',
    className: '',
    max: 6,
    editable: true,
    onTabClick: noop,
    onEdit: noop,
    draggable: false
  }

  deletetabId = null

  constructor (props) {
    super(props)

    const { defaultActiveId, activeId } = props
    this.containRef = React.createRef()
    const {
      showTabItems,
      hiddenTabItems
    } = this.getTabItems(this.props)

    this.state = {
      activeId: activeId !== undefined ? activeId : (defaultActiveId || (showTabItems && showTabItems[0] && showTabItems[0].tabId)),
      showTabItems,
      hiddenTabItems,
      defaultActiveId,
      dragged: null,
      crossBorder: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      showTabItems,
      hiddenTabItems
    } = this.getTabItems(nextProps)
    this.setState({
      showTabItems,
      hiddenTabItems
    })
    if (this.props.activeId !== nextProps.activeId) {
      this.setState({
        activeId: nextProps.activeId
      })
    }
    // 考虑 tab 删完又新增一个的情况
    if (this.props.children.length === 0 && nextProps.children.length > 0) {
      this.setState({ activeId: nextProps.children[0] && nextProps.children[0].props.tabId })
    }

    if (this.props.children.length > nextProps.children.length && this.deletetabId && this.deletetabId === this.state.activeId) { // 删除的是当前激活的tab，需重置激活tab
      this.setState({
        activeId: (nextProps.children[0] && nextProps.children[0].props.tabId) || undefined
      }, () => {
        this.deletetabId = null
      })
    }
  }

  componentDidMount () {
    const { defaultActiveId, showTabItems } = this.state
    const { type, max } = this.props

    if (type === 'line') {
      const index = showTabItems.findIndex(item => item.tabId === defaultActiveId)

      if (index !== -1) {
        this.PseudoPosition(index)
      } else {
        this.PseudoPosition(max)
      }
    }
  }

  ju

  getTabItems (props) {
    const {
      children,
      type,
      placement,
      max
    } = props
    const showTabItems = []
    const hiddenTabItems = []

    React.Children.map(children, (child) => {
      if (child) {
        const { tabTitle, tabId, tabDesc, disabled, closeable } = child.props
        const item = { tabTitle, tabId, tabDesc, disabled, closeable }

        if ((type === 'card' || type === 'line') && placement === 'horizontal' && showTabItems.length >= max) { // 卡片式标签超过max时，其余标签的隐藏
          hiddenTabItems.push(item)
        } else {
          showTabItems.push(item)
        }
      }
    })
    return { showTabItems, hiddenTabItems }
  }

  addTab () {
    const {
      onEdit,
      editable,
      children
    } = this.props

    if (editable) {
      onEdit('add', (children.length + 1))
      this.BoundaryJudge('add')
    }
  }

  BoundaryJudge (opt) {
    const current = this.containRef.current
    const { right: containRight, width: continWidth } = current.getBoundingClientRect()
    const theLastChild = current.childNodes[current.childNodes.length - 1]
    const { right: theLastRight } = theLastChild.getBoundingClientRect()
    const { width: hideNavWidth } = document.getElementsByClassName('hi-tabs__nav-hidden')[0].getBoundingClientRect()
    if (opt === 'add') {
      if (containRight < theLastRight + 100) {
        this.setState({
          crossBorder: containRight < theLastRight + 100
        })
      }
    } else {
      if (hideNavWidth < continWidth) {
        this.setState({
          crossBorder: false
        })
      }
    }
  }

  deleteTab (e, tabId, index) {
    e.stopPropagation()
    this.deletetabId = tabId
    const {
      onEdit,
      editable
    } = this.props

    if (editable) {
      onEdit('delete', index, tabId)
      Tooltip.close(`tab-${tabId}`)
      this.BoundaryJudge()
    }
  }

  checkEditable () {
    const {
      editable,
      type
    } = this.props

    return editable && type === 'editable'
  }

  renderTabContent (child) {
    const { tabId } = child.props
    const { activeId } = this.state

    return cloneElement(child, {
      show: tabId === activeId
    })
  }

  dragStart (e) {
    this.setState({
      dragged: e.currentTarget
    })
  }

  dragEnd () {
    if (!this.over) {
      return
    }

    this.over.classList.remove('drag-left', 'drag-right', 'drag-up', 'drag-down')

    var data = this.state.showTabItems
    var from = Number(this.state.dragged.dataset.id)
    var to = Number(this.over.dataset.id)
    data.splice(to, 0, data.splice(from, 1)[0])
    data = data.map((doc, index) => {
      doc.newIndex = index + 1
      return doc
    })

    this.setState({ showTabItems: data })
  }

  PseudoPosition (index) {
    const { placement } = this.props
    const parentNode = this.containRef.current

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
  handleClick (tab, e) {
    const { max, onTabClick, type } = this.props
    const { showTabItems } = this.state
    if (tab.disabled) {
      return false
    }

    onTabClick(tab.tabId, e)
    this.setState({ activeId: tab.tabId }, () => {
      if (type === 'line') {
        const index = showTabItems.findIndex(item => item.tabId === tab.tabId)
        this.PseudoPosition(index === -1 ? max : index)
      }
    })
  }
  dragOver (e) {
    e.preventDefault()
    const { dragged } = this.state
    const { placement } = this.props

    e.target = e.target.closest('.hi-tabs__item')

    if (!e.target) {
      return
    }

    const taIndex = JSON.parse(e.target.dataset.item).newIndex
    const dgIndex = JSON.parse(dragged.dataset.item).newIndex
    console.log(taIndex, dgIndex)

    if (taIndex === dgIndex) {
      if (!this.over) return
      this.over.classList.remove('drag-left', 'drag-right', 'drag-up', 'drag-down')
      return
    }
    let animateName

    if (placement === 'horizontal') {
      animateName = dgIndex > taIndex ? 'drag-left' : 'drag-right'
    } else {
      animateName = dgIndex > taIndex ? 'drag-up' : 'drag-down'
    }

    if (this.over && e.target.dataset.item !== this.over.dataset.item) {
      this.over.classList.remove('drag-up', 'drag-down', 'drag-right', 'drag-left')
    }

    if (!e.target.classList.contains(animateName)) {
      e.target.classList.add(animateName)
      this.over = e.target
    }
  }

  render () {
    const { activeId, showTabItems, hiddenTabItems, defaultActiveId, crossBorder } = this.state
    const { prefixCls, type, placement, children, className, theme, draggable } = this.props

    const tabsClasses = classNames(prefixCls, className, `${prefixCls}--${type}`, `theme__${theme}`, {
      [`${prefixCls}--${placement}`]: type === 'card' || type === 'line'
    })

    const editable = this.checkEditable()

    let activeTabInHiddenItems = true
    return (
      <div className={tabsClasses}>
        <div className={`${prefixCls}__header`}>

          <div className={`${prefixCls}__nav contain`} onDragOver={this.dragOver.bind(this)} ref={this.containRef}>

            {showTabItems.map((item, index) => {
              const { tabId } = item
              activeTabInHiddenItems = activeTabInHiddenItems && tabId !== activeId
              return <TabItem key={`${prefixCls}__item-${index}`} index={index} prefixCls={prefixCls} item={item} draggable={draggable} activeId={activeId} type={type} showTabItems={showTabItems} editable={editable} crossBorder={crossBorder} handleClick={this.handleClick.bind(this)} deleteTab={this.deleteTab.bind(this)} dragStart={this.dragStart.bind(this)} dragEnd={this.dragEnd.bind(this)} />
            })}

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
                    this.handleClick(item, e)
                  }}
                />
              </div>
            }

          </div>

          {
            (type === 'editable') && <div className={`${prefixCls}__nav-hidden`}>
              {showTabItems.map((item, index) => <TabItem key={`${prefixCls}__item-${index}`} index={index} prefixCls={prefixCls} item={item} draggable={draggable} activeId={activeId} type={type} showTabItems={showTabItems} editable={editable} crossBorder={crossBorder} handleClick={this.handleClick.bind(this)} deleteTab={this.deleteTab.bind(this)} dragStart={this.dragStart.bind(this)} dragEnd={this.dragEnd.bind(this)} />)}
            </div>
          }
          {
            editable &&
            <div className={`${prefixCls}__add`}>
              <Icon onClick={this.addTab.bind(this)} name='plus' />
            </div>
          }
        </div>
        <div className={`${prefixCls}__content`}>
          {React.Children.map(children, item => {
            return item && this.renderTabContent(item)
          })}
        </div>
      </div>
    )
  }
}

export default Provider(Tabs)
