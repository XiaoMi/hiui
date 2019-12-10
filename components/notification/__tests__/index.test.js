import React, { Fragment } from 'react'
import sinon from 'sinon'
import Notification from '../index'

/* eslint-env jest */

describe('Notification', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })
  describe('Methods', () => {
    it('open&&close', () => {
      const key = 'key'
      Notification.open({
        title:'通知',
        content:'通知内容',
        closeable:false,
        key
      })
      clock.tick(1000)
      expect(document.querySelectorAll('.hi-notification--info')).toHaveLength(1)
      Notification.close()
      clock.tick(1000)
      expect(document.querySelectorAll('.hi-notification--info')).toHaveLength(0)
    })
  })
})
