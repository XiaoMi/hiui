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
  describe('handleNotificate', () => {
    describe('PropTypes', () => {
      it('duration&&onClose&&autoClose&&title', () => {
        const fn = jest.fn()
        Notification.handleNotificate({duration: 5000, showClose:false,autoClose:true,title:'标题',message:'自动关闭通知框',onClose:fn})
        clock.tick(2000)
        expect(document.querySelectorAll('.info')).toHaveLength(1)
        expect(document.querySelector('.title').textContent).toEqual('标题')
        clock.tick(12000)
        expect(fn).toHaveBeenCalled();
        expect(document.querySelectorAll('.hi-notification')).toHaveLength(0)
      })
      it('type && click && onTransitionEnd', () => {
        Notification.handleNotificate({type:'error',autoClose:false,title:'标题',message:'手动关闭通知框'})
        Notification.handleNotificate({type:'success',autoClose:false,title:'标题',message:'手动关闭通知框'})
        Notification.handleNotificate({type:'warning',autoClose:false,title:'标题',message:'手动关闭通知框',removeContainDiv:false})
        clock.tick(2000)
        expect(document.querySelectorAll('.error')).toHaveLength(1)
        expect(document.querySelectorAll('.success')).toHaveLength(1)
        expect(document.querySelectorAll('.warning')).toHaveLength(1)
        trigger(document.querySelector('.success'),'transitionend')

        trigger(document.querySelector('.warning .icon-img-delete'),'click')
        clock.tick(2000)
        trigger(document.querySelector('.warning'),'transitionend')

        trigger(document.querySelector('.success'),'transitionend')

        trigger(document.querySelector('.error .icon-img-delete'),'click')
        clock.tick(5000)
        trigger(document.querySelector('.error'),'transitionend')
        expect(document.querySelectorAll('.error')).toHaveLength(0)
      })
    })
    
  })
})
