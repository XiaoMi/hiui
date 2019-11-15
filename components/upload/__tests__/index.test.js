import React from 'react'
import { mount, shallow } from 'enzyme'
import { spy, fake } from 'sinon'
import Upload from '../main'
import BaseUpload from '../Upload'
/* eslint-env jest */
describe('Upload', () => {
  const types = ['default','drag','pictureCard','avatar','photo']
  describe('PropTypes', () => {
    it('type', () => {
      const wrapper = mount(
        <div>
          {
            types.map((type, index) => {
              return <Upload type={type} key={index} />
            })
          }
        </div>
      )
      types.forEach(type => {
        if (type === 'pictureCard') {
          expect(wrapper.find(`.hi-upload--picture-card`)).toHaveLength(1)
        } else if (type === 'default') {
          expect(wrapper.find(`.hi-upload--normal`)).toHaveLength(1)
        } else {
          expect(wrapper.find(`.hi-upload--${type}`)).toHaveLength(1)
        }

      })
    })

    it('accept', () => {
      types.forEach(type => {
        const wrapper = mount(
          <Upload accept='image/png' type={type} />
        )
        expect(wrapper.find('input').getDOMNode().getAttribute('accept')).toEqual('image/png')
      })

    })

    it('disabled', () => {
      types.forEach(type => {
        const wrapper = mount(
          <Upload disabled  type={type}/>
        )
        if (type ==='default') {
          expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(true)
          expect(wrapper.find('.hi-upload').find('button').prop('disabled')).toEqual(true)
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          wrapper.setProps({disabled: false})
          expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(false)
          expect(wrapper.find('.hi-upload').find('button').prop('disabled')).toEqual(undefined)
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
        } else if (type === 'drag' || type === 'photo') {
          expect(wrapper.find('.hi-upload.hi-upload--disabled')).toHaveLength(1)
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          wrapper.setProps({disabled: false})
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
        } else if (type === 'avatar') {
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          wrapper.setProps({disabled: false})
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
        } else if (type === 'pictureCard') {
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          expect(wrapper.find('.hi-upload').find('span.hi-upload__button').hasClass('hi-upload__button--disabled')).toEqual(true)
          wrapper.setProps({disabled: false})
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
          expect(wrapper.find('.hi-upload').find('span.hi-upload__button').hasClass('hi-upload__button--disabled')).toEqual(false)
        }
      })
    })


    it('loading', () => {
      const wrapper = mount(
        <Upload disabled  />
      )
      expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(true)
      wrapper.setProps({disabled: false})
      expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(false)
    })

    it('content', () => {
      const wrapper = mount(
        <Upload  />
      )
      expect(wrapper.find('.hi-upload').find('button').text()).toEqual('本地上传')
      wrapper.setProps({content: 'Upload'})
      expect(wrapper.find('.hi-upload').find('button').text()).toEqual('Upload')
    })
  })

  it('show upload list', () => {
    const mockFile = new File(["foo"], "foo.txt", {
      type: "text/plain",
    })

    // TODO: 目前只有 type === 'default' 和 type === 'pictureCard' 支持 showUploadList 为 false 时隐藏上传列表
    types.forEach(type => {
      const wrapper = mount(<Upload
        type={type}
        uploadAction= "https://www.mocky.io/v2/5dc3b4413000007600347501"
      />)
      wrapper.find('.hi-upload').find('input').simulate('change',{target: {
        files: [mockFile],
      },})
      expect(wrapper.find('.hi-upload').find('ul.hi-upload__list')).toHaveLength(1)
      wrapper.setProps({showUploadList: false})
      if (['default', 'pictureCard'].includes(type)) {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list')).toHaveLength(0)
      }
    })
  })

  it('show default file list', () => {
    types.forEach((type) => {
      const wrapper = mount(<Upload
        type={type}
        defaultFileList={[
          {
            name: 'a.png',
            fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
            uploadState: 'success', // 上传状态，可取值success, error
            url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
          },
          {
            name: 'b.png',
            fileType: 'img',
            uploadState: 'error',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          }
        ]}
        uploadAction= "https://www.mocky.io/v2/5dc3b4413000007600347501"
      />)
      if(['default','pictureCard'].includes(type)) {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(2)
      } else if(type === 'avatar') {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(1)
      } else {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(3)
      }
    })
  })

  it('fileList has priority over defaultFileList', () => {
    types.forEach((type) => {
      const wrapper = mount(<Upload
        type={type}
        fileList={[
          {
            name: 'a.png',
            fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
            uploadState: 'success', // 上传状态，可取值success, error
            url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
          },
          {
            name: 'b.png',
            fileType: 'img',
            uploadState: 'error',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          }
        ]}
        defaultFileList={[
          {
            name: 'a.png',
            fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
            uploadState: 'success', // 上传状态，可取值success, error
            url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
          }
        ]}
        uploadAction= "https://www.mocky.io/v2/5dc3b4413000007600347501"
      />)
      if(['default','pictureCard'].includes(type)) {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(2)
      } else if(type === 'avatar') {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(1)
      } else {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(3)
      }
    })
  })

  it('file list is controlled', () => {
    const mockFile = new File(["foo"], "foo.txt", {
      type: "text/plain",
    })
    types.forEach((type,index) => {
      const wrapper = mount(<Upload
        type={type}
        fileList={[
          {
            name: 'a.png',
            fileType: 'img', // 文件类型，可取值img, zip, word, pdf, ppt, excel, other
            uploadState: 'success', // 上传状态，可取值success, error
            url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
          }
        ]}
        uploadAction= "https://www.mocky.io/v2/5dc3b4413000007600347501"
      />)
      console.log('>>>>>>>>',index,wrapper.find('.hi-upload').find('input').debug())
      wrapper.find('.hi-upload').find('input').simulate('change',{target: {
        files: [mockFile],
      },})
      if(['default','pictureCard'].includes(type)) {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(2)
      } else if(type === 'avatar') {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(1)
      } else {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')).toHaveLength(3)
      }
    })
  })
})
