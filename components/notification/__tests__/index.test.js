import React, { Fragment } from 'react'
import sinon from 'sinon'
import Notification from '../index'

/* eslint-env jest */
function trigger(elem, event){

  var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”

  myEvent.initEvent(event, true, true);        //执行事件

  elem.dispatchEvent(myEvent);

}
describe('Notification', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })
  describe('Methods', () => {
    const fn = jest.fn()
    it('open&&close', () => {
      const key = 'key'
      Notification.open({
        title:'通知',
        content:'通知内容',
        closeable:false,
        key,
        onConfirm:fn
      })
      clock.tick(1000)
      expect(document.querySelectorAll('.hi-notification--info')).toHaveLength(1)
      trigger(document.querySelector('button'),'click')
      expect(fn).toHaveBeenCalled();
      Notification.close()
      clock.tick(1000)
      expect(document.querySelectorAll('.hi-notification--info')).toHaveLength(0)
      
    })
  })
})
