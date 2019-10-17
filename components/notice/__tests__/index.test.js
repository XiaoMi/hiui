import React from 'react'
import { mount }  from  'enzyme'
import { spy } from 'sinon'
import Notice from '../Notice'
import NoticeContainer from '../NoticeContainer'
import Index from '../index'

describe('Notice', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  
  describe('Lifecycle', () => {
      it ('componentDidMount', () => {
          const callback = spy()
          const componentDidMountSpy = spy(Notice.prototype, 'componentDidMount')
  
          const wrapper = mount(< Notice  onClose={callback}  duration= { null }/>)
  
          expect(wrapper.find(Notice).instance()).toBeInstanceOf(Notice)
          expect(componentDidMountSpy.callCount).toEqual(1)
          expect(wrapper.state('open')).toBeTruthy()
  
          componentDidMountSpy.restore()
      })
  
      it('componentWillunmount', () => {
          const  callback = spy()
          const componentWillunmountSpy = spy(Notice.prototype, 'componentWillUnmount')
          const wrapper = mount( < Notice onClose={callback}  /> )
  
          wrapper.unmount()
  
          expect(componentWillunmountSpy.callCount).toEqual(1)
          componentWillunmountSpy.restore()
          
      })
  })
  
  
  describe('PropTypes', () => {
  
      it('closeable', () => {
        const callback = spy()
        const prefix = 'prefix'
        const wrapper = mount(
          <Notice  prefix = {prefix} onClose={callback} />
        )
        expect(wrapper.find(`.hi-prefix-button`)).toHaveLength(0);

        wrapper.setProps({
          closeable: true
        })

        expect(wrapper.find(`.hi-prefix-button`)).toHaveLength(1);
        const wrapperLastChild = wrapper.find(`.hi-prefix-button`)

        expect(wrapper.state('open')).toBeTruthy()
        wrapperLastChild.simulate('click')
        expect(wrapper.state('open')).toBeFalsy()
  
      })
  
      it('children', () => {
        const callback = spy()
        const Children = function() {
           return <div>children</div>
        }
        const wrapper = mount(
          <Notice onClose={callback} ><Children /></Notice>
        )
  
        expect(wrapper.find(Children)).toHaveLength(1)
      })
  
      it('prefix', () => {
        const callback = spy()
         const prefix = 'prefix'
         const wrapper = mount(
           <Notice prefix={prefix}  onClose={callback} />
         )
  
         expect(wrapper.find(`.hi-prefix`)).toHaveLength(1)

      })
  
  
  
      it('type', () => {
        const callback = spy()
        const prefix = 'prefix'
        const wrapper = mount(
          <div>
            <Notice type='info' prefix ={prefix}  onClose={callback} />
            <Notice type='error' prefix ={prefix} onClose={callback} />
            <Notice type='success' prefix ={prefix} onClose={callback} />
            <Notice type='warning' prefix ={prefix} onClose={callback} />
          </div>
        )


        expect(wrapper.find(`.hi-prefix--info`)).toHaveLength(1)
        expect(wrapper.find(`.hi-prefix--error`)).toHaveLength(1)
        expect(wrapper.find(`.hi-prefix--success`)).toHaveLength(1)
        expect(wrapper.find(`.hi-prefix--warning`)).toHaveLength(1)
      })

      it('duration', () => {
        const callback = spy()
        const wrapper = mount(
          <Notice onClose={callback}  />
        )
        expect(wrapper.state('open')).toEqual(true)
        wrapper.setProps({
          duration: 1000
        })
        jest.runAllTimers()
        expect(wrapper.state('open')).toEqual(false)
      })
  })
})

const queue =[
  {
    key: 1,
    noticeId: 1,
    onClose: spy(),
    duraction: 1000,
    type: 'sucess',
    closeable: true,
    onConfirm: 'onConfirm',
    content: 'content'
  },
  {
    key: 2,
    noticeId: 2,
    onClose: spy(),
    duraction: 1000,
    type: 'sucess',
    closeable: true,
    onConfirm: 'onConfirm',
    content: 'content'
  }
]
describe('NoticeContainer', () => {
    describe('PropTypes', () => {
      it('prefix', () => {
        const prefix = 'prefix';
        const wrapper = mount(<NoticeContainer  prefix = { prefix }/>)
        wrapper.setState({
          queue: queue
        })

        expect(wrapper.find(`.hi-prefix__container`)).toHaveLength(1)
        expect(wrapper.find(Notice)).toHaveLength(2)
        
        //对其中的Notice的属性进行检测

        console.log(wrapper.debug())
        // console.log(wrapper.find(Notice).at(0))
        console.log(wrapper.find(Notice).at(0).state('key'))
        // expect(wrapper.find(Notice).at(0).key).toEqual('1')
        // expect(wrapper.find(Notice).at(1).prop('key')).toEqual(expect.assertions(2))

        // queue.map((notice, index) => {
        //    expect(wrapper.find(Notice).at(index).prop('key')).toEqual(notice[index].key)
        //    expect(wrapper.find(notice).at(index).prop('id')).toEqual(notice[index].id)
        //    expect(wrapper.find(Notice).at(index)).prop('duration').toEqual(notice[index].duraction)
        //    expect(wrapper.find(Notice).at(index)).prop('type').toEqual(notice[index].type)
        //    expect(wrapper.find(Notice).at(index)).prop('onConfirm').toEqual(notice[index].onConfirm)
        //    expect(wrapper.find(Notice).at(index).text()).toEqual(expect.stringContaining(notice[index].content))
        //   //  expect(wrapper.find(Notice).at(index)).prop('duration').toEqual(notice[index].duraction)
        //   //  expect(wrapper.find(Notice).at(index)).prop('duration').toEqual(notice[index].duraction)

        // })

      })

      it('could be closed', () => {
        const onClose = jest.fn()
        const wrapper = mount(<Notice onClose = { onClose } />)
        wrapper.find(Notice).find('.hi-prefix-button').simulate('click')
        expect(onClose).toBeCalled()
        // expect(wrapper.find('.hi-alert')).toHaveLength(0)
      })
    })
})

describe('Index', () => {
   describe('open', () => {
      const callback = spy();

   })

   describe('close', () => {

   })
})
