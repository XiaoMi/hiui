import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon, { fake, spy } from 'sinon'
import simulant from 'simulant'
import Loading from '../Loading'

/* eslint-env jest */

describe('Loading', () => {
  describe('PropTypes', () => {
    it('size', () => {
      const sizes = ['small', 'default', 'large']
      const wrapper = mount(
        <div>
          {
            sizes.map((size, index) => {
              return <Loading size={size} key={index} />
            })
          }
          <Loading />
        </div>
      )
      expect(wrapper.find('.hi-loading__icon--small')).toHaveLength(1)
      expect(wrapper.find('.hi-loading__icon--large')).toHaveLength(1)
      expect(wrapper.find('.hi-loading__icon--default')).toHaveLength(2)
      wrapper.unmount()
    })
    it('content', () => {
      const wrapper = mount(
        <Loading content='Loading...' />
      )
      expect(wrapper.find('.hi-loading__text').text()).toEqual('Loading...')
      wrapper.unmount()
    })
    it('visible', () => {
      const wrapper = mount(
        <Loading />
      )
      expect(wrapper.find('.hi-loading__mask--hide')).toHaveLength(0)
      wrapper.setProps({
        visible: false
      })
      expect(wrapper.find('.hi-loading__mask--hide')).toHaveLength(1)
      wrapper.unmount()
    })
    // TODO: duration
    // it('duration', () => {
    //   const wrapper = mount(
    //     <Loading duration={3000} />
    //   )
    //   expect(wrapper.find('.hi-loading__mask--hide')).toHaveLength(0)
    //   wrapper.setProps({
    //     visible: false
    //   })
    //   expect(wrapper.find('.hi-loading__mask--hide')).toHaveLength(1)
    // })
    it('full', () => {
      const wrapper = mount(
        <Loading full />
      )
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(1)
      wrapper.unmount()
    })
  })
  describe('Methods', () => {
    it('open&close', () => {
      // Loading.open(null, {key: 1})
      // expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(1)
      // Loading.close(1)
      // expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(0)
      // const containerRef = React.createRef()
      // const wrapper = mount(
      //   <div>
      //     <div className='container' ref={containerRef} />
      //   </div>
      // )

      // Loading.open(wrapper.find('.container').getDOMNode(), {key: 2})
      // expect(wrapper.find('.hi-loading__mask')).toHaveLength(1)
      // console.log(document.querySelectorAll('.hi-hi-loading__icon').length)
      // expect(document.querySelectorAll('.hi-loading__mask')).toHaveLength(1)
      // Loading.close(2)
      // expect(document.querySelectorAll('.hi-loading__mask')).toHaveLength(0)
      // const throwFun = () => {
      //   Loading.open(null, {})
      // }
      // expect(throwFun).toThrow()
    })
    it('deprecatedOpen', () => {
      mount(
        <div className='container' />
      )
      const _Loading = Loading.open()
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(1)
      _Loading.close()
      expect(document.querySelectorAll('.hi-loading__mask--global')).toHaveLength(0)
      const _Loading2 = Loading.open({target: document.querySelector('.container')})
      expect(document.querySelectorAll('.hi-loading__mask')).toHaveLength(1)
      _Loading2.close()
    })
  })
  describe('Branch', () => {
    it('open&close', () => {

    })
  })
})
