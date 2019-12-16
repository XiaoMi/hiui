import React from 'react'
import { mount } from 'enzyme'
import { wrapInTestContext,getBackendFromInstance } from 'react-dnd-test-utils'
import { DragDropContext } from 'react-dnd'
import TestUtils from 'react-dom/test-utils'
import Tree from '../index'
import _Tree from '../Tree'
function trigger(elem, event){

  var myEvent = document.createEvent('Event')        // 初始化这个事件对象，为它提高需要的“特性”

  myEvent.initEvent(event, true, true);        //执行事件

  elem.dispatchEvent(myEvent);

}
class Foo extends React.Component {
  constructor(props){
    super(props)
    this.treeData = [
      { id: 1, title: '小米人',
        children: [
          { id: 2, title: '技术',
            children: [
              { id: 3, title: '后端',disabled:true },
              { id: 4, title: '运维' },
              { id: 5, title: '前端' }
            ]
          },
          { id: 6, title: '产品' }
        ]
      },
      { id: 11, title: '小米2',
        children: [
          { id: 22, title: '技术2', expand: true,
            children: [
              { id: 33, title: '后端2' },
              { id: 44, title: '运维2' },
              { id: 55, title: '前端2' }
            ]
          },
          { id: 66, title: '产品2' }
        ]
      },
    ]
    this.state = {
      checkedKeys: []
    }
  }
  render() {
    return (
      <div style={{width:300}}>
        <Tree
          checkable
          editable={true}
          data={this.treeData}
          checkedIds={this.state.checkedKeys}
          onChange={(checkedKeys, title, bool, semi) => {
            console.log('Tree data:', checkedKeys, title, bool ,semi)
            this.setState({
              checkedKeys
            })
          }}
          highlightable
          onClick={data=>{console.log('tree node click',data)}}
        />
      </div>
    )
  }
}
describe('tree', () => {
    const treeData = [
      { id: 1, title: '小米',
        children: [
          { id: 2, title: '技术', disabled: true,
            children: [
              { id: 3, title: '后端', onClick: data => {console.log('后端：', data)} , disabled: true},
              { id: 4, title: '运维' },
              { id: 5, title: '前端' }
            ]
          },
          { id: 6, title: '产品' }
        ]
      },
      { id: 11, title: '小米',
        children: [
          { id: 22, title: '技术',
            children: [
              { id: 33, title: '后端' },
              { id: 44, title: '运维' },
              { id: 55, title: '前端' }
            ]
          },
          { id: 66, title: '产品' }
        ]
      },
    ]
    it('basic And defaultExpandAll',()=>{
            const wrapper = mount(
              <div style={{width:500}}>
                <Tree
                  data={treeData}
                  defaultExpandAll
                  onChange={data => {console.log('Tree data:', data)}}
                  highlightable
                  onClick={(item) => console.log('------click node', item)}
                />
              </div>
            )
            expect(wrapper.find('.hi-tree')).toHaveLength(1)
            wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
            expect(wrapper.find('.can-expand')).toHaveLength(3)
            expect(wrapper.find('.is-root').at(0).find('ul')).toHaveLength(0)
            wrapper.unmount();
        })
      it('should checkable',()=>{
            const wrapper = mount(
              <Foo/>
            )
            expect(wrapper.find('.hi-tree')).toHaveLength(1)
            expect(wrapper.find('.hi-checkbox-legacy__input')).toHaveLength(2)
            expect(wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input')).toHaveLength(1)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--checked')).toHaveLength(1)
            wrapper.unmount()
        })
      it('ContextMenuOption',()=>{
        const fn = jest.fn()
        const wrapper = mount(
          <div style={{width:500}}>
            <Tree
              editable={true}
              data={treeData}
              onSave={(saveNode, data) => {
                console.log(saveNode, data)
              }}
              onDelete={(deleteNode, data) => {
                console.log(deleteNode, data)
              }}
              contextMenu={
                [{
                  title: '自定义',
                  onClick: (item, node) => {
                    fn()
                  }
                }]
              }
              onChange={data => {console.log('Tree data:', data)}}
              highlightable
            />
          </div>
        )
            expect(wrapper.find('.hi-tree')).toHaveLength(1)
            // 编辑节点
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(0).simulate('click')
            expect(fn).toHaveBeenCalled();
            
            wrapper.unmount()
      })
      it('should editable Node CRUD For contextMenu And apperance Is line',()=>{
            const wrapper = mount(
              <div style={{width:500}}>
                <Tree
                  data={treeData}
                  editable={true}
                  apperance="line"
                  onSave={(saveNode, data) => {
                    console.log('save')
                  }}
                  onDelete={(deleteNode, data) => {
                    console.log('delete')
                  }}
                  onChange={data => {}}
                  highlightable
                  onClick={(item) => {}}
                />
              </div>
            )
            expect(wrapper.find('.hi-tree')).toHaveLength(1)
            expect(wrapper.find('.hi-tree--show-line')).toHaveLength(1)
            // console.log(wrapper.debug())
            // 编辑节点
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').simulate('contextmenu')
            expect(document.querySelectorAll('.right-click-menu')).toHaveLength(1)

            wrapper.find('.right-click-menu li').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(1)
            expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(1)

            wrapper.find('.is-root').at(0).find('.editing').find('span').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(0)
            expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(0)

            wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('ul li')).toHaveLength(2)
            // 添加子节点
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(1).simulate('click')
            wrapper.find('.is-root').at(0).find('.editing').find('span').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('ul li')).toHaveLength(3)
            
            // 添加节点取消
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(2).simulate('click')
                
            wrapper.find('.editing').find('span').at(1).simulate('click')
            expect(wrapper.find('.is-root')).toHaveLength(2)

            // 添加节点确定
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(2).simulate('click')
                
            wrapper.find('.editing').find('span').at(0).simulate('click')
            expect(wrapper.find('.is-root')).toHaveLength(3)
            // 删除节点
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(3).simulate('click')
                
            wrapper.find('.hi-btn--type--primary').at(0).simulate('click')
            expect(wrapper.find('.is-root')).toHaveLength(2)
            wrapper.unmount()
        })
        it('should searchable',()=>{
          const wrapper = mount(
            <div style={{width:500}}>
              <Tree
                searchable={true}
                data={treeData}
                onChange={data => {console.log('Tree data:', data)}}
                highlightable
                onClick={(item) => console.log('------click node', item)}
              />
            </div>
          )
          expect(wrapper.find('.hi-tree__searcher')).toHaveLength(1)
          wrapper.find('input').simulate('change',{target:{value:'小米'}})
          expect(wrapper.find('.is-root')).toHaveLength(2)
        })
        it('should draggable',()=>{
          const wrapper = mount(
            <div style={{width:500}}>
              <Tree
                defaultExpandAll
                draggable={true}
                data={treeData}
                onDragStart = {(dragNode)=> {
                  console.log(dragNode)
                }}
                onDropEnd = {(dragNode,dropNode)=> {
                  console.log(dragNode,dropNode)
                }}
                onChange={data => {console.log('Tree data:', data)}}
                highlightable
                onClick={(item) => console.log('------click node', item)}
              />
            </div>
          )
          wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('drag')
        })
})