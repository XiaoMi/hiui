import React from 'react'
import { mount } from 'enzyme'
import Collapse from '../'

/* eslint-env jest */

const changeCallback = jest.fn(key => key)
const component = (
  <Collapse onChange={changeCallback} accordion>
    <Collapse.Panel header="panel title 1">
      <p>Collapse Panel Content</p>
    </Collapse.Panel>
    <Collapse.Panel header="panel title 2">
      <p>Collapse Panel Content</p>
    </Collapse.Panel>
    <Collapse.Panel header="panel title 3">
      <p>Collapse Panel Content</p>
    </Collapse.Panel>
    {null &&
      <Collapse.Panel header="panel title 4">
        <p>Collapse Panel Content</p>
      </Collapse.Panel>}
  </Collapse>
)

describe('Collapse', () => {
  describe('PropTypes', () => {
    it('accordion', () => {
      const wrapper = mount(component)
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.find('.collapse-item__head').at(2).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      expect(changeCallback.mock.results[1].value).toBe('2')
    })
    it('activeId', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          activeId: '1'
        })
      )
      expect(wrapper.find('.collapse-item').at(0).hasClass('collapse-item--show')).toBeFalsy()
      expect(wrapper.find('.collapse-item').at(1).hasClass('collapse-item--show')).toBeTruthy()
    })
    it('arrow', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          arrow: 'left'
        })
      )
      // expect(wrapper.find('.collapse-item__icon').at(0).hasClass('icon-right')).toBeFalsy()
      expect(
        wrapper.find('.collapse-item__head').first().childAt(0).hasClass('collapse-item__title')
      ).toBeFalsy()
      wrapper.setProps({ arrow: 'right' })
      expect(
        wrapper.find('.collapse-item__head').first().childAt(0).hasClass('collapse-item__title')
      ).toBeTruthy()
    })
    it('showArrow', () => {
      const wrapper = mount(
        React.cloneElement(component, {
          showArrow: true
        })
      )
      // expect(wrapper.find('.collapse-item__icon').at(0).hasClass('icon-right')).toBeFalsy()
      expect(wrapper.find('.collapse-item__icon')).toHaveLength(3)
      wrapper.setProps({ showArrow: false })
      expect(wrapper.find('.collapse-item__icon')).toHaveLength(0)
    })

    it('非手风琴模式', () => {
      const wrapper = mount(
        <Collapse onChange={changeCallback} activeId={1}>
          <Collapse.Panel header="panel title 1" id={1}>
            <p>Collapse Panel Content</p>
          </Collapse.Panel>
          <Collapse.Panel header="panel title 2" id={2}>
            <p>Collapse Panel Content</p>
          </Collapse.Panel>
          <Collapse.Panel header="panel title 3" id={3}>
            <p>Collapse Panel Content</p>
          </Collapse.Panel>
        </Collapse>
      )
      wrapper.find('.collapse-item__head').at(0).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(0)
      wrapper.find('.collapse-item__head').at(0).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(2)
      wrapper.find('.collapse-item__head').at(2).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(3)
    })
    it('disabled', () => {
      const wrapper = mount(
        <Collapse onChange={changeCallback} activeId={1}>
          <Collapse.Panel header="panel title 1" id={1}>
            <p>Collapse Panel Content</p>
          </Collapse.Panel>
          <Collapse.Panel header="panel title 2" id={2} disabled>
            <p>Collapse Panel Content</p>
          </Collapse.Panel>
          <Collapse.Panel header="panel title 3" id={3}>
            <p>Collapse Panel Content</p>
          </Collapse.Panel>
        </Collapse>
      )
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
      wrapper.find('.collapse-item__head').at(1).simulate('click')
      expect(wrapper.find('.collapse-item--show')).toHaveLength(1)
    })
  })
})
