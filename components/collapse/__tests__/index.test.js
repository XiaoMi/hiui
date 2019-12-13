import React from 'react'
import { mount } from 'enzyme'
import Collapse from '../'

/* eslint-env jest */

const changeCallback = jest.fn()
const component = (
  <Collapse onChange={changeCallback} activeId="1" arrow="right" accordion>
    <Collapse.Panel id="1" title="panel title 1">
      <p>Collapse Panel Content 1</p>
      <p>Collapse Panel Content 1</p>
      <p>Collapse Panel Content 1</p>
    </Collapse.Panel>
    <Collapse.Panel title="panel title 2" id="2">
      <p>Collapse Panel Content 2</p>
      <p>Collapse Panel Content 2</p>
      <p>Collapse Panel Content 2</p>
    </Collapse.Panel>
    <Collapse.Panel title="panel title 3" id="3">
      <p>Collapse Panel Content 3</p>
      <p>Collapse Panel Content 3</p>
      <p>Collapse Panel Content 3</p>
    </Collapse.Panel>
  </Collapse>
)

describe('Collapse', () => {
  describe('PropTypes', () => {
    it('accordion', () => {
      const wrapper = mount(component)
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(0)
      expect(changeCallback).toHaveBeenCalled()
      wrapper.unmount()
    })
    it('activeId', () => {
      const wrapper = mount(component)
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.setProps({ accordion: false })
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(2)
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.unmount()
    })
    it('arrow', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          arrow: 'left'
        })
      )
      expect(
        wrapper.find('.collapse-item__head').first().childAt(0).hasClass('collapse-item__title')
      ).toBeFalsy()
      wrapper.setProps({ arrow: 'right' })
      expect(
        wrapper.find('.collapse-item__head').first().childAt(0).hasClass('collapse-item__title')
      ).toBeTruthy()
      wrapper.unmount()
    })
    it('showArrow', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          showArrow: true
        })
      )
      expect(wrapper.find('.collapse-item__icon')).toHaveLength(3)
      wrapper.setProps({ showArrow: false })
      expect(wrapper.find('.collapse-item__icon')).toHaveLength(0)
      wrapper.unmount()
    })
  })
})
