import React from 'react'
import {
  LeftOutlined,
  RightOutlined,
  DirectionRightOutlined,
  DirectionLeftOutlined,
} from '@hi-ui/icons'
import moment, { DurationInputArg1 } from 'moment'
import { UseLocaleContext, useGlobalContext } from '@hi-ui/core'

const getHeaderCenterContent = (
  i18n: UseLocaleContext,
  view: string,
  renderDate: moment.Moment,
  locale = 'zh-CN',
  isRtl = false
) => {
  const _date = renderDate
  const year = _date.year()
  const month = _date.month()
  if (view === 'year') {
    const startYear = year - 4
    const endYear = year + 7
    return isRtl ? `${endYear}~${startYear}` : `${startYear}~${endYear}`
  }
  if (view === 'month' || view === 'quarter') {
    return year
  }

  const monthShortText = i18n.get('datePicker.monthShort')
  const arr = [monthShortText[month]]
  const yearFirst = locale === 'zh-CN' ? !isRtl : isRtl

  if (yearFirst) {
    arr.unshift(locale === 'zh-CN' ? `${year}年    ` : `${year}    `)
  } else {
    arr.push(locale === 'zh-CN' ? `    ${year}年` : `    ${year}`)
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
  const { direction } = useGlobalContext()
  const isRtl = direction === 'rtl'

  return (
    <div className={`${prefixCls}__header`}>
      {
        <div className={`${prefixCls}__header-btns`}>
          <span
            className={`${prefixCls}__header-icon`}
            onClick={() => headerChangeDateEvent('year', view === 'year' ? -12 : -1)}
          >
            {isRtl ? <DirectionRightOutlined /> : <DirectionLeftOutlined />}
          </span>
          {view !== 'year' && view !== 'month' && view !== 'quarter' && (
            <span
              className={`${prefixCls}__header-icon`}
              onClick={() => headerChangeDateEvent('months', -1)}
            >
              {isRtl ? <RightOutlined /> : <LeftOutlined />}
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
        {getHeaderCenterContent(i18n, view, renderDate, locale, isRtl)}
      </span>
      {
        <div className={`${prefixCls}__header-btns`}>
          {view !== 'year' && view !== 'month' && view !== 'quarter' && (
            <span
              onClick={() => headerChangeDateEvent('months', 1)}
              className={`${prefixCls}__header-icon`}
            >
              {isRtl ? <LeftOutlined /> : <RightOutlined />}
            </span>
          )}
          <span
            onClick={() => headerChangeDateEvent('year', view === 'year' ? 12 : 1)}
            className={`${prefixCls}__header-icon`}
          >
            {isRtl ? <DirectionLeftOutlined /> : <DirectionRightOutlined />}
          </span>
        </div>
      }
    </div>
  )
}

export default Header
