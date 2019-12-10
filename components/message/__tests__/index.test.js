import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import Message from '../index'

/* eslint-env jest */

describe('Message', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })
  describe('Methods', () => {
    it('open&close', () => {
      Message.open({
        title: 'Tip'
      })
    })
    it('duration',()=>{
      Message.open({
        title: 'Tip',
        type:'info',
        duration:3000
      })
      expect(document.querySelectorAll('.hi-message--info')).toHaveLength(1)
      clock.tick(4000)
      expect(document.querySelectorAll('.hi-message--info')).toHaveLength(0)
    })
    it('title',()=>{
      Message.open({
        title: 'Tip',
        type:'info',
        duration:3000
      })
      expect(document.querySelector('.hi-message__title').textContent).toEqual('Tip')
    
    })
    it('type',()=>{
      Message.open({
        title: 'Tip',
        type:'success',
      })
      Message.open({
        title: 'Tip',
        type:'error',
      })
      Message.open({
        title: 'Tip',
        type:'warning',
      })
      expect(document.querySelectorAll('.hi-message--success')).toHaveLength(1)
      expect(document.querySelectorAll('.hi-message--error')).toHaveLength(1)
      expect(document.querySelectorAll('.hi-message--warning')).toHaveLength(1)

    })
    
  })
  
})
