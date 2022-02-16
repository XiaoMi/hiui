import React from 'react'
import {
  LeftOutlined,
  RightOutlined,
  DirectionRightOutlined,
  DirectionLeftOutlined,
} from '@hi-ui/icons'
import moment, { DurationInputArg1 } from 'moment'
import { UseLocaleContext } from '@hi-ui/locale-context'

const getHeaderCenterContent = (
  i18n: UseLocaleContext,
  view: string,
  renderDate: moment.Moment,
  locale = 'zh-CN'
) => {
  const _date = renderDate
  const year = _date.year()
  const month = _date.month()
  if (view === 'year') {
    return year - 4 + '~' + (year + 7)
  }
  if (view === 'month') {
    return year
  }

  const monthShortText = i18n.get('datePicker.monthShort')
  const arr = [monthShortText[month]]

  if (locale === 'zh-CN') {
    arr.unshift(year + '年    ')
  } else {
    arr.push(`    ${year}`)
  }
  return arr
}
const Header = ({
  view,
  changeView,
  onArrowEvent,
  i18n,
  panelPosition,
  renderDate,
  locale,
  prefixCls,
}: {
  view: string
  changeView: () => void
  locale?: string
  panelPosition: number
  onArrowEvent: (date: moment.Moment, position: number) => void
  i18n: UseLocaleContext
  renderDate: moment.Moment
  prefixCls: string
}) => {
  const headerChangeDateEvent = (
    flag: moment.unitOfTime.DurationConstructor,
    val: DurationInputArg1
  ) => {
    const panelDate = moment(renderDate)
    panelDate.add(val, flag)
    onArrowEvent(panelDate, panelPosition)
  }
  return (
    <div className={`${prefixCls}__header`}>
      {
        <div className={`${prefixCls}__header-btns`}>
          <span
            className={`${prefixCls}__header-icon`}
            onClick={() => headerChangeDateEvent('year', view === 'year' ? -12 : -1)}
          >
            <DirectionLeftOutlined />
          </span>
          {view !== 'year' && view !== 'month' && (
            <span
              className={`${prefixCls}__header-icon`}
              onClick={() => headerChangeDateEvent('months', -1)}
            >
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
        {getHeaderCenterContent(i18n, view, renderDate, locale)}
      </span>
      {
        <div className={`${prefixCls}__header-btns`}>
          {view !== 'year' && view !== 'month' && (
            <span
              onClick={() => headerChangeDateEvent('months', 1)}
              className={`${prefixCls}__header-icon`}
            >
              <RightOutlined />
            </span>
          )}
          <span
            onClick={() => headerChangeDateEvent('year', view === 'year' ? 12 : 1)}
            className={`${prefixCls}__header-icon`}
          >
            <DirectionRightOutlined />
          </span>
        </div>
      }
    </div>
  )
}

export default Header
