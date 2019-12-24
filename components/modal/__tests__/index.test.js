import React from 'react'
import { mount } from 'enzyme'
import Modal from '..'
import Button from '../../button'
/* eslint-env jest */
let wrapper = null
const confirmCallback = jest.fn(items => items)
const cancelCallback = jest.fn(() => {
  wrapper.setProps({ visible: false })
})

describe('Modal', () => {
  beforeEach(() => {
  })

  afterEach(() => {
    wrapper && wrapper.unmount()
    confirmCallback.mockClear()
    cancelCallback.mockClear()
  })
  describe('PropTypes', () => {
    it('title', () => {
      wrapper = mount(
        <Modal
          title='提示消息'
        />
      )
      expect(wrapper.find('.hi-modal__title').text()).toEqual('提示消息')
    })
    it('visible', () => {
      wrapper = mount(
        <Modal
          title='提示消息'
          visible={false}
        />
      )
      expect(wrapper.find('.hi-modal--hide')).toHaveLength(1)
      wrapper.setProps({ visible: true })
      expect(wrapper.find('.hi-modal--hide')).toHaveLength(0)
    })
    it('closeable&onCancel', () => {
      wrapper = mount(
        <Modal
          title='提示消息'
          visible
          onCancel={cancelCallback}
          maskCloseable
        />
      )
      expect(wrapper.find('.hi-modal__close')).toHaveLength(1)
      wrapper.find('.hi-modal__close').at(0).simulate('click')
      expect(cancelCallback).toHaveBeenCalled()
      expect(wrapper.find('.hi-modal--hide')).toHaveLength(1)

      wrapper.setProps({ visible: true })
      wrapper.find('.hi-modal__mask').simulate('click')
      expect(cancelCallback).toHaveBeenCalled()
      expect(wrapper.find('.hi-modal--hide')).toHaveLength(1)

      wrapper.setProps({ maskCloseable: false, visible: true })
      wrapper.find('.hi-modal__mask').simulate('click')
      expect(wrapper.find('.hi-modal--hide')).toHaveLength(0)
    })

    it('text', () => {
      wrapper = mount(
        <Modal
          title='提示消息'
          onCancel={cancelCallback}
          onConfirm={confirmCallback}
          cancelText='Cancel'
          confirmText='Confirm'
          visible
        />
      )
      const confirmBtn = wrapper.find('.hi-modal__footer').find('button').at(1)
      const cancelBtn = wrapper.find('.hi-modal__footer').find('button').at(0)
      expect(cancelBtn.text()).toEqual('Cancel')
      expect(confirmBtn.text()).toEqual('Confirm')
      cancelBtn.simulate('click')
      expect(cancelCallback).toHaveBeenCalled()
      expect(wrapper.find('.hi-modal--hide')).toHaveLength(1)

      confirmBtn.simulate('click')
      expect(confirmCallback).toHaveBeenCalled()
    })
    it('size', () => {
      wrapper = mount(
        <Modal
          title='提示消息'
        />
      )
      expect(wrapper.find('.hi-modal__dialog--normal')).toHaveLength(1)
      wrapper.setProps({ size: 'large' })
      expect(wrapper.find('.hi-modal__dialog--large')).toHaveLength(1)
      wrapper.setProps({ size: 'small' })
      expect(wrapper.find('.hi-modal__dialog--small')).toHaveLength(1)
    })
    it('style', () => {
      wrapper = mount(
        <Modal
          title='提示消息'
          style={{ width: 200 }}
          width={500}
        />
      )
      expect(document.querySelector('.hi-modal__dialog').getAttribute('style')).toEqual(expect.stringContaining('width: 200px;'))
      wrapper.setProps({ style: {} })
      expect(document.querySelector('.hi-modal__dialog').getAttribute('style')).toEqual(expect.stringContaining('width: 500px;'))
    })

    it('footer', () => {
      const customeEvent = jest.fn()
      const cBtn = <Button type='primary' key={0} onClick={customeEvent}>自定义按钮</Button>
      wrapper = mount(
        <Modal
          title='提示消息'
          visible={false}
          onCancel={cancelCallback}
          footer={[
            cBtn,
            <Button type='default' key={1} onClick={cancelCallback}>关闭</Button>
          ]}
        >
          <span>一些消息</span>
        </Modal>
      )
      expect(wrapper.find('.hi-modal__footer').contains(cBtn)).toEqual(true)
      wrapper.find('.hi-modal__footer').find('.hi-btn').at(0).simulate('click')
      expect(customeEvent).toHaveBeenCalled()
    })
  })
  describe('Branch', () => {
    it('branch', () => {
      const customeEvent = jest.fn()
      const cBtn = <Button type='primary' key={0} onClick={customeEvent}>自定义按钮</Button>
      wrapper = mount(
        <Modal
          visible={false}
          onCancel={cancelCallback}
          closeBtn
          closeable
          footer={[
            cBtn,
            <Button type='default' key={1} onClick={cancelCallback}>关闭</Button>
          ]}
          footers={[
            cBtn,
            <Button type='default' key={1} onClick={cancelCallback}>关闭</Button>
          ]}
        >
          <span>一些消息</span>
        </Modal>
      )
      expect(wrapper.find('.hi-modal__footer').contains(cBtn)).toEqual(true)
      wrapper.find('.hi-modal__footer').find('.hi-btn').at(0).simulate('click')
      expect(customeEvent).toHaveBeenCalled()
      wrapper.setProps({closeable: false, closeBtn: false})
    })
  })
})
