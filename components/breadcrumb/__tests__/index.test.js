import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Breadcrumb from '../index'

describe('Breadcrumb', () => {

  it('normal', () => {
    const wrapper = mount(
      <div>
        <Breadcrumb />
        <Breadcrumb />
      </div>
    )
    expect(wrapper.find('.hi-breadcrumb')).toHaveLength(2)
  })

  describe('PropTypes', () => {
    it('separator', () => {
      const wrapper = mount(
        <div>
          <Breadcrumb separator='/' />
        </div>
      )
      console.log(wrapper.debug())
      expect(wrapper.find('.hi-breadcrumb__separator').text()).toEqual('/')
    })
  })
})
