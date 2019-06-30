import React from 'react'
import { mount } from 'enzyme'
import {handleNotificate} from '../'
import Button from '../../button'

let wrapper = null
const closeCallback = jest.fn(() => {})

describe('Notification', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    document.querySelector('.hi-notification').parentElement.remove()
    closeCallback.mockClear()
    jest.useRealTimers()
  })

  it('基础用法', (done) => {
    handleNotificate({
      type: 'success',
      showClose: true,
      autoClose: false,
      title: '标题',
      message: '手动关闭通知框',
      onClose: closeCallback
    })

    expect(document.querySelectorAll('.hi-notification')).toHaveLength(1)
    expect(document.querySelector('.hi-notification .title').textContent).toEqual('标题')
    expect(document.querySelector('.hi-notification .message').textContent).toEqual('手动关闭通知框')

    document.querySelector('.icon-img-delete').click()
    expect(closeCallback).toHaveBeenCalled()
    done()
  })

  it('自动关闭', () => {
    handleNotificate({
      type: 'success',
      showClose: false,
      autoClose: true,
      duration: 2000,
      title: '标题',
      message: '自动关闭通知框',
      onClose: closeCallback
    })

    expect(document.querySelectorAll('.hi-notification')).toHaveLength(1)
    expect(document.querySelector('.hi-notification .title').textContent).toEqual('标题')
    expect(document.querySelector('.hi-notification .message').textContent).toEqual('自动关闭通知框')

    jest.runAllTimers()
    expect(closeCallback).toHaveBeenCalled()
  })
})
