import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Datepicker from '../index'
/* eslint-env jest */

describe('Datepicker', () => {

  it('normal', () => {
    const wrapper = mount(
      <div>
        <Datepicker />
        <Datepicker />
      </div>
    )
    expect(wrapper.find('.hi-datepicker__input-root')).toHaveLength(2)
  })

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
        var expectLen = type.includes('range') ? 2 : 1
        wrapper.find('.hi-datepicker__input').at(index).childAt(0).simulate('focus')
        expect(document.querySelectorAll('.hi-datepicker')).toHaveLength(1)
        expect(document.querySelectorAll(`.hi-datepicker__calender-container--${type}`)).toHaveLength(expectLen)
        document.body.click()
      })
    })
  })
})
