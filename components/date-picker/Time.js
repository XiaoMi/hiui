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
    this.liPrefix = props.onlyTime ? [<li key='p0' />, <li key='p1' />] : [<li key='p0' />, <li key='p1' />, <li key='p2' />]
    this.liSuffix = props.onlyTime ? [<li key='p3' />, <li key='p4' />] : [<li key='p3' />, <li key='p4' />, <li key='p5' />]
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
    const val = Math.round(st / 38)
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
    const dVal = 38
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
    this.activeEl && (this.activeEl.style.background = 'white')
    this.activeEl = e.target
    e.target.style.background = '#F2F2F2'
  }
  render () {
    const {date} = this.state
    const {hours, minutes, seconds} = deconstructDate(date)
    return (
      <div className='hi-timepicker-timebody'>
        <ul ref={el => { this.hoursList = el }}
          onClick={this.clickEvent.bind(this, 'hours')}
          onMouseEnter={this.mouseOverEvent.bind(this)}
        >
          {this.liPrefix}
          {
            this.range(24).map((m, n) => {
              return (
                <li
                  key={n}
                  className={n === hours ? 'current' : ''}
                >{m}</li>
              )
            })
          }
          {this.liSuffix}
        </ul>
        <ul ref={el => { this.minutesList = el }} onClick={this.clickEvent.bind(this, 'minutes')} onMouseEnter={this.mouseOverEvent.bind(this)}>
          {this.liPrefix}
          {
            this.range(60).map((m, n) => {
              return <li key={n} className={n === minutes ? 'current' : ''}>{m}</li>
            })
          }
          {this.liSuffix}
        </ul>
        <ul ref={el => { this.secondsList = el }} onClick={this.clickEvent.bind(this, 'seconds')} onMouseEnter={this.mouseOverEvent.bind(this)}>
          {this.liPrefix}
          {
            this.range(60).map((m, n) => {
              return <li key={n} className={n === seconds ? 'current' : ''}>{m}</li>
            })
          }
          {this.liSuffix}
        </ul>
        <div className='current_line' style={{top: this.props.onlyTime ? 76 : 114}} />
      </div>
    )
  }
}
