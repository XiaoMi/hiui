import React from 'react'
import { mount, shallow} from 'enzyme'
import { wrapInTestContext,getBackendFromInstance,simulateDragDropSequence} from 'react-dnd-test-utils'
import Trees from '../'
import { Tree } from '../Tree'
import sinon from 'sinon'

import TestUtils from 'react-dom/test-utils'

class Foo extends React.Component {
  constructor(props){
    super(props)
    this.treeData = [
      { id: 1, title: '小米人',
        children: [
          { id: 2, title: '技术',disabled:true,
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
        <Trees
          checkable
          defaultExpandAll
          editable={true}
          data={this.treeData}
          checkedIds={this.state.checkedKeys}
          onChange={(checkedKeys, title, bool, semi) => {
            console.log('Trees data:')
            this.setState({
              checkedKeys
            })
          }}
          highlightable
          onClick={data=>{}}
        />
      </div>
    )
  }
}
describe('tree', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })
    const treeData = [
      { id: 1, title: '小米',
        children: [
          { id: 2, title: '技术', disabled: true,
            children: [
              { id: 3, title: '后端', onClick: data => {console.log('后端：')} , disabled: true},
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
                <Trees
                  data={treeData}
                  defaultExpandAll
                  onChange={data => {}}
                  highlightable
                  onClick={(item) => {}}
                />
              </div>
            )
            expect(wrapper.find('.hi-tree')).toHaveLength(1)
            wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
            expect(wrapper.find('.can-expand')).toHaveLength(3)
            expect(wrapper.find('.is-root').at(0).find('ul')).toHaveLength(0)
            wrapper.unmount();
        })
    it('basic Legacy',()=>{
            const wrapper = mount(
              <div style={{width:500}}>
                <Trees
                  Legacy
                  data={treeData}
                  defaultExpandAll
                  onChange={data => {}}
                  highlightable
                  onClick={(item) => {}}
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
            expect(wrapper.find('.hi-checkbox-legacy__input')).toHaveLength(12)
            expect(wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input')).toHaveLength(6)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__label').at(0).simulate('click')
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy--disabled').find('.hi-checkbox-legacy__label').at(0).simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--checked')).toHaveLength(0)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').at(0).simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--checked')).toHaveLength(6)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').at(0).simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--checked')).toHaveLength(0)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').at(5).simulate('click')
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').at(0).simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--checked')).toHaveLength(0)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').at(5).simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--part')).toHaveLength(1)
            wrapper.find('.is-root').at(0).find('.hi-checkbox-legacy__input').at(5).simulate('click')
            expect(wrapper.find('.hi-checkbox-legacy--checked')).toHaveLength(0)
            wrapper.unmount()
        })
      it('ContextMenuOption',()=>{
        const fn = jest.fn()
        const wrapper = mount(
          <div style={{width:500}}>
            <Trees
              editable={true}
              data={treeData}
              onSave={(saveNode, data) => {
              }}
              onDelete={(deleteNode, data) => {
              }}
              contextMenu={
                [{
                  title: '自定义',
                  onClick: (item, node) => {
                    fn()
                  }
                }]
              }
              onChange={data => {}}
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
                <Trees
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
            wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('ul')).toHaveLength(1)
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text--disabled').at(0).simulate('click')
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text--disabled').at(0).simulate('contextmenu')
            wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
            // console.log(wrapper.debug())
            // 编辑节点取消
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').simulate('contextmenu')
            expect(document.querySelectorAll('.right-click-menu')).toHaveLength(1)

            wrapper.find('.right-click-menu li').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(1)
            expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(1)
            wrapper.find('.is-root').at(0).find('.editing').find('span').at(1).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(0)
            expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(0)

            // 编辑节点确定
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').simulate('click')
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').simulate('contextmenu')
            expect(document.querySelectorAll('.right-click-menu')).toHaveLength(1)

            wrapper.find('.right-click-menu li').at(0).simulate('click')
            wrapper.find('input').simulate('change',{target:{value:'小米'}})
            expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(1)
            expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(1)

            wrapper.find('.is-root').at(0).find('.editing').find('span').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(0)
            expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(0)

            wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('ul li')).toHaveLength(2)
            // 添加子节点
            wrapper.find('.is-root').at(0).find('.hi-tree_item-icon').at(0).simulate('click')

            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(1).simulate('click')
            wrapper.find('.is-root').at(0).find('.editing').find('span').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('ul li')).toHaveLength(3)
            wrapper.find('.is-root').at(0).find('.hi-tree_item-icon').at(0).simulate('click')

            // 添加子节点未展开
            wrapper.find('.is-root').at(0).find('.hi-tree_item-icon').at(0).simulate('click')
            
            wrapper.find('.is-root').at(0).find('.hi-tree_item-text').at(0).simulate('contextmenu')
            wrapper.find('.right-click-menu li').at(1).simulate('click')
            wrapper.find('.is-root').at(0).find('.editing').find('span').at(0).simulate('click')
            expect(wrapper.find('.is-root').at(0).find('ul li')).toHaveLength(4)
            
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
              <Trees
                searchable={true}
                data={treeData}
                onChange={data => {}}
                highlightable
                onClick={(item) => {}}
              />
            </div>
          )
          expect(wrapper.find('.hi-tree__searcher')).toHaveLength(1)
          wrapper.find('input').simulate('change',{target:{value:'小米'}})
          expect(wrapper.find('.is-root')).toHaveLength(2)
        })
        it('should draggable',(done)=>{
          const WrapTrees = wrapInTestContext(Tree)
          const wrapper = mount(
              <WrapTrees
              // defaultExpandAll
              draggable={true}
              editable={true}
              data={treeData}
              onDragStart = {(dragNode)=> {
              }}
              onDropEnd = {(dragNode,dropNode)=> {
              }}
              onChange={data => {}}
              highlightable
              onClick={(item) => {}}
            />
          )
          wrapper.find('.hi-tree_item-icon').at(0).simulate('click')
          expect(wrapper.find('.is-root').at(0).find('ul')).toHaveLength(1)
          wrapper.find('.is-root').at(0).find('.hi-tree_item-text--disabled').at(0).simulate('click')
          wrapper.find('.is-root').at(0).find('.hi-tree_item-text--disabled').at(0).simulate('contextmenu')
          // const backend = getBackendFromInstance(wrapper.instance())
          wrapper.find('.hi-tree_item-icon').at(0).simulate('click')


          wrapper.find('.hi-tree_item-text').at(0).simulate('click')
          expect(wrapper.find('.hi-tree_item-text').at(0).hasClass('highlight')).toBeTruthy()
          // 右键
          wrapper.find('.is-root').at(0).find('.hi-tree_item-text').simulate('contextmenu')
          expect(document.querySelectorAll('.right-click-menu')).toHaveLength(1)

          wrapper.find('.right-click-menu li').at(0).simulate('click')
          expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(1)
          expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(1)
          wrapper.find('.is-root').at(0).find('.editing').find('span').at(1).simulate('click')
          expect(wrapper.find('.is-root').at(0).find('.editing')).toHaveLength(0)
          expect(wrapper.find('.is-root').at(0).find('.hi-input__text')).toHaveLength(0)

          const backend = wrapper.instance().getManager().getBackend()
          const sourceItem = wrapper.find('DragSource(TreeItem)').at(0)
          const monitor = wrapper.instance().getManager().getMonitor()
          const registry = wrapper.instance().getManager().getRegistry()

          backend.simulateBeginDrag([sourceItem.instance().getHandlerId()])
          const targetItem = wrapper
            .find('DropTarget(DragSource(TreeItem))')
            .at(0)

            
          backend.simulateHover([targetItem.instance().getHandlerId()],{
              clientOffset: { x: 60, y: 70 }
          })
          backend.simulateHover([targetItem.instance().getHandlerId()],{
            clientOffset: { x: 0, y: 0 }
          });
          backend.simulateDrop()
          backend.simulateEndDrag()
          const sourceItem2 = wrapper.find('DragSource(TreeItem)').at(1)

          backend.simulateBeginDrag([sourceItem2.instance().getHandlerId()],{
            clientOffset: { x: 50, y: 40 },
            getSourceClientOffset: () => ({ x: 20, y: 10 })
          })
          const targetItem2 = wrapper
            .find('DropTarget(DragSource(TreeItem))')
            .at(1)

          backend.simulateHover([targetItem2.instance().getHandlerId(),targetItem.instance().getHandlerId()])
          backend.simulateDrop()
          backend.simulateEndDrag()
          simulateDragDropSequence(sourceItem.instance(),targetItem2.instance(),backend)

          monitor.subscribeToStateChange(done);
          backend.simulateBeginDrag([sourceItem.instance().getHandlerId()],{
            clientOffset: { x: 0, y: 0 },
            getSourceClientOffset: () => ({ x: 0, y: 0 })
          });
          backend.simulateDrop()
          backend.simulateEndDrag()

          monitor.subscribeToStateChange(done);
          backend.simulateBeginDrag([sourceItem.instance().getHandlerId()],{
            clientOffset: { x: 20, y: 20 },
            getSourceClientOffset: () => ({ x: 0, y: 0 })
          });
          monitor.subscribeToOffsetChange(done);
          backend.simulateHover([targetItem2.instance().getHandlerId()], {
            clientOffset: { x: 20, y: 10 }
          });
          backend.simulateDrop()
          backend.simulateEndDrag()
          wrapper.find('.hi-tree_item-icon').at(1).simulate('click')
          wrapper.find('.hi-tree_item-icon').at(2).simulate('click')
          wrapper.find('.hi-tree_item-icon').at(3).simulate('click')
          console.log(wrapper.debug(),wrapper.find('.hi-tree_item-icon').debug())
          backend.simulateBeginDrag([sourceItem2.instance().getHandlerId()], {
            clientOffset: { x: 30, y: 20 },
            getSourceClientOffset: () => ({ x: 0, y: 0 })
          });
          const targetId = targetItem2.instance().getHandlerId()
          let raisedChange = false;
          monitor.subscribeToOffsetChange(() => {
            raisedChange = true;
          });
    
          backend.simulateHover([targetId], {
            clientOffset: { x: 10, y: 20 }
          });
          backend.simulateHover([], {
            clientOffset: { x: 10, y: 22 }
          });
          backend.simulateHover([targetId], {
            clientOffset: { x: 16, y: 20 }
          });
          backend.simulateHover([targetId], {
            clientOffset: { x: 5, y: 20 }
          });
          backend.simulateDrop()
          backend.simulateEndDrag()
          wrapper.unmount()
        })
        it('should loadTreeNode',()=>{
         const treeDataLoad = [
            { id: 1, title: '小米',
              children: [
                { id: 2, title: '技术',
                  children: [
                    { id: 3, title: '后端', onClick: data => {} },
                    { id: 4, title: '运维' },
                    { id: 5, title: '前端' }
                  ]
                },
                { id: 6, title: '产品' }
              ]
            },
            { id: 11, title: '小米',
              children: [
                { id: 22, title: '技术'
                },
                { id: 66, title: '产品' }
              ]
            }
          ]
         
          const wrapper = mount(
            <div style={{width:500}}>
            <Trees
              loadTreeNode={id=>{
                const obj = {
                  method:'get',
                  headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                  data:{},
                  params:{id:id},
                  url:'http://yapi.demo.qunar.com/mock/26534/hiui/async-tree',
                  transformResponse:(res)=>{return res.data}
                }
                return obj
              }}
              defaultExpandAll
              editable={true}
              data={treeDataLoad}
              onChange={data => {}}
              highlightable
              onClick={(item) => {}}
            />
          </div>
          )
          wrapper.find('.is-root').at(1).find('ul').find('li').at(1).find('.hi-tree_item-icon').simulate('click')
          clock.tick(400)

          wrapper.unmount()
        })
})
//DropTarget(DragSource(TreeItem))