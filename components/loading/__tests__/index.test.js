import React from 'react'
import { mount } from 'enzyme'
import Loading from '../Loading'
/* eslint-env jest */

describe('Loading', () => {
  describe('PropTypes', () => {
    it('size', () => {
      const sizes = ['small', 'default', 'large']
      const wrapper = mount(
        <div>
          {sizes.map((size, index) => {
            return <Loading size={size} key={index} />
          })}
          <Loading />
        </div>
      )
      expect(wrapper.find('.hi-loading__icon--small')).toHaveLength(1)
      expect(wrapper.find('.hi-loading__icon--large')).toHaveLength(1)
      expect(wrapper.find('.hi-loading__icon--default')).toHaveLength(2)
      wrapper.unmount()
    })
    it('content', () => {
      const wrapper = mount(<Loading content="Loading..." />)
      expect(wrapper.find('.hi-loading__text').text()).toEqual('Loading...')
      wrapper.unmount()
    })
    it('visible', () => {
      const wrapper = mount(<Loading />)
      expect(wrapper.find('.hi-loading__mask--hide')).toHaveLength(0)
      wrapper.setProps({
        visible: false
      })
      expect(wrapper.find('.hi-loading__mask--hide')).toHaveLength(1)
      wrapper.unmount()
    })

    it('full', () => {
      const wrapper = mount(<Loading full />)
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(1)
      wrapper.unmount()
    })
  })
  describe('Methods', () => {
    it('open&close', () => {
      Loading.open(null, { key: 1 })
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(1)
      Loading.close(1)
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(0)

      const container = document.createElement('div')
      container.className = 'demo'
      document.body.appendChild(container)
      Loading.open(container, { key: 2 })
      expect(document.querySelectorAll('.hi-loading__mask--part')).toHaveLength(1)
      Loading.close(2)
      expect(document.querySelectorAll('.hi-loading__mask--part')).toHaveLength(0)
      jest.useFakeTimers()
      Loading.open(container, { key: 3, duration: 3000 })
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000)
      expect(document.querySelectorAll('.hi-loading__mask--part')).toHaveLength(1)
      jest.runAllTimers()
      expect(document.querySelectorAll('.hi-loading__mask--part')).toHaveLength(0)
      jest.useRealTimers()
    })
    it('deprecatedOpen', () => {
      mount(<div className="container" />)
      const _Loading = Loading.open()
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(1)
      _Loading.close()
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(0)
      const _Loading2 = Loading.open({ target: document.querySelector('.container') })
      expect(document.querySelectorAll('.hi-loading__mask')).toHaveLength(1)
      _Loading2.close()
    })
  })
})
