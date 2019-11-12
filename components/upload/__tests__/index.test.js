import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Upload from '../main'
import BaseUpload from '../Upload'
/* eslint-env jest */
describe('Breadcrumb', () => {
  describe('PropTypes', () => {
    it('type', () => {
      const types = ['normal', 'drag', 'pictureCard', 'avatar', 'photo']
      const wrapper = mount(
        <div>
          {
            types.map((type, index) => {
              return <Upload type={type} key={index} />
            })
          }
        </div>
      )
      types.map(type => {
        if (type === 'pictureCard') {
          expect(wrapper.find(`.hi-upload--picture-card`)).toHaveLength(1)
          return true
        }
        expect(wrapper.find(`.hi-upload--${type}`)).toHaveLength(1)
      })
    })
    it('accept', () => {
      const wrapper = mount(
        <Upload accept='image/png' type='normal' />
      )
      expect(wrapper.find('input').getDOMNode().getAttribute('accept')).toEqual('image/png')
    })
    it('content', () => {
      const wrapper = mount(
        <Upload type='normal' />
      )
      expect(wrapper.find('.hi-upload').find('button').text()).toEqual('本地上传')
      wrapper.setProps({content: 'Upload'})
      expect(wrapper.find('.hi-upload').find('button').text()).toEqual('Upload')
    })
    it('content', () => {
      const wrapper = mount(
        <Upload type='normal' maxSize={200} />
      )
      wrapper.find('input').simulate('change', {target: {files: [{size: 3000}]}})
    })
  })
})
