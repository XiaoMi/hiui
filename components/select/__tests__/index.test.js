import React from 'react'
import { mount,shallow } from 'enzyme'
import Select from '../'
/* eslint-env jest */
const changeCallback = jest.fn(items => items)
const successCallback = jest.fn(res => res.data)
const errorCallback = jest.fn(err => err)
jest.mock('lodash/debounce', () => jest.fn(fn => fn))
const options = [
  { title:'电视', id:'3', disabled: true },
  { title:'手机', id:'2' },
  { title:'笔记本', id:'4' },
  { title:'生活周边', id:'5' },
  { title:'办公', id:'6' },
]
const multiOptions = [
  { title: '手机', id: '2' },
  { title: '小米2', id: '2-1' },
  { title: '小米3', id: '2-2' },
  { title: '小米4', id: '2-3' },
  { title: '小米5', id: '2-4' },
  { title: '电脑', id: '3' },
  { title: '笔记本', id: '4' },
  { title: '生活周边', id: '5' },
  { title: '其它', id: '6' }
]
const types = ['single', 'multiple']
describe('Select', () => {
  // beforeEach(() => {
  //   jest.useFakeTimers()
  //   jest.setTimeout(10000)
  // })

  // afterEach(() => {
  //   wrapper && wrapper.unmount()
  //   changeCallback.mockClear()
  //   jest.useRealTimers()
  // })

  it('should disabled', () => {
    types.forEach(type=>{
      const wrapper = mount(
        <Select
          type={type}
          disabled
          style={{ width: 200 }}
          data={options}
        />
      )

      expect(wrapper.find('.hi-select__input').hasClass('disabled')).toEqual(true)
      wrapper.find('.hi-select__input').simulate('click')
      expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(false)
    })
  })

  it('should have default value', () => {
    types.forEach((type)=>{
      const wrapper = mount(
        <Select
          type={type}
          style={{ width: 200 }}
          data={type ==='single' ? options : multiOptions}
          defaultValue={type ==='single' ? '3' : ['2', '3']}
        />
      )
      if (type === 'single') {
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual('电视')
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document.querySelectorAll('.hi-select__dropdown--item')[2].click()
        wrapper.update()
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(false)
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual('笔记本')
      }

      if (type === 'multiple') {
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item').map(val => val.find('.hi-select__input--item__name').text())).toEqual(['手机', '电脑'])
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document.querySelectorAll('.hi-select__dropdown')[1].querySelectorAll('.hi-select__dropdown--item')[2].click()
        wrapper.update()
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item').map(val => val.find('.hi-select__input--item__name').text())).toEqual(['手机', '电脑', '小米3'])
      }
    })
  })

  it('should control by value', () => {
    types.forEach((type)=>{
      const wrapper = mount(
        <Select
          type={type}
          style={{ width: 200 }}
          data={type ==='single' ? options : multiOptions}
          value={type ==='single' ? '2' : ['2', '4']}
          defaultValue={type ==='single' ? '3' : ['2', '3']}
        />
      )
      if (type === 'single') {
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual('手机')
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document.querySelectorAll('.hi-select__dropdown--item')[2].click()
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual('手机')
        wrapper.setProps({
          value: '6'
        })
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item__name').text()).toEqual('办公')
      }

      if (type === 'multiple') {
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item').map(val => val.find('.hi-select__input--item__name').text())).toEqual(['手机', '笔记本'])
        wrapper.find('.hi-select__input').simulate('click')
        expect(wrapper.find('.hi-select__popper').prop('show')).toEqual(true)
        document.querySelectorAll('.hi-select__dropdown')[1].querySelectorAll('.hi-select__dropdown--item')[2].click()
        expect(wrapper.find('.hi-select__input').find('.hi-select__input--item').map(val => val.find('.hi-select__input--item__name').text())).toEqual(['手机', '笔记本'])
      }
    })
  })

  // it('单选', () => {
  //   wrapper = mount(
  //     <Select
  //       mode='single'
  //       clearable={false}
  //       style={{width: '200px'}}
  //       list={options}
  //       value='3'
  //       onChange={changeCallback}
  //     />
  //   )

  //   wrapper.find('SelectInput').simulate('click') // 展开
  //   expect(document.querySelectorAll('.hi-select__popper')).toHaveLength(1)

  //   expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('3')
  //   document.querySelectorAll('.hi-select__dropdown--item')[2].click() // 测试disabled
  //   expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('3')
  //   expect(changeCallback.mock.results.length).toBe(0)

  //   document.querySelectorAll('.hi-select__dropdown--item')[0].click() // 测试点击选项
  //   expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('2')
  //   expect(document.querySelectorAll('.hi-popper__container--hide')).toHaveLength(1) // 选项面板是否隐藏
  //   expect(changeCallback.mock.results[0].value[0].id).toEqual('2') // onChange
  // })

  // it('自定义模板', () => {
  //   wrapper = mount(
  //     <Select
  //       placeholder='请选择种类'
  //       style={{width: '200px'}}
  //       value={'3'}
  //       list={options}
  //       searchable={true}
  //       onChange={changeCallback}
  //       dropdownRender={(item, isSelected) => {
  //         return (
  //           <React.Fragment>
  //             <span className="option-left" style={{float: 'left'}}>{item.name}</span>
  //             <span className="option-right" style={{float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
  //           </React.Fragment>
  //         )
  //       }}
  //     />
  //   )

  //   wrapper.find('SelectInput').simulate('click') // 展开
  //   expect(document.querySelectorAll('.option-left')).toHaveLength(5) // 测试自定义模板
  //   expect(document.querySelectorAll('.option-right')).toHaveLength(5)

  //   wrapper.find('input').simulate('change', { target: { value: '1' } }) // 测试搜索
  //   expect(document.querySelectorAll('.option-right')).toHaveLength(0) // 无搜索结果
  //   wrapper.find('input').simulate('change', { target: { value: '2' } })
  //   expect(document.querySelectorAll('.option-right')).toHaveLength(1)
  //   document.querySelectorAll('.hi-select__dropdown--item')[0].click()
  //   expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('2')
  //   expect(changeCallback.mock.results[0].value[0].id).toEqual('2')
  // })

  // it('异步单选', (done) => {
  //   const _document = document
  //   const mockSuccessResponse = {
  //     'success': true,
  //     'code': 200,
  //     'data': [
  //       {'name': '1-0', 'id': '0'},
  //       {'name': '1-1', 'id': '1'},
  //       {'name': '1-2', 'id': '2'},
  //       {'name': '1-3', 'id': '3'}
  //     ]
  //   }
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
  //   const mockFetchPromise = Promise.resolve({ // 3
  //     json: () => mockJsonPromise
  //   })
  //   jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

  //   wrapper = mount(
  //     <Select
  //       mode='single'
  //       origin={{
  //         type: 'GET',
  //         headers: {token: 'tokenXXXXXXX'},
  //         mode: 'cors',
  //         credentials: 'same-origin',
  //         url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
  //         func: successCallback
  //       }}
  //       placeholder='请选择种类'
  //       style={{width: '200px'}}
  //       onChange={changeCallback}
  //     />
  //   )
  //   wrapper.find('SelectInput').simulate('click') // 展开
  //   wrapper.find('input').simulate('change', { target: { value: '1' } }) // 测试搜索

  //   expect(global.fetch).toHaveBeenCalledTimes(1)
  //   expect(global.fetch).toHaveBeenCalledWith(
  //     'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options?keyword=1',
  //     {
  //       'credentials': 'same-origin',
  //       'headers': {'token': 'tokenXXXXXXX'},
  //       'method': 'GET',
  //       'mode': 'cors'
  //     }
  //   )
  //   process.nextTick(() => {
  //     expect(_document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(4)
  //     _document.querySelectorAll('.hi-select__dropdown--item')[0].click()
  //     expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('0')
  //     expect(changeCallback.mock.results[0].value[0].id).toEqual('0')

  //     global.fetch.mockClear()
  //     done()
  //   })
  // })

  // it('多选', () => {
  //   wrapper = mount(
  //     <Select
  //       mode='multiple'
  //       style={{width: '300px'}}
  //       optionWidth={400}
  //       multipleMode="nowrap"
  //       list={multiOptions}
  //       value={['4', '5', '2', '3']}
  //       searchable={true}
  //       showCheckAll={true}
  //       placeholder='请选择...'
  //       noFoundTip='无匹配数据'
  //       onChange={changeCallback}
  //     />
  //   )

  //   // expect(wrapper.find('.hi-select__input-items--left-count').text()).toEqual('1')
  //   expect(wrapper.find('.hi-select__input--item')).toHaveLength(4)
  //   wrapper.find('.hi-select__input--item__remove').at(0).simulate('click') // 删除第一个
  //   expect(wrapper.find('.hi-select__input--item')).toHaveLength(3)
  //   expect(changeCallback.mock.results[0].value).toHaveLength(3)

  //   wrapper.find('SelectInput').simulate('click') // 展开
  //   document.querySelectorAll('.hi-select__dropdown--item')[1].click() // 选择第二项
  //   expect(changeCallback.mock.results[1].value).toHaveLength(4)

  //   wrapper.find('SelectInput').simulate('click') // 展开
  //   document.querySelectorAll('.hi-select__dropdown--item')[1].click() // 取消选择第二项
  //   expect(changeCallback.mock.results[2].value).toHaveLength(3)

  //   wrapper.find('input').simulate('change', { target: { value: '0' } }) // 测试搜索
  //   expect(document.querySelectorAll('.hi-select__dropdown-item--empty')).toHaveLength(1) // 无搜索结果
  //   wrapper.find('input').simulate('change', { target: { value: '1' } })
  //   expect(document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(1)
  //   document.querySelectorAll('.hi-select__dropdown--item')[0].click()
  //   expect(changeCallback.mock.results[3].value).toHaveLength(4)
  // })

  // it('异步多选首次加载数据', (done) => {
  //   const _document = document
  //   const mockSuccessResponse = {
  //     'success': true,
  //     'code': 200,
  //     'data': [
  //       {'name': '1-0', 'id': '0'},
  //       {'name': '1-1', 'id': '1'},
  //       {'name': '1-2', 'id': '2'},
  //       {'name': '1-3', 'id': '3'}
  //     ]
  //   }
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
  //   const mockFetchPromise = Promise.resolve({ // 3
  //     json: () => mockJsonPromise
  //   })
  //   jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

  //   wrapper = mount(
  //     <Select
  //       mode='multiple'
  //       autoload={true}
  //       style={{width: '300px'}}
  //       multipleMode="nowrap"
  //       value="1"
  //       origin={{
  //         type: 'get',
  //         key: 'text',
  //         keyword: 'xiaomi',
  //         url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
  //         func: successCallback
  //       }}
  //       onChange={changeCallback}
  //     />
  //   )
  //   expect(global.fetch).toHaveBeenCalledTimes(1)
  //   expect(global.fetch).toHaveBeenCalledWith(
  //     'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options?text=xiaomi',
  //     {
  //       'keyword': 'xiaomi',
  //       'method': 'get'
  //     }
  //   )
  //   process.nextTick(() => { // 首次加载数据
  //     wrapper.find('SelectInput').simulate('click') // 展开
  //     expect(_document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(4)
  //     expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('1') // 默认选择项

  //     global.fetch.mockClear()
  //     done()
  //   })
  // })

  // it('异步多选', (done) => {
  //   const _document = document
  //   const mockSuccessResponse = {
  //     'success': true,
  //     'code': 200,
  //     'data': [
  //       {'name': '1-0', 'id': '0'},
  //       {'name': '1-1', 'id': '1'},
  //       {'name': '1-2', 'id': '2'},
  //       {'name': '1-3', 'id': '3'}
  //     ]
  //   }
  //   const mockJsonPromise = Promise.resolve(mockSuccessResponse) // 2
  //   const mockFetchPromise = Promise.resolve({ // 3
  //     json: () => mockJsonPromise
  //   })
  //   jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

  //   wrapper = mount(
  //     <Select
  //       mode='multiple'
  //       autoload={false}
  //       style={{width: '300px'}}
  //       multipleMode="nowrap"
  //       origin={{
  //         type: 'get',
  //         key: 'text',
  //         url: 'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options',
  //         func: successCallback
  //       }}
  //       onChange={changeCallback}
  //     />
  //   )
  //   wrapper.find('SelectInput').simulate('click') // 展开
  //   wrapper.find('input').simulate('change', { target: { value: '1' } }) // 测试搜索

  //   expect(global.fetch).toHaveBeenCalledTimes(1)
  //   expect(global.fetch).toHaveBeenCalledWith(
  //     'https://easy-mock.com/mock/5c1b42e3fe5907404e6540e9/hiui/select/options?text=1',
  //     {
  //       'method': 'get'
  //     }
  //   )
  //   process.nextTick(() => {
  //     wrapper.find('SelectInput').simulate('click') // 展开
  //     expect(_document.querySelectorAll('.hi-select__dropdown--item')).toHaveLength(4)

  //     _document.querySelectorAll('.hi-select__dropdown--item')[0].click() // 选择第一项
  //     expect(wrapper.find('Select').state('selectedItems')[0].id).toEqual('0')
  //     expect(changeCallback.mock.results[0].value[0].id).toEqual('0')

  //     global.fetch.mockClear()
  //     done()
  //   })
  // })
})
