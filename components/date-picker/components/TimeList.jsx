import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import Icon from '../../icon/index'

const PREFIXCOUNT = [1, 2, 3]
const PREFIX = PREFIXCOUNT.map((item, index) => {
  return <li className="hi-timepicker__item hi-timepikcer__item--empty" key={'pre' + index} />
})
const SUFFIX = PREFIXCOUNT.map((item, index) => {
  return <li className="hi-timepicker__item hi-timepikcer__item--empty" key={'suf' + index} />
})
const TimeList = ({ type, datas, value, disabledList, onSelect, hourStep, minuteStep, secondStep }) => {
  const listRef = useRef(null)
  const timeRef = useRef(null)
  const topValue1 = useRef(null)
  const topValue2 = useRef(null)
  const [showArrow, setShowArrow] = useState(false)
  const clickEvent = (e) => {
    e.stopPropagation()
    const li = e.target
    if (li.nodeName !== 'LI') return false
    if (!li.textContent) return
    !getdisabledType(parseInt(li.textContent)) && onSelect(type, parseInt(li.textContent), e)
  }
  const isScrollStop = (val, el) => {
    topValue2.current = el.scrollTop
    if (topValue1.current === topValue2.current) {
      el.scrollTop = val * 32
      if (!disabledList.includes(val)) {
        const arrow = getStep()
        !getdisabledType(val) && onSelect(type, val * arrow)
      }
    }
  }
  const scrollTo = () => {
    const arrow = getStep()
    const padding = 32
    const dVal = padding / arrow
    listRef.current && (listRef.current.scrollTop = value * dVal)
  }
  useEffect(() => {
    scrollTo()
  }, [value])
  const getdisabledType = (val) => {
    let isDisabled = false
    datas.forEach((data) => {
      if (data.value === val) {
        isDisabled = data.disabled
      }
    })
    return isDisabled
  }
  const getStep = (direction) => {
    const directionStep = direction && direction === 'up' ? -1 : 1
    let step = directionStep

    switch (type) {
      case 'hour':
        step = hourStep
        break
      case 'minute':
        step = minuteStep
        break
      case 'second':
        step = secondStep
        break
      default:
        step = directionStep
        break
    }
    if (Number.isNaN(step) || step === -1) {
      step = 1
    }
    return step * directionStep
  }
  const scrollEvent = (e) => {
    e.persist()
    clearTimeout(timeRef.current)
    const st = e.target.scrollTop
    topValue1.current = st
    const val = Math.round(st / 32)
    if ((type === 'hour' && val > 23) || ((type === 'minute' || type === 'second') && val > 59)) {
      return false
    }
    timeRef.current = setTimeout(() => isScrollStop(val, e.target), 200)
  }
  const renderArrow = () => {
    return (
      <React.Fragment>
        <span className="hi-timepicker__page-turn" onClick={() => arrowEvent('up')}>
          <Icon name="up" />
        </span>
        <span className="hi-timepicker__page-turn" onClick={() => arrowEvent('down')}>
          <Icon name="down" />
        </span>
      </React.Fragment>
    )
  }
  const arrowEvent = (direction) => {
    const arrow = getStep(direction)
    const st = listRef.current.scrollTop
    const val = Math.round((st * Math.abs(arrow)) / 32)
    onSelect(type, val + arrow, arrow)
  }
  return (
    <div
      className="hi-timepicker__list-container"
      onMouseEnter={() => setShowArrow(true)}
      onMouseLeave={() => setShowArrow(false)}
    >
      <ul ref={listRef} className={`hi-timepicker__list`} onClick={clickEvent} onScroll={(e) => scrollEvent(e)}>
        {PREFIX}
        {datas.map((data, index) => {
          const _class = classNames(
            'hi-timepicker__item',
            data.current && 'hi-timepicker__item--current',
            data.disabled && 'hi-timepicker__item--disabled'
          )
          return (
            <li key={index} className={_class} value={parseInt(data.text)}>
              {data.text}
            </li>
          )
        })}
        {SUFFIX}
      </ul>
      {showArrow && renderArrow()}
    </div>
  )
}

export default TimeList
