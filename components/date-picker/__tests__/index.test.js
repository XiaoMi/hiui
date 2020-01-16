import React from 'react'
import { mount } from 'enzyme'
import Datepicker from '../index'
import Timepicker from '../TimePicker'
import { DatePicker } from '../DatePicker'
import { getDate, subDays, getYear, getMonth, subMonths, addDays, startOfWeek, endOfWeek, addHours, dateFormat, compatibleFormatString } from '../dateUtil'
import { nextMonth, deconstructDate, getPRCDate } from '../util'
import { isVaildDate } from '../constants'
import util from '../util'
import sinon,{spy} from 'sinon'
/* eslint-env jest */

const mockDate = new Date('2019-11-20 12:00:00')
const mockMinDate = subDays(mockDate, 3)
const mockMaxDate = addDays(mockDate, 3)
const mockCurrentDay = getDate(mockDate)
const mockCurrentYear = getYear(mockDate)
const mockCurrentMonth = getMonth(mockDate) + 1 // 1~12
const realCurrentDay = getDate(new Date())
describe('Datepicker', () => {
  describe('PropTypes', () => {
    it('type', () => {
      const types = ['date', 'daterange', 'month', 'year', 'week', 'weekrange', 'timeperiod']
      const wrapper = mount(
        <div>
          {
            types.map((type, index) => <Datepicker type={type} key={index} />)
          }
        </div>
      )
      types.map((type, index) => {
        // var expectLen = type.includes('range') ? 2 : 1
        // wrapper.find('.hi-datepicker__input').at(index).childAt(0).simulate('focus')
        expect(wrapper.find(`.hi-datepicker__input--${type}`)).toHaveLength(1)
        // expect(document.querySelectorAll('.hi-datepicker')).toHaveLength(1)
        // expect(document.querySelectorAll(`.hi-datepicker__calender-container--${type}`)).toHaveLength(expectLen)
        // document.body.click()
      })
      
    })
    it('date', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='date' onChange={callback}/>
      )
      expect(wrapper.find('input').getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      wrapper.find('input').simulate('focus')
      expect(wrapper.find('td.current').find('span').text()).toEqual(realCurrentDay.toString())
      // string
      wrapper.setProps({value: '2019-11-20'})
      expect(wrapper.find('td.current').find('span').text()).toEqual('20')
      // number
      wrapper.setProps({value: mockDate.getTime()})
      expect(wrapper.find('td.current').find('span').text()).toEqual(mockCurrentDay.toString())
      wrapper.setProps({value: undefined})
      expect(wrapper.find('td.current').find('span').text()).toEqual(realCurrentDay.toString())
      wrapper.setProps({value: null})
      expect(wrapper.find('td.current').find('span').text()).toEqual(realCurrentDay.toString())
      wrapper.setProps({value: mockDate})
      expect(wrapper.find('td.current').find('span').text()).toEqual(mockCurrentDay.toString())
      wrapper.find(`.hi-datepicker__panel--left td[value=${15}]:not(.prev):not(.next)`).simulate('click')
      expect(callback).toHaveBeenCalled()
      wrapper.find('input').simulate('focus')
      // 月份减少
      wrapper.find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('10月'))
      // 月份增加
      wrapper.find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('11月'))
      // 年份份减少
      wrapper.find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 年份增加
      wrapper.find('.hi-datepicker__header-btns').at(1).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2019年'))
      // 日期面板中点击header 事件
      wrapper.find('.hi-datepicker__header-text').simulate('click')
      expect(wrapper.find('.hi-datepicker__calender-container--year')).toHaveLength(1)
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${2019}]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()
      wrapper.find(`.hi-datepicker__panel--left td[value=${2018}]:not(.prev):not(.next)`).simulate('click')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${11}]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()
      wrapper.find(`.hi-datepicker__panel--left td[value=${11}]:not(.prev):not(.next)`).simulate('click')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${15}]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()

      // 英文 header
      wrapper.setProps({showPanel: false, locale: 'en-US'})
      wrapper.find('input').at(0).simulate('focus')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.not.stringContaining('年'))
    })
    it('altCalendarPreset',()=>{
      const mockTime = new Date('2020-01-14')
      const wrapper = mount(
        <Datepicker value={mockTime} altCalendarPreset = 'zh-CN'/>
      )
      setTimeout(()=>{
        wrapper.find('input').simulate('focus')
        expect(wrapper.find('.hi-datepicker__cell--large')).toHaveLength(42)
        expect(wrapper.find('.hi-datepicker__text--showLunar[value=14]').text()).toEqual('二十')
      },500)

    })
    it('altCalendar',()=>{
      const mockTime = new Date('2020-01-14')
      const wrapper = mount(
        <Datepicker 
          value={mockTime} 
          altCalendar={[
              {
                date:'2020/1/14',
                text:'测试日'
              }
          ]}
        />
      )

      wrapper.find('input').simulate('focus')
      expect(wrapper.find('.hi-datepicker__text--showLunar[value=14]').text()).toEqual('测试日')
    })
    it('dateMarkPreset',()=>{
      const mockTime = new Date('2020-10-01')
      const wrapper = mount(
        <Datepicker 
          value={mockTime} 
          dateMarkPreset  = 'zh-CN'
        />
      )
      setTimeout(()=>{
        wrapper.find('input').simulate('focus')
        expect(wrapper.find('.current').find('span').last().text()).toEqual('休')
      },500)
    })
    it('dateMarkRender',()=>{
      const mockTime = new Date('2020-1-14')
      const wrapper = mount(
        <Datepicker 
          value={mockTime} 
          dateMarkPreset = 'zh-CN'
          dateMarkRender = {
            (currentDate) => {
              const date = Datepicker.format(currentDate, 'yyyy/M/D')

              if(date == '2020/1/14'){
                  return (
                    <span style={{color:'#fa0'}}>班</span>
                  )
              } else {
                  return null
              }
            }
        }
        />
      )
      wrapper.find('input').simulate('focus')
      expect(wrapper.find('.current').find('span').last().text()).toEqual('班')
    })
    
    it('week', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='week' onChange={callback} />
      )
      expect(wrapper.find('input').getDOMNode().getAttribute('value')).toEqual('')
      // expect(wrapper.find('input').getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      wrapper.find('input').simulate('focus')
      expect(wrapper.find(`td[value=${realCurrentDay}]:not(.prev):not(.next)`).hasClass('in-range')).toBeTruthy()
      expect(wrapper.find('.hi-datepicker__row--current-week').childAt(0).hasClass('range-se')).toBeTruthy()
      expect(wrapper.find('.hi-datepicker__row--current-week').childAt(6).hasClass('range-se')).toBeTruthy()
      // TODO: week 时 传入字符串不能被正确解析
      const prevWeekDate = subDays(mockDate, 7)
      wrapper.setProps({ value: prevWeekDate })
      expect(wrapper.find(`td[value=${getDate(prevWeekDate)}]`).hasClass('in-range')).toBeTruthy()
      // 点击
      wrapper.find('.hi-datepicker__calender').simulate('click', { target: wrapper.find(`td[value=${getDate(mockDate)}]`).getDOMNode() })
      expect(callback).toHaveBeenCalled()
      wrapper.find('input').simulate('focus')
      expect(wrapper.find(`td[value=${getDate(mockDate)}]`).hasClass('in-range')).toBeTruthy()
    })
    it('year', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='year' onChange={callback} value={mockDate}/>
      )
      expect(wrapper.find('input').getDOMNode().getAttribute('value')).toEqual('2019')
      expect(wrapper.find('input').getDOMNode().getAttribute('placeholder')).toEqual('请选择年')
      wrapper.find('input').simulate('focus')
      expect(wrapper.find(`td[value=${mockCurrentYear}]`).hasClass('current')).toBeTruthy()
      wrapper.setProps({ value: (mockCurrentYear - 1) + '' })
      expect(wrapper.find(`td[value=${(mockCurrentYear - 1) + ''}]`).hasClass('current')).toBeTruthy()
      wrapper.find('.hi-datepicker__calender').simulate('click', { target: wrapper.find(`td[value=${mockCurrentYear}]`).getDOMNode() })
      expect(callback).toHaveBeenCalled()
      // expect(callback).toHaveBeenCalledWith(new Date(), mockCurrentYear)
      wrapper.find('input').simulate('focus')
      expect(wrapper.find(`td[value=${mockCurrentYear}]`).hasClass('current')).toBeTruthy()
      wrapper.find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find(`td[value=${mockCurrentYear + 10 + ''}]`).hasClass('current')).toBeTruthy()
    })
    it('month', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='month' onChange={callback} value={mockDate}/>
      )
      expect(wrapper.find('input').getDOMNode().getAttribute('value')).toEqual('2019-11')
      expect(wrapper.find('input').getDOMNode().getAttribute('placeholder')).toEqual('请选择月')
      wrapper.find('input').simulate('focus')
      expect(wrapper.find(`td[value=${(mockCurrentMonth + 1)+ ''}]`).hasClass('current')).toBeFalsy()
      wrapper.setProps({ value: subMonths(mockDate, 1) })
      expect(wrapper.find(`td[value=${(mockCurrentMonth - 1) + ''}]`).hasClass('current')).toBeTruthy()
      wrapper.find('.hi-datepicker__calender').simulate('click', { target: wrapper.find(`td[value=${mockCurrentMonth}]`).getDOMNode() })
      expect(callback).toHaveBeenCalled()
      // // expect(callback).toHaveBeenCalledWith(new Date(), mockCurrentYear)
      wrapper.find('input').simulate('focus')
      expect(wrapper.find(`td[value=${mockCurrentMonth}]`).hasClass('current')).toBeTruthy()

      wrapper.find('.hi-datepicker__header-text').simulate('click')
      expect(wrapper.find('td').first().text()).toEqual('2015')
      expect(wrapper.find('td').last().text()).toEqual('2026')
    })
    it('daterange', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='daterange' onChange={callback} />
      )
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${realCurrentDay}]:not(.prev):not(.next)`).hasClass('today')).toBeTruthy()
      wrapper.find('.hi-datepicker__header-text').first().simulate('click')
      const year = new Date().getFullYear()
      expect(wrapper.find('.hi-datepicker__header-text').first().text()).toEqual(`${year - 4}~${year + 7}`)
      wrapper.find(`.hi-datepicker__panel--left td[value=${year + 1}]:not(.prev):not(.next)`).simulate('click')
      expect(wrapper.find('.hi-datepicker__calender-container--month')).toHaveLength(1)
      wrapper.find(`.hi-datepicker__panel--left td[value=12]:not(.prev):not(.next)`).simulate('click')
      expect(wrapper.find('.hi-datepicker__header-text').first().text()).toEqual(`${year +1}年    12月`)
      // value 为 Date 实例的情况
      wrapper.setProps({ value: mockDate })
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('2019-11-20')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('value')).toEqual('2019-11-20')
      wrapper.find(DatePicker).setState({showPanel: false})
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=20]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()

      // value 为 {start: Date, end: Date}
      const rangeEnd = addDays(mockDate, 30)
      wrapper.setProps({ value: {start: mockDate, end: rangeEnd} })
      wrapper.find(DatePicker).setState({showPanel: false})
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${mockCurrentDay}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()
      expect(wrapper.find(`.hi-datepicker__panel--right td[value=${getDate(rangeEnd)}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()

      wrapper.setProps({disabled: true})
      expect(wrapper.find('.hi-datepicker__input').hasClass('hi-datepicker__input--disabled'))
      wrapper.setProps({disabled: false})
      // 左侧日历 header 点击事件
      // 月份减少
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('10月'))
      // 月份增加
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('11月'))
      // 月份增加至右侧面板月份
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('11月'))
      // 年份增加
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(1).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2019年'))
      // // 年份减少
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 右侧日历 header 点击事件
      // 年份减少
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 再次点击年份减少，不能小于左侧年份
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 右侧月份减少
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('12月'))
      // 先加后减（右侧月份）
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')

      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringMatching(/2019年\s+1月/))
      // 年份增加
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(1).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2020年'))
      // Pick
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__calender').simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${11}]:not(.prev):not(.next)`).getDOMNode()})
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${11}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__calender').simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${12}]:not(.prev):not(.next)`).getDOMNode()})
      expect(wrapper.find('.hi-datepicker__panel')).toHaveLength(0)
      expect(callback).toHaveBeenCalled()
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('2018-11-11')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('value')).toEqual('2020-01-12')

      wrapper.setProps({ value: mockDate })
      wrapper.find('input').first().simulate('focus')
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__calender').simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate)}]:not(.prev):not(.next)`).getDOMNode()})
      wrapper.find('.hi-datepicker__calender').at(0).simulate('mouseMove', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate) + 1}]:not(.prev):not(.next)`).find('span').getDOMNode()})
      wrapper.find('.hi-datepicker__calender').at(0).simulate('mouseMove', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate) + 2}]:not(.prev):not(.next)`).find('span').getDOMNode()})
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate) + 1}]:not(.prev):not(.next)`).hasClass('in-range')).toBeTruthy()
      // 英文 header
      wrapper.setProps({showPanel: false, locale: 'en-US'})
      wrapper.find('input').at(0).simulate('focus')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.not.stringContaining('年'))
    })
    it('weekrange', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='weekrange' onChange={callback} />
      )
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('placeholder')).toEqual('请选择周')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('placeholder')).toEqual('请选择周')
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${realCurrentDay}]:not(.prev):not(.next)`).hasClass('today')).toBeTruthy()
      wrapper.find('.hi-datepicker__header-text').first().simulate('click')
      const year = new Date().getFullYear()
      expect(wrapper.find('.hi-datepicker__header-text').first().text()).toEqual(`${year - 4}~${year + 7}`)
      wrapper.find(`.hi-datepicker__panel--left td[value=${year + 1}]:not(.prev):not(.next)`).simulate('click')
      expect(wrapper.find('.hi-datepicker__calender-container--month')).toHaveLength(1)
      wrapper.find(`.hi-datepicker__panel--left td[value=12]:not(.prev):not(.next)`).simulate('click')
      expect(wrapper.find('.hi-datepicker__header-text').first().text()).toEqual(`${year +1}年    12月`)
      
      // value 为 Date 实例的情况
      wrapper.setProps({ value: mockDate })
      wrapper.find(DatePicker).setState({showPanel: false})
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(startOfWeek(mockDate))}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(endOfWeek(mockDate))}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()

      // value 为 {start: Date, end: Date}
      wrapper.find(DatePicker).setState({showPanel: false})
      const rangeEnd = addDays(mockDate, 30)
      wrapper.setProps({ value: {start: mockDate, end: rangeEnd} })
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${mockCurrentDay}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()
      expect(wrapper.find(`.hi-datepicker__panel--right td[value=${getDate(rangeEnd)}]:not(.prev):not(.next)`).hasClass('range-se')).toBeTruthy()

      // 左侧日历 header 点击事件
      // 月份减少
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('10月'))
      // 月份增加
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('11月'))
      // 月份增加至右侧面板月份
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('11月'))
      // 年份增加
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(1).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2019年'))
      // // 年份减少
      wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 右侧日历 header 点击事件
      // 年份减少
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 再次点击年份减少，不能小于左侧年份
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2018年'))
      // 右侧月份减少
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('12月'))
      // 先加后减（右侧月份）
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(0).childAt(1).simulate('click')

      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(1).childAt(0).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringMatching(/2019年\s+1月/))
      // 年份增加
      wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-btns').at(1).childAt(1).simulate('click')
      expect(wrapper.find('.hi-datepicker__panel--right').find('.hi-datepicker__header-text').text()).toEqual(expect.stringContaining('2020年'))

      wrapper.find('.hi-datepicker__calender').at(0).simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate)}]:not(.prev):not(.next)`).getDOMNode()})
      wrapper.find('.hi-datepicker__calender').at(0).simulate('mouseMove', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate) + 1}]:not(.prev):not(.next)`).find('span').getDOMNode()})
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockDate) + 1}]:not(.prev):not(.next)`).hasClass('in-range')).toBeTruthy()
      wrapper.find('.hi-datepicker__calender').at(1).simulate('click', {target: wrapper.find(`.hi-datepicker__panel--right td[value=${getDate(mockDate)}]:not(.prev):not(.next)`).getDOMNode()})
      expect(callback).toHaveBeenCalled()
      // 英文 header
      wrapper.setProps({showPanel: false, locale: 'en-US'})
      wrapper.find('input').at(0).simulate('focus')
      expect(wrapper.find('.hi-datepicker__panel--left').find('.hi-datepicker__header-text').text()).toEqual(expect.not.stringContaining('年'))
    })
    it('timeperiod', () => {
      const callback = jest.fn()
      jest.useFakeTimers()
      const wrapper = mount(
        <Datepicker type='timeperiod' onChange={callback} />
      )
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('value')).toEqual('')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${realCurrentDay}]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()
      // value 为 Date 实例的情况
      wrapper.setProps({ value: mockDate })
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('2019-11-20 12:00:00')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('value')).toEqual('2019-11-20 16:00:00')
      wrapper.find(DatePicker).setState({showPanel: false})
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=20]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()
      expect(wrapper.find('.hi-datepicker__period-item').at(3).hasClass('hi-datepicker__period-item--active')).toBeTruthy()
      // value 为 {start: Date, end: Date}
      const rangeEnd = addHours(mockDate, 4)
      wrapper.setProps({ value: {start: mockDate, end: rangeEnd} })
      wrapper.find(DatePicker).setState({showPanel: false})
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=20]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()
      expect(wrapper.find('.hi-datepicker__period-item').at(3).hasClass('hi-datepicker__period-item--active')).toBeTruthy()

      wrapper.find('.hi-datepicker__calender').simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=14]:not(.prev):not(.next)`).getDOMNode()})
      wrapper.find('.hi-datepicker__period-item').at(3).simulate('click')
      document.body.click()
      expect(callback).toHaveBeenCalled()
      wrapper.find('input').first().simulate('focus')
      wrapper.setProps({timeInterval: 120})
      expect(wrapper.find('.hi-datepicker__period-item')).toHaveLength(12)
      wrapper.setProps({timeInterval: 30})
      expect(wrapper.find('.hi-datepicker__period-item')).toHaveLength(48)
      jest.runAllTimers()
    })
    it('minDate&maxDate', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <div>
          <Datepicker type='date' min={mockMinDate} onChange={callback} value={mockDate}/>
          <Datepicker type='date' max={mockMaxDate} onChange={callback} value={mockDate}/>
          <Datepicker type='date' min={mockMinDate} max={mockMaxDate} onChange={callback} value={mockDate}/>
        </div>
      )
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMinDate) - 1}]:not(.prev):not(.next)`).hasClass('disabled')).toBeTruthy()
      wrapper.find('.hi-datepicker__calender').simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMinDate) - 1}]:not(.prev):not(.next)`).getDOMNode()})
      expect(callback).not.toHaveBeenCalled()
      wrapper.find('input').at(1).simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMaxDate) + 1}]:not(.prev):not(.next)`).at(1).hasClass('disabled')).toBeTruthy()
      wrapper.find('.hi-datepicker__calender').at(1).simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMaxDate) + 1}]:not(.prev):not(.next)`).at(1).getDOMNode()})
      expect(callback).not.toHaveBeenCalled()
      wrapper.find('input').at(2).simulate('focus')
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMinDate) - 1}]:not(.prev):not(.next)`).at(2).hasClass('disabled')).toBeTruthy()
      expect(wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMaxDate) + 1}]:not(.prev):not(.next)`).at(2).hasClass('disabled')).toBeTruthy()
      wrapper.find('.hi-datepicker__calender').at(2).simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMinDate) - 1}]:not(.prev):not(.next)`).at(2).getDOMNode()})
      expect(callback).not.toHaveBeenCalled()
      wrapper.find('.hi-datepicker__calender').at(2).simulate('click', {target: wrapper.find(`.hi-datepicker__panel--left td[value=${getDate(mockMaxDate) + 1}]:not(.prev):not(.next)`).at(2).getDOMNode()})
      expect(callback).not.toHaveBeenCalled()
    })
    it('disabled', () => {
      const wrapper = mount(
        <Datepicker type='date' disabled />
      )
      expect(wrapper.find('.hi-datepicker__input--disabled')).toHaveLength(1)
      wrapper.setProps({disabled: false})
      expect(wrapper.find('.hi-datepicker__input--disabled')).toHaveLength(0)
    })
    it('clearable', () => {
      const wrapper = mount(
        <Datepicker type='date' value={mockDate} />
      )
      wrapper.find('input').simulate('focus')
      expect(wrapper.find('.hi-datepicker__input-icon').hasClass('clear')).toBeTruthy()
      wrapper.find('.hi-datepicker__input-icon').simulate('click')
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('value')).toEqual('')
      wrapper.setProps({clearable: false})
      wrapper.find('input').simulate('focus')
      expect(wrapper.find('.hi-datepicker__input-icon').hasClass('clear')).toBeFalsy()
      expect(wrapper.find('.hi-datepicker__input-icon').hasClass('icon-date')).toBeTruthy()
    })
    it('shortcuts', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='daterange' onChange={callback} value={mockDate} shortcuts={['近一周', '近一月', '近三月', '近一年']} />
      )
      wrapper.find('input').first().simulate('focus')
      expect(wrapper.find('.hi-datepicker__shortcuts')).toHaveLength(1)
      wrapper.find('.hi-datepicker__shortcuts').childAt(0).simulate('click', {target: {innerText: '近一周'}})
      expect(callback).toHaveBeenCalled()
      wrapper.find('input').first().simulate('focus')
      wrapper.find('.hi-datepicker__shortcuts').childAt(1).simulate('click', {target: {innerText: '近一月'}})
      expect(callback).toHaveBeenCalled()
      wrapper.find('input').first().simulate('focus')
      wrapper.find('.hi-datepicker__shortcuts').childAt(2).simulate('click', {target: {innerText: '近三月'}})
      expect(callback).toHaveBeenCalled()
      wrapper.find('input').first().simulate('focus')
      wrapper.find('.hi-datepicker__shortcuts').childAt(3).simulate('click', {target: {innerText: '近一年'}})
      expect(callback).toHaveBeenCalled()
    })
    it('placeholder', () => {
      const wrapper = mount(
        <div>
          <Datepicker type='daterange' />
          <Datepicker type='daterange' placeholder='请选择' />
          <Datepicker type='daterange' placeholder={['请选择']} />
          <Datepicker type='daterange' placeholder={['请选择开始日期', '请选择结束日期']} />
        </div>
      )
      expect(wrapper.find('input').at(0).getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      expect(wrapper.find('input').at(1).getDOMNode().getAttribute('placeholder')).toEqual('请选择日期')
      expect(wrapper.find('input').at(2).getDOMNode().getAttribute('placeholder')).toEqual('请选择')
      expect(wrapper.find('input').at(3).getDOMNode().getAttribute('placeholder')).toEqual('请选择')
      expect(wrapper.find('input').at(4).getDOMNode().getAttribute('placeholder')).toEqual('请选择')
      expect(wrapper.find('input').at(5).getDOMNode().getAttribute('placeholder')).toEqual('请选择')
      expect(wrapper.find('input').at(6).getDOMNode().getAttribute('placeholder')).toEqual('请选择开始日期')
      expect(wrapper.find('input').at(7).getDOMNode().getAttribute('placeholder')).toEqual('请选择结束日期')
    })
    it('showTime', () => {
      const wrapper = mount(
        <div>
          <Datepicker type='date' showTime />
          <Datepicker type='daterange' showTime />
        </div>
      )
      expect(wrapper.find('.hi-datepicker__input-icon').at(0).hasClass('icon-time')).toBeTruthy()
      expect(wrapper.find('.hi-datepicker__input-icon').at(1).hasClass('icon-time')).toBeTruthy()
      wrapper.find('input').at(0).simulate('focus')
      expect(wrapper.find('.hi-timepicker')).toHaveLength(1)
      wrapper.find('input').at(1).simulate('focus')
      expect(wrapper.find('.hi-datepicker__footer')).toHaveLength(1)
      wrapper.find('.hi-datepicker__footer').simulate('click')
      expect(wrapper.find('.hi-datepicker__mask')).toHaveLength(1)
      expect(wrapper.find('.hi-timepicker--timerange')).toHaveLength(1)
      wrapper.find('.hi-timepicker__list').at(0).simulate('click', {type: 'hours', target: wrapper.find('.hi-timepicker__list').at(0).find('.hi-timepicker__item').at(17).getDOMNode()})
      // TODO: 验证日期范围下的时间更改结果
      // expect(wrapper.find('.hi-datepicker__time-text').text()).toEqual(expect.stringMatching(/00:\s+/))
      wrapper.find('.hi-datepicker__mask').simulate('click')
      expect(wrapper.find('.hi-datepicker__mask')).toHaveLength(0)
      expect(wrapper.find('.hi-timepicker--timerange')).toHaveLength(0)
    })
    it('weekOffset', () => {
      const wrapper = mount(
        <Datepicker type='week' weekOffset={1} />
      )
      wrapper.find('input').simulate('focus')
      expect(wrapper.find('th').at(0).text()).toEqual('一')
    })
    it('time', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Timepicker onChange={callback} />
      )
      wrapper.find('input').simulate('focus')
      document.body.click()
      expect(callback).toHaveBeenCalled()

      // 禁用小时
      wrapper.setProps({disabledHours: [2, 3, 4, 5, 6, 7]})
      wrapper.find('input').simulate('focus')
      expect(wrapper.find('.hi-timepicker__list').at(0).find('li[value=2]').hasClass('hi-timepicker__item--disabled')).toBeTruthy()
      wrapper.setProps({disabledHours: () => [3]})
      expect(wrapper.find('.hi-timepicker__list').at(0).find('li[value=2]').hasClass('hi-timepicker__item--disabled')).toBeFalsy()
      expect(wrapper.find('.hi-timepicker__list').at(0).find('li[value=3]').hasClass('hi-timepicker__item--disabled')).toBeTruthy()
      wrapper.find('.hi-timepicker__list').at(0).find('li[value=3]').simulate('click')
      wrapper.setProps({disabledHours: () => null})
      expect(wrapper.find('.hi-timepicker__list').at(0).children('.hi-timepicker__item--disabled')).toHaveLength(0)

      // 禁用分钟
      wrapper.setProps({disabledHours: [2], disabledMinutes: [2]})
      expect(wrapper.find('.hi-timepicker__list').at(1).find('li[value=2]').hasClass('hi-timepicker__item--disabled')).toBeTruthy()
      wrapper.setProps({disabledMinutes: () => [3]})
      expect(wrapper.find('.hi-timepicker__list').at(1).find('li[value=2]').hasClass('hi-timepicker__item--disabled')).toBeFalsy()
      expect(wrapper.find('.hi-timepicker__list').at(1).find('li[value=3]').hasClass('hi-timepicker__item--disabled')).toBeTruthy()
      wrapper.find('.hi-timepicker__list').at(1).find('li[value=3]').simulate('click')
      wrapper.setProps({disabledMinutes: () => null})
      expect(wrapper.find('.hi-timepicker__list').at(1).children('.hi-timepicker__item--disabled')).toHaveLength(0)

      // 禁用分钟
      wrapper.setProps({disabledHours: [2], disabledMinutes: [2], disabledSeconds: [2]})
      expect(wrapper.find('.hi-timepicker__list').at(2).find('li[value=2]').hasClass('hi-timepicker__item--disabled')).toBeTruthy()
      wrapper.setProps({disabledSeconds: () => [3]})
      expect(wrapper.find('.hi-timepicker__list').at(2).find('li[value=2]').hasClass('hi-timepicker__item--disabled')).toBeFalsy()
      expect(wrapper.find('.hi-timepicker__list').at(2).find('li[value=3]').hasClass('hi-timepicker__item--disabled')).toBeTruthy()
      wrapper.find('.hi-timepicker__list').at(2).find('li[value=3]').simulate('click')
      wrapper.setProps({disabledSeconds: () => null})
      expect(wrapper.find('.hi-timepicker__list').at(2).children('.hi-timepicker__item--disabled')).toHaveLength(0)
    })
    it('timerange', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Timepicker type='timerange' onChange={callback} />
      )
      wrapper.find('input').at(0).simulate('focus')
      wrapper.find('.hi-timepicker__list').at(0).simulate('click', {target: wrapper.find('.hi-timepicker__list').at(0).find('li[value=2]').getDOMNode()})
      wrapper.find('.hi-timepicker__list').at(3).simulate('click', {target: wrapper.find('.hi-timepicker__list').at(3).find('li[value=2]').getDOMNode()})
    })
  })
  describe('branches', () => {
    it('clickOutSide', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker onChange={callback} value={mockDate} />
      )
      wrapper.find('input').simulate('focus')
      wrapper.find('.hi-datepicker__input-icon').simulate('click')
      expect(callback).toHaveBeenCalled()
    })
    it('inputOnChange', () => {
      const callback = jest.fn()
      // TODO: type === daterange 时，无法通过编辑输入框更改时间
      const wrapper = mount(
        <Datepicker type='daterange' onChange={callback} />
      )
      wrapper.find('input').at(0).simulate('focus')
      wrapper.find('input').at(0).simulate('change', {target: {value: '2019-11-14'}})
      wrapper.find('input').at(1).simulate('change', {target: {value: '2019-11-15'}})
      // expect(wrapper.find(`.hi-datepicker__panel--left td[value=${14}]:not(.prev):not(.next)`).hasClass('current')).toBeTruthy()
    })
    it('iconClick', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Datepicker type='date' onChange={callback} />
      )
      wrapper.find('.hi-datepicker__input-icon').simulate('click')
      expect(wrapper.find('.hi-datepicker__panel')).toHaveLength(1)
      wrapper.setProps({disabled: true})
      wrapper.find(DatePicker).setState({showPanel: false})
      wrapper.find('.hi-datepicker__input-icon').simulate('click')
      expect(wrapper.find('.hi-datepicker__panel')).toHaveLength(0)
    })
    it('time-format', () => {
      const callback = jest.fn()
      const wrapper = mount(
        <Timepicker onChange={callback} format='hh' />
      )
      wrapper.find('input').simulate('focus')
      wrapper.setProps({value: new Date()})
      expect(wrapper.find('input').getDOMNode().getAttribute('value')).toEqual(dateFormat(new Date(), 'hh'))
    })

    it('time-list', () => {
      const date = new Date('2019-11-15 12:00:00')
      const callback = jest.fn()
      const wrapper = mount(
        <Timepicker onChange={callback} value={date} />
      )
      jest.useFakeTimers()
      wrapper.find('input').simulate('focus')
      wrapper.find('.hi-timepicker__list-container').at(0).simulate('mouseEnter')
      expect(wrapper.find('.hi-timepicker__page-turn')).toHaveLength(2)
      wrapper.find('.hi-timepicker__page-turn').at(0).simulate('click')
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${date.getHours() - 1}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()
      wrapper.find('.hi-timepicker__page-turn').at(1).simulate('click')
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${date.getHours()}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()

      wrapper.setProps({value: date, disabledHours: [11, 10, 9]})
      wrapper.find('.hi-timepicker__list-container').at(0).simulate('mouseEnter')
      wrapper.find('.hi-timepicker__page-turn').at(0).simulate('click')
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${8}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()

      wrapper.setProps({value: date})
      wrapper.update()
      // 列表点击事件
      wrapper.find('.hi-timepicker__list').at(0).simulate('click')
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${8}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()

      wrapper.find('.hi-timepicker__list').at(0).simulate('click', {target: wrapper.find('.hi-timepicker__list').at(0).childAt(0).getDOMNode()})
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${8}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()

      wrapper.find('.hi-timepicker__list-container').at(0).simulate('mouseLeave')
      expect(wrapper.find('.hi-timepicker__page-turn')).toHaveLength(0)
      // 小时 滚动
      wrapper.find('.hi-timepicker__list').at(0).simulate('scroll', {target: {scrollTop: 3 * 32}})
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${3}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()
      // 滚动至大于24
      wrapper.find('.hi-timepicker__list').at(0).simulate('scroll', {target: {scrollTop: 25 * 32}})
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.find('.hi-timepicker__list').at(0).find(`li[value=${3}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()

      // 分钟滚动
      wrapper.find('.hi-timepicker__list').at(1).simulate('scroll', {target: {scrollTop: 20 * 32}})
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.find('.hi-timepicker__list').at(1).find(`li[value=${20}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()
      // 滚动至大于59
      wrapper.find('.hi-timepicker__list').at(1).simulate('scroll', {target: {scrollTop: 60 * 32}})
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.find('.hi-timepicker__list').at(1).find(`li[value=${20}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()

      // 秒滚动
      wrapper.find('.hi-timepicker__list').at(2).simulate('scroll', {target: {scrollTop: 20 * 32}})
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.find('.hi-timepicker__list').at(2).find(`li[value=${20}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()
      // 滚动至＞59
      wrapper.find('.hi-timepicker__list').at(2).simulate('scroll', {target: {scrollTop: 60 * 32}})
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.find('.hi-timepicker__list').at(2).find(`li[value=${20}]`).hasClass('hi-timepicker__item--current')).toBeTruthy()


    })
  })

  describe('util', () => {
    it('nextMonth', () => {
      const date = nextMonth('2019-11-15')
      // 0-12
      expect(getMonth(date)).toEqual(11)
    })
    it('deconstructDate', () => {
      const date = deconstructDate('2019-11-15 12:00:00')
      // 0-12
      expect(date).toEqual({
        year: 2019,
        month: 11,
        day: 15,
        week: 46,
        hours: 12,
        minutes: 0,
        seconds: 0,
        time: new Date('2019-11-15 12:00:00').getTime()
      })
    })
    it('compatibleFormatString', () => {
      const str = compatibleFormatString('YYYY-MM-DD')
      expect(str).toEqual('yyyy-MM-dd')
    })
    it('isVaildDate', () => {
      let str = isVaildDate('')
      expect(str).toBeFalsy()
      str = isVaildDate(new Date())
      expect(str).toBeTruthy()
      str = isVaildDate({startDate: new Date()})
      expect(str).toBeTruthy()
      str = isVaildDate(new Date().getTime())
      expect(str).toBeTruthy()
    })
  })
})
