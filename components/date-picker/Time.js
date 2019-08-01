import React, {Component} from 'react'
import {deconstructDate} from './util'
import Icon from '../icon'
import classNames from 'classnames'
import { isSameDay, getValidDate } from './dateUtil'
export default class TimePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      date: getValidDate(props.date),
      prefix: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      hoursArrow: false,
      minutesArrow: false,
      secondsArrow: false
    }
    this.hoursList = null
    this.minutesList = null
    this.secondsList = null
    this.liPrefix = props.onlyTime ? [1, 2, 3] : [1, 2, 3, 4]
    this.liSuffix = props.onlyTime ? [1, 2, 3] : [1, 2, 3, 4]
    this.hoursScrollEvent = this.scrollEvent.bind(this, 'hours')
    this.minutesScrollEvent = this.scrollEvent.bind(this, 'minutes')
    this.secondsScrollEvent = this.scrollEvent.bind(this, 'seconds')
    this.pageUpRef = React.createRef()
    this.pageDownRef = React.createRef()
    this.topValue_1 = 0
    this.topValue_2 = 0
    this.timer = null
  }
  range (num) {
    let arr = []
    for (let i = 0; i < num; i++) {
      arr.push(i < 10 ? '0' + i : i.toString())
    }
    return arr
  }
  componentDidMount () {
    this.completeScrollTop()
  }
  addListener () {
    this.hoursList && this.hoursList.addEventListener('scroll', this.hoursScrollEvent)
    this.minutesList && this.minutesList.addEventListener('scroll', this.minutesScrollEvent)
    this.secondsList && this.secondsList.addEventListener('scroll', this.secondsScrollEvent)
  }
  isScrollStop (val, el) {
    this.topValue_2 = el.scrollTop
    if (this.topValue_1 === this.topValue_2) {
      el.scrollTop = val * 32
    }
  }
  scrollEvent (type, e) {
    clearTimeout(this.timer)
    const st = e.target.scrollTop
    this.topValue_1 = st
    const val = Math.round(st / 32)
    if ((type === 'hours' && val > 23) || ((type === 'minutes' || type === 'seconds') && val > 59)) {
      return false
    }
    this.timer = setTimeout(this.isScrollStop.bind(this, val, e.target), 200)
    const {date} = this.state
    if (type === 'hours') {
      date.setHours(val)
    } else if (type === 'minutes') {
      date.setMinutes(val)
    } else {
      date.setSeconds(val)
    }
    this.setState({
      date
    })
    this.props.onPick(date, true)
  }
  componentWillUnmount () {
    this.hoursList.removeEventListener('scroll', this.hoursScrollEvent)
    this.minutesList.removeEventListener('scroll', this.minutesScrollEvent)
    this.secondsList.removeEventListener('scroll', this.secondsScrollEvent)
  }
  componentWillReceiveProps (props) {
    if (!isSameDay(props.date, this.state.date)) {
      this.setState({
        date: getValidDate(props.date)
      })
    }
  }
  completeScrollTop () {
    const {date} = this.state
    let {hours, minutes, seconds} = deconstructDate(date)
    const dVal = 32
    setTimeout(() => {
      this.hoursList.scrollTop = (hours) * dVal
      this.minutesList.scrollTop = (minutes) * dVal
      this.secondsList.scrollTop = (seconds) * dVal
    }, 0)
    setTimeout(() => {
      this.addListener()
    }, 200)
  }

  clickEvent (flag, e) {
    e.stopPropagation()
    const li = e.target
    if (!li.innerText) return
    const {date} = this.state
    if (li.nodeName !== 'LI') return false
    const c = parseInt(li.innerText)
    if (flag === 'hours') {
      date.setHours(c)
    } else if (flag === 'minutes') {
      date.setMinutes(c)
    } else {
      date.setSeconds(c)
    }
    this.setState({
      date
    }, () => {
      this.completeScrollTop()
    })
    this.props.onPick(date, true)
  }
  _renderPrefix (val) {
    return val === 1 ? <li /> : [<li key='p0' />, <li key='p1' />]
  }
  _renderSuffix (val, limit) {
    if (limit - val === 1) {
      return [<li key='p0' />, <li key='p1' />]
    } else if (limit - val === 2) {
      return <li />
    }
  }
  scrollPageUp (type) {
    const {date} = this.state
    let cHours = date.getHours()
    let cMinutes = date.getMinutes()
    let cSeconds = date.getSeconds()
    if (type === 'hours') {
      cHours = cHours === 0 ? 0 : cHours - 1
      this.hoursList.scrollTop = cHours * 32
    }
    if (type === 'minutes') {
      cMinutes = cMinutes === 0 ? 0 : cMinutes - 1
      this.minutesList.scrollTop = cMinutes * 32
    }
    if (type === 'seconds') {
      cSeconds = cSeconds === 0 ? 0 : cSeconds - 1
      this.secondsList.scrollTop = cSeconds * 32
    }
    date.setHours(cHours, cMinutes, cSeconds)
    this.setState({date})
  }
  scrollPageDown (type) {
    const {date} = this.state
    let cHours = date.getHours()
    let cMinutes = date.getMinutes()
    let cSeconds = date.getSeconds()
    if (type === 'hours') {
      cHours = cHours === 23 ? 23 : cHours + 1
      this.hoursList.scrollTop = cHours * 32
    }
    if (type === 'minutes') {
      cMinutes = cMinutes === 59 ? 59 : cMinutes + 1
      this.minutesList.scrollTop = cMinutes * 32
    }
    if (type === 'seconds') {
      cSeconds = cSeconds === 59 ? 59 : cSeconds + 1
      this.secondsList.scrollTop = cSeconds * 32
    }
    date.setHours(cHours, cMinutes, cSeconds)
    this.setState({date}, () => {
      this.props.onPick(date, true)
    })
  }
  renderArrow (type) {
    return (
      <React.Fragment>
        <span className='hi-timepicker__page-turn' onClick={() => this.scrollPageUp(type)}>
          <Icon name='up' />
        </span>
        <span className='hi-timepicker__page-turn' onClick={() => this.scrollPageDown(type)}>
          <Icon name='down' />
        </span>
      </React.Fragment>
    )
  }
  render () {
    const { localeDatas } = this.props
    const { hours: lHours, minutes: lMinutes, seconds: lSeconds } = localeDatas.datePicker
    const {date, hoursArrow, minutesArrow, secondsArrow} = this.state
    const {hours, minutes, seconds} = deconstructDate(date)
    this.liPrefix = this.liPrefix.map((item, index) => {
      return <li className='hi-timepicker__item hi-timepikcer__item--empty' key={'pre' + index} />
    })
    this.liSuffix = this.liSuffix.map((item, index) => {
      return <li className='hi-timepicker__item hi-timepikcer__item--empty' key={'suf' + index} />
    })
    return (
      <div className='hi-timepicker__body'>
        <div className='hi-timepicker__timeheader'>
          <span className='hi-timepicker__mark'>{lHours}</span>
          <span className='hi-timepicker__mark'>{lMinutes}</span>
          <span className='hi-timepicker__mark'>{lSeconds}</span>
        </div>
        <div className='hi-timepicker__timebody'>
          <div
            className='hi-timepicker__list-container'
            onMouseEnter={() => this.setState({hoursArrow: true})}
            onMouseLeave={() => this.setState({hoursArrow: false})}
          >
            <ul
              ref={el => { this.hoursList = el }}
              className='hi-timepicker__list'
              onClick={this.clickEvent.bind(this, 'hours')}
            >
              {this.liPrefix}
              {
                this.range(24).map((m, n) => {
                  const _class = classNames(
                    'hi-timepicker__item',
                    n === hours && 'hi-timepicker__item--current'
                  )
                  return (
                    <li
                      key={n}
                      className={_class}
                    >{m}</li>
                  )
                })
              }
              {this.liSuffix}
            </ul>
            {hoursArrow && this.renderArrow('hours')}
          </div>
          <div
            className='hi-timepicker__list-container'
            onMouseEnter={() => this.setState({minutesArrow: true})}
            onMouseLeave={() => this.setState({minutesArrow: false})}
          >
            <ul
              className='hi-timepicker__list'
              ref={el => { this.minutesList = el }}
              onClick={this.clickEvent.bind(this, 'minutes')}
            >
              {this.liPrefix}
              {
                this.range(60).map((m, n) => {
                  return <li key={n} className={n === minutes ? 'hi-timepicker__item hi-timepicker__item--current' : 'hi-timepicker__item'}>{m}</li>
                })
              }
              {this.liSuffix}
            </ul>
            {minutesArrow && this.renderArrow('minutes')}
          </div>
          <div
            className='hi-timepicker__list-container'
            onMouseEnter={() => this.setState({secondsArrow: true})}
            onMouseLeave={() => this.setState({secondsArrow: false})}
          >
            <ul
              ref={el => { this.secondsList = el }}
              className='hi-timepicker__list'
              onClick={this.clickEvent.bind(this, 'seconds')}
            >
              {this.liPrefix}
              {
                this.range(60).map((m, n) => {
                  return <li key={n} className={n === seconds ? 'hi-timepicker__item hi-timepicker__item--current' : 'hi-timepicker__item'}>{m}</li>
                })
              }
              {this.liSuffix}
            </ul>
            {secondsArrow && this.renderArrow('seconds')}
          </div>
          <div className='hi-timepicker__current-line' style={{top: this.props.onlyTime ? 108 : 140}} />
        </div>
      </div>
    )
  }
}
