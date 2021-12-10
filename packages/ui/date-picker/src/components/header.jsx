import React from 'react'
import { LeftOutlined, RightOutlined, DoubleRightOutlined, DoubleLeftOutlined } from '@hi-ui/icons'
import moment from 'moment'

const getHeaderCenterContent = (localeData, view, renderDate, locale = 'zh-CN') => {
  const _date = renderDate
  const year = _date.year()
  const month = _date.month()
  if (view === 'year') {
    return year - 4 + '~' + (year + 7)
  }
  if (view === 'month') {
    return year
  }
  const arr = [localeData.datePicker.monthShort[month]]
  if (locale === 'zh-CN') {
    arr.unshift(year + '年    ')
  } else {
    arr.push(`    ${year}`)
  }
  return arr
}
const Header = ({
  view,
  type,
  changeView,
  onArrowEvent,
  localeData,
  panelPosition,
  renderDate,
  locale,
  prefixCls,
}) => {
  const headerChangeDateEvent = (flag, val) => {
    const panelDate = moment(renderDate)
    panelDate.add(val, flag)
    onArrowEvent(panelDate, panelPosition)
  }
  return (
    <div className={`${prefixCls}__header`}>
      {
        <div className={`${prefixCls}__header-btns`}>
          <span onClick={() => headerChangeDateEvent('year', view === 'year' ? -12 : -1)}>
            <DoubleLeftOutlined />
          </span>
          {view !== 'year' && view !== 'month' && (
            <span onClick={() => headerChangeDateEvent('months', -1)}>
              <LeftOutlined />
            </span>
          )}
        </div>
      }
      <span
        className={`${prefixCls}__header-text`}
        onClick={() => {
          changeView()
        }}
      >
        {getHeaderCenterContent(localeData, view, renderDate, locale)}
      </span>
      {
        <div className={`${prefixCls}__header-btns`}>
          {view !== 'year' && view !== 'month' && (
            <span onClick={() => headerChangeDateEvent('months', 1)}>
              <RightOutlined />
            </span>
          )}
          <span onClick={() => headerChangeDateEvent('year', view === 'year' ? 12 : 1)}>
            <DoubleRightOutlined />
          </span>
        </div>
      }
    </div>
  )
}

export default Header
