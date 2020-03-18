import React, {Component} from 'react'
import classNames from 'classnames'
import Icon from '../icon'

export default class TimeList extends Component {
  constructor (props) {
    super(props)
    const prefixCount = [1, 2, 3]
    const suffixCount = [1, 2, 3]
    this.liPrefix = prefixCount.map((item, index) => {
      return <li className='hi-timepicker__item hi-timepikcer__item--empty' key={'pre' + index} />
    })
    this.liSuffix = suffixCount.map((item, index) => {
      return <li className='hi-timepicker__item hi-timepikcer__item--empty' key={'suf' + index} />
    })
    this.listRef = React.createRef()
    // this.scrollEvent = this.scrollEvent.bind(this)
    this.state = {
      showArrow: false
    }
    this.timer = null
    this.topValue_1 = 0
    this.topValue_2 = 0
  }
  scrollTo () {
    const { value } = this.props
    const dVal = 32
    this.listRef.current && (this.listRef.current.scrollTop = value * dVal)
  }
  componentDidUpdate () {
    this.scrollTo()
  }
  componentDidMount () {
    // this.listRef.current.addEventListener('scroll', this.scrollEvent)
    setTimeout(() => {
      this.scrollTo()
    }, 0)
  }
  componentWillUnmount () {
    window.clearTimeout(this.timer)
    // this.listRef.current.removeEventListener('scroll', this.scrollEvent)
  }
  renderArrow (type) {
    return (
      <React.Fragment>
        <span
          className='hi-timepicker__page-turn'
          onClick={() => this.arrowEvent(-1)}
        >
          <Icon name='up' />
        </span>
        <span
          className='hi-timepicker__page-turn'
          onClick={() => this.arrowEvent(1)}
        >
          <Icon name='down' />
        </span>
      </React.Fragment>
    )
  }
  arrowEvent (arrow) {
    const st = this.listRef.current.scrollTop
    const val = Math.round(st / 32)
    this.props.onSelect(this.props.type, val + arrow, arrow)
  }
  isScrollStop (val, el) {
    const { disabledList } = this.props
    this.topValue_2 = el.scrollTop
    if (this.topValue_1 === this.topValue_2) {
      el.scrollTop = val * 32
      if (!disabledList.includes(val)) {
        this.props.onSelect(this.props.type, val)
      }
    }
  }
  scrollEvent (e) {
    const { type } = this.props
    clearTimeout(this.timer)
    const st = e.target.scrollTop
    this.topValue_1 = st
    const val = Math.round(st / 32)
    if ((type === 'hours' && val > 23) || ((type === 'minutes' || type === 'seconds') && val > 59)) {
      return false
    }
    this.timer = setTimeout(this.isScrollStop.bind(this, val, e.target), 200)
  }
  clickEvent (type, e) {
    e.stopPropagation()
    const li = e.target
    if (li.nodeName !== 'LI') return false
    if (!li.textContent) return
    this.props.onSelect(type, parseInt(li.textContent), e)
  }
  render () {
    const { showArrow } = this.state
    const { type, datas } = this.props
    return <div
      className='hi-timepicker__list-container'
      onMouseEnter={() => this.setState({showArrow: true})}
      onMouseLeave={() => this.setState({showArrow: false})}
    >
      <ul
        ref={this.listRef}
        className={`hi-timepicker__list`}
        onClick={this.clickEvent.bind(this, type)}
        onScroll={this.scrollEvent.bind(this)}
      >
        {this.liPrefix}
        {
          datas.map((data, index) => {
            const _class = classNames(
              'hi-timepicker__item',
              data.current && 'hi-timepicker__item--current',
              data.disabled && 'hi-timepicker__item--disabled'
            )
            return (
              <li
                key={index}
                className={_class}
                value={parseInt(data.text)}
              >{data.text}</li>
            )
          })
        }
        {this.liSuffix}
      </ul>
      {showArrow && this.renderArrow(type)}
    </div>
  }
}
