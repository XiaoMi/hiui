import React from 'react'
import { mount } from 'enzyme'
import Upload from '../main'
import sinon from 'sinon'
function trigger(elem, event){

  var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”

  myEvent.initEvent(event, true, true);        //执行事件

  elem.dispatchEvent(myEvent);

}
describe('Upload', () => {
  const types = ['default', 'drag', 'pictureCard', 'avatar', 'photo']
  const localeDatas = {
    upload: {
      buttonText: '本地上传',
      uploadSuccess: '上传成功',
      uploadFailed: '上传失败',
      cancel: '取消',
      delete: '删除',
      drag: '拖拽文件上传',
      dragTips: '请点击或拖拽文件上传',
      dragTipsLimited: '数量已达上限',
      preview: '预览'
    }
  }
  let xhr, requests
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()

    xhr = sinon.useFakeXMLHttpRequest()
    requests = []
    xhr.onCreate = req => requests.push(req)
  })

  afterEach(() => {
    clock.restore()

    xhr.restore()
  })
  describe('PropTypes', () => {
    it('type', () => {
      const wrapper = mount(
        <div>
          {types.map((type, index) => {
            return <Upload type={type} key={index} localeDatas={localeDatas} />
          })}
        </div>
      )
      types.forEach(type => {
        if (type === 'pictureCard') {
          expect(wrapper.find(`.hi-upload--picture-card`)).toHaveLength(1)
          wrapper.find('.hi-upload--picture-card').find('button').simulate('click')
          expect(wrapper.find('.hi-upload--picture-card').find('input').instance().value).toBe('')
        } else if (type === 'default') {
          expect(wrapper.find(`.hi-upload--normal`)).toHaveLength(1)
        } else {
          expect(wrapper.find(`.hi-upload--${type}`)).toHaveLength(1)
        }
      })
      wrapper.unmount()
    })

    it('accept', () => {
      types.forEach(type => {
        const wrapper = mount(<Upload accept="image/png" type={type} localeDatas={localeDatas} />)
        expect(wrapper.find('input').getDOMNode().getAttribute('accept')).toEqual('image/png')
        wrapper.unmount()
      })
    })

    it('disabled', () => {
      types.forEach(type => {
        const wrapper = mount(<Upload disabled type={type} localeDatas={localeDatas} />)
        if (type === 'default') {
          expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(
            true
          )
          expect(wrapper.find('.hi-upload').find('button').prop('disabled')).toEqual(true)
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          wrapper.setProps({ disabled: false })
          expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(
            false
          )
          expect(wrapper.find('.hi-upload').find('button').prop('disabled')).toEqual(undefined)
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
        } else if (type === 'drag' || type === 'photo') {
          expect(wrapper.find('.hi-upload.hi-upload--disabled')).toHaveLength(1)
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          wrapper.setProps({ disabled: false })
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
        } else if (type === 'avatar') {
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          wrapper.setProps({ disabled: false })
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
        } else if (type === 'pictureCard') {
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual('disabled')
          expect(
            wrapper
              .find('.hi-upload')
              .find('button')
              .hasClass('hi-btn--disabled')
          ).toEqual(true)
          wrapper.setProps({ disabled: false })
          expect(wrapper.find('.hi-upload').find('input').prop('disabled')).toEqual(false)
          expect(
            wrapper
              .find('.hi-upload')
              .find('button')
              .hasClass('hi-btn--disabled')
          ).toEqual(false)
        }
        wrapper.unmount()
      })
    })

    it('loading', () => {
      const wrapper = mount(<Upload disabled localeDatas={localeDatas} />)
      expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(true)
      wrapper.setProps({ disabled: false })
      expect(wrapper.find('.hi-upload').find('button').hasClass('hi-btn--disabled')).toEqual(false)
      wrapper.unmount()
    })

    it('content', () => {
      const wrapper = mount(<Upload localeDatas={localeDatas} />)
      expect(wrapper.find('.hi-upload').find('button').text()).toEqual('本地上传')
      wrapper.setProps({ content: 'Upload' })
      expect(wrapper.find('.hi-upload').find('button').text()).toEqual('Upload')
      wrapper.unmount()
    })
  })

  it('can upload fileType', () => {
    const fileTypes = [
      { type: 'jpg', fileType: 'img' },
      { type: 'rar', fileType: 'zip' },
      { type: 'doc', fileType: 'word' },
      { type: 'pdf', fileType: 'pdf' },
      { type: 'ppt', fileType: 'ppt' },
      { type: 'xls', fileType: 'excel' },
      { type: 'key', fileType: 'key' },
      { type: 'exe', fileType: 'exe' },
      { type: 'mp4', fileType: 'video' },
      { type: 'mp3', fileType: 'audio' },
      { type: 'txt', fileType: 'other' }
    ]
    fileTypes.map(ft => {
      const mockFile = new File(['foo'], `foo.${ft.type}`)
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      wrapper.find('.hi-upload').find('input').simulate('change', {
        target: {
          files: [mockFile]
        }
      })
      expect(
        wrapper.instance().uploadRef.current.state['fileList'][
          wrapper.instance().uploadRef.current.state['fileList'].length - 1
        ].fileType === ft.fileType
      )
      wrapper.unmount()
    })
  })

  it('can upload', () => {
    const mockFile = new File(['foo'], 'foo.jpg')
    const wrapper = mount(
      <Upload
        localeDatas={localeDatas}
        uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
      />
    )
    wrapper.find('.hi-upload').find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    requests[0].respond(200, {}, `[""]`)
    wrapper.find('.hi-upload').find('button').simulate('click')
    expect(wrapper.find('input').instance().value).toBe('')
    wrapper.unmount()
  })
  it('on error', () => {
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    const wrapper = mount(
      <Upload
        localeDatas={localeDatas}
        uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
      />
    )
    clock.tick(400)
    wrapper.find('.hi-upload').find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    requests[0].respond(500, {}, `[""]`)
    wrapper.unmount()
  })
  it('avatar', () => {
    // TODO: 测试覆盖率的关键在于 mock fileReader
    let dummyFileReader = {
      result:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAYAAACPgGwlAAAFJElEQVR4Xu2dS0hUURzG/1Yqlj2otJe10AqCoiJaFFTUpgcUhLaKCIogKCEiCl0U1SIIF1EIQlFEtCmkpbWSHlAQYRYUlI9Ie6nYmI9hfIx1LpzL3PGO/aeuM/r/f7PRufe7d873/ea75xw3ZjTumDtMeKlKIAPQVfF2zAK6PuaArpA5oAO6xgQUesacDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLQ8bpo+fft+ylxYSJ23LvpisOfNST/N7ENniYa9/0xy4GsTdT+6+09Yx9t4/slEgovSDt2EO3P3YcoqWuUMsWln3oihFlTWUlbhSvf4UKid2iqOUfhVrXussKZ9xHXh10/oW1lxUnmNt/EkNXimOK3QTTtn7Sv1DDUees66rTT/3B0a/NFCvc9raOqf9+YL0PfiIX0/f8ADPdrXTZEPde6xyMd66rx5wXlvnwThN8/cL4ttc7S3i0L3rjqaVI2HyWdMZGmFbhwtvv7cgZm7ZS9NyS/wbboBb1ttwQy2tdLng2s90OOPxSa24FI15azZTAOtDdRyZAOZe84ru0GTps2g0P1r7pcjVeMZE5rMm6Yduh3nktt1CaHHesk/XUW5W4sp8v4lfTm5ywN9eCBCQz/baOBLE0Ua3rgg4z/DPCUmz5xD2SvWU6IpIBXjYTIKXDahoNtHvUmho/KMZ5HmN6f31FZT2+Wjbmix12dkZtNoTwYO9P8dT+A0mTecMNBNwPmnKmnyrDyKhxnv1U4B0d5f9KmkyHPaPinMwfYrJxKu7v8GPajxMDkFKpsQ0JMJ2KZjmm8e9817CjxNt/O4Odjf+JZaj2/zDXQ06EGNJ1CSSdws7dDNAsvsr7OXr3UWVeG6x87wv5WXOD9jAzZbtf7md669nscP3KbOLa2gaE+Xc27axl2UWbB0xLxvFmnmuJnTzU/7e+wuIJXjSYJToNK0Q/ebi41Du3Xz20bZBGJX3fH3Mav0jqpyd9Xvt3o3W0Ezt492H/tZQY8nUIpJ3izt0J39s8/L7q9N03NWb/LVhOuferZyWYuX0WDnD2evHv+XOPs5sdc4+/RFRX+eECFnn25eqRpPkpwClacdeqBucDNWAoDOikmWCNBl8WS5AXRWTLJEgC6LJ8sNoLNikiUCdFk8WW4AnRWTLBGgy+LJcgPorJhkiQBdFk+WG0BnxSRLBOiyeLLcADorJlkiQJfFk+UG0FkxyRIBuiyeLDeAzopJlgjQZfFkuQF0VkyyRIAuiyfLDaCzYpIlAnRZPFluAJ0VkywRoMviyXID6KyYZIkAXRZPlhtAZ8UkSwTosniy3AA6KyZZIkCXxZPlBtBZMckSAbosniw3gM6KSZYI0GXxZLkBdFZMskSALosnyw2gs2KSJQJ0WTxZbgCdFZMsEaDL4slyA+ismGSJAF0WT5YbQGfFJEsE6LJ4stwAOismWSJAl8WT5QbQWTHJEgG6LJ4sN4DOikmWCNBl8WS5AXRWTLJEgC6LJ8sNoLNikiUCdFk8WW4AnRWTLNFvXskYA3TG3JwAAAAASUVORK5CYII='
    }
    dummyFileReader.readAsDataURL = file => {
      if (dummyFileReader.onload) {
        dummyFileReader.onload({ target: { result: dummyFileReader.result } })
      }
    }
    window.FileReader = jest.fn(() => dummyFileReader)
    Object.defineProperty(Image.prototype, 'complete', { value: true })
    Object.defineProperty(Image.prototype, 'naturalHeight', { get: () => 120 })
    Object.defineProperty(Image.prototype, 'naturalWidth', { get: () => 120 })

    const wrapper = mount(
      <Upload
        type="avatar"
        uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
        onChange={(file, fileList, response) => {
          file.id = 'file唯一标识'
        }}
        onRemove={(file, fileList, index) => {
          return new Promise((resolve, reject) => resolve(true))
        }}
        localeDatas={localeDatas}
        params={{ id: 'uid', channel: 'youpin' }}
        name={'files[]'}
        fileList={[]}
      />
    )
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    expect(wrapper.instance().uploadRef.current.state['showCropperModal']).toBeTruthy()

    wrapper.find('button').at(1).simulate('click')
    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.instance().uploadRef.current.state['showCropperModal']).toBeFalsy()
    wrapper.find('.hi-upload__item-mask').at(0).simulate('click')
    wrapper.find('.hi-preview__close').simulate('click')
    expect(wrapper.instance().uploadRef.current.state['showModal']).toBeFalsy()
    wrapper.unmount()
  })

  it('should can preview', () => {
    const wrapper = mount(
      <Upload
        type="photo"
        uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
        onChange={(file, fileList, response) => {
          file.id = 'file唯一标识'
        }}
        onRemove={(file, fileList, index) => {
          return new Promise((resolve, reject) => resolve(true))
        }}
        localeDatas={localeDatas}
        params={{ id: 'uid', channel: 'youpin' }}
        name={'files[]'}
        fileList={[
          {
            name: 'b.png',
            fileType: 'img',
            uploadState: 'success',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          },
          {
            name: 'a.png',
            fileType: 'img',
            uploadState: 'success',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          }
        ]}
      />
    )
    wrapper.find('.hi-upload__item-mask').at(0).simulate('click')
    expect(wrapper.instance().uploadRef.current.state['showModal']).toBeTruthy()
    wrapper.find('Preview Icon').at(0).simulate('click')
    wrapper.find('Preview Icon').at(1).simulate('click')
    wrapper.find('Preview Icon').at(2).simulate('click')
    wrapper.find('Preview Icon').at(3).simulate('click')
    wrapper.find('Preview Icon').at(4).simulate('click')
    wrapper.find('Preview Icon').at(5).simulate('click')
    wrapper.find('Preview Icon').at(6).simulate('click')
    expect(wrapper.find('Preview img').at(0).prop('style').transform).toEqual(
      'translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1)'
    )

    wrapper
      .find('.hi-preview__image')
      .simulate('mousedown', { target: { nativeEvent: { clientX: 1214, clientY: 350 } } })
    wrapper.find('.hi-preview').simulate('mousemove')
    wrapper
      .find('.hi-preview__image')
      .simulate('mouseup', { target: { nativeEvent: { clientX: 987, clientY: 349 } } })

    wrapper.find('.hi-preview').simulate('wheel', { wheelDelta: 1 })
    wrapper.find('.hi-preview').simulate('wheel', { wheelDelta: 0 })
    wrapper.find('.hi-preview').simulate('wheel', { detail: 1 })
    // expect(wrapper.find('Preview img').at(0).prop('style').transform).toEqual(
    //   'translateX(633px) translateY(46px) rotate(0deg) scaleX(1) scaleY(1)'
    // )
    wrapper.find('.hi-preview__close').simulate('click')
    expect(wrapper.instance().uploadRef.current.state['showModal']).toBeFalsy()
    wrapper.find('input').simulate('click')
    expect(wrapper.find('input').instance().value).toBe('')
    wrapper.unmount()
  })

  it('should can drag', () => {
    const wrapper = mount(
      <Upload
        type="drag"
        uploadAction="http://www.mocky.io/v2/5dc3b4413000007600347501"
        onChange={(file, fileList, response) => {
          file.id = 'file唯一标识'
        }}
        onRemove={(file, fileList, index) => {
          return new Promise((resolve, reject) => resolve(true))
        }}
        localeDatas={localeDatas}
        params={{ id: 'uid', channel: 'youpin' }}
        name={'files[]'}
        defaultFileList={[
          {
            name: 'b.png',
            fileType: 'img',
            uploadState: 'success',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          }
        ]}
      />
    )
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    wrapper.find('.hi-upload--drag').simulate('dragover', {
      dataTransfer: {
        files: [mockFile]
      }
    })
    expect(wrapper.instance().uploadRef.current.state['overEvent']).toBeTruthy()
    wrapper.find('.hi-upload--drag').simulate('dragleave', {
      dataTransfer: {
        files: [mockFile]
      }
    })
    expect(wrapper.instance().uploadRef.current.state['overEvent']).toBeFalsy()
    wrapper.find('.hi-upload--drag').simulate('drop', {
      dataTransfer: {
        files: [mockFile]
      }
    })
    expect(
      wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
    ).toHaveLength(3)
    wrapper.unmount()
  })

  it('show upload list', () => {
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })

    // TODO: 目前只有 type === 'default' 和 type === 'pictureCard' 支持 showUploadList 为 false 时隐藏上传列表
    types.forEach((type, index) => {
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          type={type}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      wrapper.find('.hi-upload').find('input').simulate('change', {
        target: {
          files: [mockFile]
        }
      })
      expect(wrapper.find('.hi-upload').find('ul.hi-upload__list')).toHaveLength(1)
      wrapper.setProps({ showUploadList: false })
      if (['default', 'pictureCard'].includes(type)) {
        expect(wrapper.find('.hi-upload').find('ul.hi-upload__list')).toHaveLength(0)
      }
    })
  })

  it('show default file list', () => {
    types.forEach(type => {
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          type={type}
          defaultFileList={[
            {
              name: 'a.png',
              fileType: 'img',
              uploadState: 'success',
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
            },
            {
              name: 'b.png',
              fileType: 'img',
              uploadState: 'error',
              url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
            }
          ]}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      if (['default', 'pictureCard'].includes(type)) {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(2)
      } else if (type === 'avatar') {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      } else {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(3)
      }
      wrapper.unmount()
    })
  })

  it('fileList has priority over defaultFileList', () => {
    types.forEach(type => {
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          type={type}
          fileList={[
            {
              name: 'a.png',
              fileType: 'img',
              uploadState: 'success',
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
              fileType: 'img',
              uploadState: 'success',
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
            }
          ]}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      if (['default', 'pictureCard'].includes(type)) {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(2)
      } else if (type === 'avatar') {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      } else {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(3)
      }
      wrapper.unmount()
    })
  })

  it('file list is controlled', () => {
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    types.forEach((type, index) => {
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          type={type}
          fileList={[
            {
              name: 'a.png',
              fileType: 'img',
              uploadState: 'success',
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
            }
          ]}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      // avatar 类型下只允许展示一张图片
      if (type !== 'avatar') {
        wrapper.find('.hi-upload').find('input').simulate('change', {
          target: {
            files: [mockFile]
          }
        })
      }
      if (['default', 'pictureCard'].includes(type)) {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(2)
      } else if (type === 'avatar') {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      } else {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(3)
      }
      wrapper.setProps({
        defaultFileList: [
          {
            name: 'a.png',
            fileType: 'img',
            uploadState: 'success',
            url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
          },
          {
            name: 'b.png',
            fileType: 'img',
            uploadState: 'error',
            url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
          }
        ]
      })
      if (['default', 'pictureCard'].includes(type)) {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(2)
      } else if (type === 'avatar') {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      } else {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(3)
      }
      wrapper.setProps({
        fileList: []
      })
      if (['default', 'pictureCard'].includes(type)) {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(0)
      } else if (['avatar', 'photo'].includes(type)) {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      } else {
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(0)
      }
      wrapper.unmount()
    })
  })

  it('should stop upload when return value of beforeUpload is not true', () => {
    const fileList = [
      {
        name: 'a.png',
        fileType: 'img',
        uploadState: 'success',
        url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
      }
    ]
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    const props = {
      uploadAction: 'https://www.mocky.io/v2/5dc3b4413000007600347501',
      fileList,
      localeDatas,
      beforeUpload: () => false,
      onChange: () => {}
    }

    const wrapper = mount(<Upload {...props} />)
    const spyFunc = jest.spyOn(wrapper.instance().uploadRef.current, 'uploadFile')
    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    expect(spyFunc).not.toHaveBeenCalled()
    wrapper.setProps({ beforeUpload: () => true })
    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    expect(spyFunc).toHaveBeenCalled()
    spyFunc.mockRestore()
    wrapper.unmount()
  })

  it('should stop upload when file size is bigger than maxSize', () => {
    const fileList = [
      {
        name: 'a.png',
        fileType: 'img',
        uploadState: 'success',
        url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
      }
    ]
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    const props = {
      uploadAction: 'https://www.mocky.io/v2/5dc3b4413000007600347501',
      fileList,
      localeDatas,
      maxSize: 0.001,
      onChange: () => {}
    }

    const wrapper = mount(<Upload {...props} />)
    const spyFunc = jest.spyOn(wrapper.instance().uploadRef.current, 'uploadFile')
    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    expect(spyFunc).not.toHaveBeenCalled()
    wrapper.setProps({ maxSize: 1 })
    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    expect(spyFunc).toHaveBeenCalled()
    spyFunc.mockRestore()
    wrapper.unmount()
  })
  it('should not invoke onChange when customUpload exist', () => {
    const fileList = [
      {
        name: 'a.png',
        fileType: 'img',
        uploadState: 'success',
        url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
      }
    ]
    const mockFile = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    const props = {
      uploadAction: 'https://www.mocky.io/v2/5dc3b4413000007600347501',
      fileList,
      localeDatas,
      maxSize: 0.001,
      customUpload: jest.fn(),
      onChange: jest.fn()
    }

    const wrapper = mount(<Upload {...props} />)
    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile]
      }
    })
    expect(wrapper.prop('customUpload')).toHaveBeenCalled()
    expect(wrapper.prop('onChange')).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('can remove', () => {
    types.forEach((type, index) => {
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          type={type}
          fileList={[
            {
              name: 'a.png',
              fileType: 'img',
              uploadState: 'success',
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
            }
          ]}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      if (['photo', 'avatar'].includes(type)) {
        wrapper
          .find('.hi-upload')
          .find('ul.hi-upload__list')
          .not('.hi-upload__item--upload')
          .simulate('mouseover')
        wrapper
          .find('.hi-upload')
          .find('ul.hi-upload__list')
          .not('.hi-upload__item--upload')
          .find('Icon.hi-upload__photo-del')
          .simulate('click')
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      } else if (type === 'drag') {
        wrapper.find('.hi-upload').find('span.hi-upload__operate-icon').simulate('click')
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(0)
      } else {
        wrapper.find('.hi-upload').find('.icon-delete').simulate('click')
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(0)
      }
      wrapper.unmount()
    })
  })
  it('can not remove file when onRemove return false', () => {
    types.forEach((type, index) => {
      const wrapper = mount(
        <Upload
          localeDatas={localeDatas}
          type={type}
          fileList={[
            {
              name: 'a.png',
              fileType: 'img',
              uploadState: 'success',
              url: 'https://i8.mifile.cn/a1/pms_1531116957.78852376.jpg'
            }
          ]}
          onRemove={() => {
            return false
          }}
          uploadAction="https://www.mocky.io/v2/5dc3b4413000007600347501"
        />
      )
      if (['photo', 'avatar'].includes(type)) {
        wrapper
          .find('.hi-upload')
          .find('ul.hi-upload__list')
          .not('.hi-upload__item--upload')
          .simulate('mouseover')
        wrapper
          .find('.hi-upload')
          .find('ul.hi-upload__list')
          .not('.hi-upload__item--upload')
          .find('Icon.hi-upload__photo-del')
          .simulate('click')
        if (type === 'photo') {
          expect(
            wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
          ).toHaveLength(2)
        } else {
          expect(
            wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
          ).toHaveLength(1)
        }
      } else if (type === 'drag') {
        wrapper.find('.hi-upload').find('span.hi-upload__operate-icon').simulate('click')
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(2)
      } else {
        wrapper.find('.hi-upload').find('.icon-delete').simulate('click')
        expect(
          wrapper.find('.hi-upload').find('ul.hi-upload__list').find('li.hi-upload__item')
        ).toHaveLength(1)
      }
      wrapper.unmount()
    })
  })
})
