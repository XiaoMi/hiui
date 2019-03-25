import React from 'react'
import { mount } from 'enzyme'
import Modal from '../'
import Button from '../../button'

let wrapper = null
const confirmCallback = jest.fn(items => items)
const cancelCallback = jest.fn(() => {
  wrapper.setProps({show: false})
})

describe('Modal', () => {
  beforeEach(() => {
  })

  afterEach(() => {
    wrapper && wrapper.unmount()
    confirmCallback.mockClear()
    cancelCallback.mockClear()
  })

  it('基础用法', () => {
    wrapper = mount(
      <Modal
        title="提示消息"
        show={false}
        onConfirm={confirmCallback}
        onCancel={cancelCallback}
        confirmText='ok'
        cancelText='cancel'
      >
        <span>一些消息</span>
        <span>一些消息</span>
      </Modal>
    )

    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(1)
    wrapper.setProps({show: true}) // 显示modal
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(0)

    expect(wrapper.find('.hi-modal__close')).toHaveLength(1) // 显示关闭按钮
    expect(wrapper.find('.hi-btn--type--primary').text()).toEqual('ok') // 自定义按钮文字
    expect(wrapper.find('.hi-btn--type--default').text()).toEqual('cancel')

    wrapper.find('.hi-btn--type--primary').simulate('click') // 点击确定按钮
    expect(confirmCallback).toHaveBeenCalled()

    wrapper.find('.hi-btn--type--default').simulate('click') // 点击取消按钮
    expect(cancelCallback).toHaveBeenCalled()
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(1) // modal被隐藏

    wrapper.setProps({show: true}) // 显示modal
    wrapper.find('.hi-modal__close').simulate('click') // 点击关闭按钮关闭modal
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(1) // modal被隐藏

    wrapper.setProps({show: true}) // 显示modal
    wrapper.find('.hi-modal__mask').simulate('click') // 点击黑色背景关闭modal
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(1) // modal被隐藏
  })

  it('自定义', () => {
    wrapper = mount(
      <Modal
        title="提示消息"
        show={false}
        onConfirm={confirmCallback}
        onCancel={cancelCallback}
        footers={[
          <Button type="primary" key={0} onClick={() => console.log(1)}>自定义按钮1</Button>,
          <Button type="success" key={1} onClick={() => console.log(2)}>自定义按钮2</Button>,
          <Button type="danger" key={2} onClick={() => console.log(3)}>自定义按钮3</Button>,
          <Button type="default" key={3} onClick={cancelCallback}>关闭</Button>
        ]}
        backDrop={false}
        closeBtn={false}
      >
        <span>一些消息</span>
        <span>一些消息</span>
      </Modal>
    )

    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(1)
    wrapper.setProps({show: true}) // 显示modal
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(0)

    expect(wrapper.find('.hi-modal__close')).toHaveLength(0) // 不显示关闭按钮
    expect(wrapper.find('.hi-btn')).toHaveLength(4) // 自定义底部按钮

    wrapper.find('.hi-modal__mask').simulate('click') // 点击黑色背景不关闭modal
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(0)

    wrapper.find('.hi-btn--type--default').simulate('click') // 点击取消按钮
    expect(cancelCallback).toHaveBeenCalled()
    expect(document.querySelectorAll('.hi-modal--hide')).toHaveLength(1) // modal被隐藏
  })
})
