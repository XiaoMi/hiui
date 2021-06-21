import React from 'react'
import Icon from '../../icon/index'
import moment from 'moment'
const getHeaderCenterContent = (localeDatas, view, renderDate, locale = 'zh-CN') => {
  const _date = renderDate
  const year = _date.year()
  const month = _date.month()
  if (view === 'year') {
    return year - 4 + '~' + (year + 7)
  }
  if (view === 'month') {
    return year
  }
  const arr = [localeDatas.datePicker.monthShort[month]]
  if (locale === 'zh-CN') {
    arr.unshift(year + '年    ')
  } else {
    arr.push(`    ${year}`)
  }
  return arr
}
const Header = ({ view, type, changeView, onArrowEvent, localeDatas, panelPosition, renderDate, locale }) => {
  const headerChangeDateEvent = (flag, val) => {
    const panelDate = moment(renderDate)
    panelDate.add(val, flag)
    onArrowEvent(panelDate, panelPosition)
  }
  return (
    <div className="hi-datepicker__header">
      {
        <div className="hi-datepicker__header-btns">
          <span onClick={() => headerChangeDateEvent('year', view === 'year' ? -12 : -1)}>
            <Icon name="double-left" />
          </span>
          {view !== 'year' && view !== 'month' && (
            <span onClick={() => headerChangeDateEvent('months', -1)}>
              <Icon name="left" />
            </span>
          )}
        </div>
      }
      <span
        className="hi-datepicker__header-text"
        onClick={() => {
          changeView()
        }}
      >
        {getHeaderCenterContent(localeDatas, view, renderDate, locale)}
      </span>
      {
        <div className="hi-datepicker__header-btns">
          {view !== 'year' && view !== 'month' && (
            <span onClick={() => headerChangeDateEvent('months', 1)}>
              <Icon name="right" />
            </span>
          )}
          <span onClick={() => headerChangeDateEvent('year', view === 'year' ? 12 : 1)}>
            <Icon name="double-right" />
          </span>
        </div>
      }
    </div>
  )
}

export default Header
