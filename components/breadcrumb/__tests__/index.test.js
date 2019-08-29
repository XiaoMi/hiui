import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Breadcrumb from '../index'

const data = [{
  content: '首页',
  path: '/home'
}, {
  content: '产品类',
  icon: 'document',
  path: '/product'
}, {
  icon: 'component',
  path: '/phone'
}, {
  content: '红米系列',
  path: '/redmi'
}, {
  content: 'Note7',
  path: '/note7'
}]
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
          <Breadcrumb separator='/' data={data} />
        </div>
      )
      expect(wrapper.find('.hi-breadcrumb__separator')).toHaveLength(5)
      const separators = wrapper.find('.hi-breadcrumb__separator').map(node => node.text())
      expect(separators).toEqual(['/', '/', '/', '/', '/'])
    })
  })

  it('onClick', () => {
    const callback = fake()
    const wrapper = mount(
      <div>
        <Breadcrumb onClick={callback} data={data} />
        <Breadcrumb data={data} />
      </div>
    )

    wrapper.find('.hi-breadcrumb__content').at(0).simulate('click')
    wrapper.find('.hi-breadcrumb__content').at(5).simulate('click')
    expect(callback.callCount).toEqual(1)
  })
})
