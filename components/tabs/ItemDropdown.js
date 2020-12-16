import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'

class ItemDropdown extends Component {
  static propTypes = {
    items: PropTypes.array,
    onChoose: PropTypes.func,
    active: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      activeIndex: -1
    }
    this.clickOutsideHandle = this.clickOutside.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.active) {
      this.setState({
        activeIndex: -1
      })
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.clickOutsideHandle)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.clickOutsideHandle)
  }

  clickOutside(e) {
    this.toggle(true)
  }

  toggle = (visible = this.state.visible) => {
    this.setState({
      visible: !visible
    })
  }

  render() {
    const { items, onChoose, localeDatas, activeId, theme, focusIndex } = this.props
    const { visible } = this.state
    let activeIndex = -1
    items.map((item, index) => {
      if (item.tabId === activeId) activeIndex = index
    })
    return (
      <div
        className={classNames('hi-tabs-dropdown', `theme__${theme}`, {
          'hi-tabs-dropdown--active': !!items[activeIndex]
        })}
      >
        <div
          className="hi-tabs-dropdown__toggle"
          ref={(node) => {
            this.toggleRef = node
          }}
          onClick={(e) => {
            e.stopPropagation()
            this.toggle()
          }}
        >
          <span className="hi-tabs-dropdown__toggle-title">
            {(items[activeIndex] && items[activeIndex].tabTitle) || localeDatas.tabs.more}
          </span>
          <i className="hi-icon icon-down" />
        </div>
        <Popper
          className="hi-tabs-dropdown__popper"
          show={visible}
          attachEle={this.toggleRef}
          zIndex={1010}
          width="auto"
          topGap={3}
        >
          <div className={classNames('hi-tabs-dropdown__wrapper', `theme__${theme}`)}>
            <ul className={classNames('hi-tabs-dropdown__items', `theme__${theme}`)}>
              {items.map((item, index) => {
                return (
                  <li
                    className={classNames('hi-tabs-dropdown__item', {
                      'hi-tabs-dropdown__item--active': index === activeIndex,
                      'hi-tabs-dropdown__item--focus': index === focusIndex
                    })}
                    onClick={(e) => {
                      this.toggle()
                      onChoose(item, e)
                    }}
                    key={index}
                  >
                    {item.tabTitle}
                  </li>
                )
              })}
            </ul>
          </div>
        </Popper>
      </div>
    )
  }
}

export default ItemDropdown
