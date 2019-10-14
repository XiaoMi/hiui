import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'
import Popper from '../popper'

class ItemDropdown extends Component {
  static propTypes = {
    items: PropTypes.array,
    onChoose: PropTypes.func,
    active: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      activeIndex: -1
    }
    this.clickOutsideHandle = this.clickOutside.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.active) {
      this.setState({
        activeIndex: -1
      })
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandle)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandle)
  }

  clickOutside (e) {
    if (ReactDOM.findDOMNode(this.toggleRef) && ReactDOM.findDOMNode(this.toggleRef).contains(e.target)) {
      return
    }
    this.toggle(true)
  }

  toggle (visible = this.state.visible) {
    this.setState({
      visible: !visible
    })
  }

  render () {
    const {
      items,
      onChoose,
      localeDatas
    } = this.props
    const {
      activeIndex,
      visible
    } = this.state

    return (
      <div className={classNames('hi-tabs-legacy-dropdown', {'hi-tabs-legacy-dropdown--active': !!items[activeIndex]})}>
        <div className='hi-tabs-legacy-dropdown__toggle' ref={node => { this.toggleRef = node }} onClick={e => {
          e.stopPropagation()
          this.toggle()
        }}>
          <span className='hi-tabs-legacy-dropdown__toggle-title'>
            { (items[activeIndex] && items[activeIndex].tabName) || localeDatas.tabs.more }
          </span>
          <i className='hi-icon icon-down' />
        </div>
        <Popper
          className='hi-tabs-legacy-dropdown__popper'
          show={visible}
          attachEle={this.toggleRef}
          zIndex={1010}
          width='auto'
          leftGap={-18}
          topGap={3}
        >
          <div className={classNames('hi-tabs-legacy-dropdown__items')}>
            {
              items.map((item, index) => {
                return (
                  <div className={classNames('hi-tabs-legacy-dropdown__item', {'hi-tabs-legacy-dropdown__item--active': index === activeIndex})}
                    onClick={e => {
                      this.setState({
                        activeIndex: index
                      }, () => {
                        this.toggle()
                        onChoose(item, e)
                      })
                    }}
                    key={index}
                  >
                    {item.tabName}
                  </div>
                )
              })
            }
          </div>
        </Popper>
      </div>
    )
  }
}

export default Provider(ItemDropdown)
