import React, {Component} from 'react'
import {deconstructDate} from './util'

export default class TimePanel extends Component {
  hoursList = null
  minutesList = null
  secondsList = null
  activeEl = null
  constructor (props) {
    super(props)
    this.state = {
      date: new Date(props.date),
      prefix: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
    this.liPrefix = props.onlyTime ? [1, 2, 3] : [1, 2, 3, 4]
    this.liSuffix = props.onlyTime ? [1, 2, 3] : [1, 2, 3, 4]
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
    this.hoursList && this.hoursList.addEventListener('scroll', this.scrollEvent.bind(this, 'hours'))
    this.minutesList && this.minutesList.addEventListener('scroll', this.scrollEvent.bind(this, 'minutes'))
    this.secondsList && this.secondsList.addEventListener('scroll', this.scrollEvent.bind(this, 'seconds'))
  }
  scrollEvent (type, e) {
    const st = e.target.scrollTop
    const val = Math.round(st / 32)
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
    this.hoursList.removeEventListener('scroll', this.scrollEvent.bind(this, 'hours'))
    this.minutesList.removeEventListener('scroll', this.scrollEvent.bind(this, 'minutes'))
    this.secondsList.removeEventListener('scroll', this.scrollEvent.bind(this, 'seconds'))
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
  componentWillReceiveProps (nextProps) {
    // this.completeScrollTop()
  }
  clickEvent (flag, e) {
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
  mouseOverEvent (e) {
    // this.activeEl && (this.activeEl.style.backgroundColor = 'transparent')
    this.activeEl = e.target
    // e.target.style.background = 'rgba(66,132,245,0.08)'
  }
  render () {
    const {date} = this.state
    const {hours, minutes, seconds} = deconstructDate(date)
    this.liPrefix = this.liPrefix.map((item, index) => {
      return <li className='hi-timepicker__item' key={'pre' + index} />
    })
    this.liSuffix = this.liSuffix.map((item, index) => {
      return <li className='hi-timepicker__item' key={'suf' + index} />
    })
    return (
      <div className='hi-timepicker__body'>
        <div className='hi-timepicker__timeheader'>
          <span className='hi-timepicker__mark'>时</span>
          <span className='hi-timepicker__mark'>分</span>
          <span className='hi-timepicker__mark'>秒</span>
        </div>
        <div className='hi-timepicker__timebody'>
          <ul
            ref={el => { this.hoursList = el }}
            className='hi-timepicker__list'
            onClick={this.clickEvent.bind(this, 'hours')}
            onMouseEnter={this.mouseOverEvent.bind(this)}
          >
            {this.liPrefix}
            {
              this.range(24).map((m, n) => {
                return (
                  <li
                    key={n}
                    className={n === hours ? 'hi-timepicker__item hi-timepicker__item--current' : 'hi-timepicker__item'}
                  >{m}</li>
                )
              })
            }
            {this.liSuffix}
          </ul>
          <ul
            className='hi-timepicker__list'
            ref={el => { this.minutesList = el }}
            onClick={this.clickEvent.bind(this, 'minutes')}
            onMouseEnter={this.mouseOverEvent.bind(this)}
          >
            {this.liPrefix}
            {
              this.range(60).map((m, n) => {
                return <li key={n} className={n === minutes ? 'hi-timepicker__item hi-timepicker__item--current' : 'hi-timepicker__item'}>{m}</li>
              })
            }
            {this.liSuffix}
          </ul>
          <ul
            ref={el => { this.secondsList = el }}
            className='hi-timepicker__list'
            onClick={this.clickEvent.bind(this, 'seconds')}
            onMouseEnter={this.mouseOverEvent.bind(this)}
          >
            {this.liPrefix}
            {
              this.range(60).map((m, n) => {
                return <li key={n} className={n === seconds ? 'hi-timepicker__item hi-timepicker__item--current' : 'hi-timepicker__item'}>{m}</li>
              })
            }
            {this.liSuffix}
          </ul>
          <div className='hi-timepicker__current-line' style={{top: this.props.onlyTime ? 108 : 140}} >
            {/* <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span> */}
          </div>
        </div>
      </div>
    )
  }
}
