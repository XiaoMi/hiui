import React, { Fragment } from 'react'
import { mount } from 'enzyme'
import sinon, { fake, spy } from 'sinon'
import simulant from 'simulant'
import Message from '../index'

/* eslint-env jest */

describe('Message', () => {
  describe('Methods', () => {
    it('open&close', () => {
      Message.open({
        title: 'Tip'
      })
    })
    it('type',()=>{
      Message.open({
        title: 'Tip',
        type:'info',
      })
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
    })
    it('duration',()=>{

    })
  })
  
})
