# Tree 树形控件

具备展示多层级数据结构特征的组件。

## 使用示例

### 基础用法

二叉树或多叉树的展现形式，常见于组织架构、文件管理、索引目录等应用场景


```tsx
import React from 'react'
import Tree from '@hi-ui/tree'
import Button from '@hi-ui/button' 
export const Basic = () => {
 const [expandedIds, setExpandedIds] = React.useState<React.ReactText[]>([])

 return (
 <> 
 <div className="tree-basic__wrap">
 <Button
 style={{ marginBottom: 8 }}
 onClick={() => {
 setExpandedIds([1])
 }}
 >
 setExpanded
 </Button>
 <Tree
 expandedIds={expandedIds}
 onExpand={setExpandedIds}
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 disabled: true,
 children: [
 { id: 3, title: '后端', disabled: true },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 ></Tree>
 </div>
 </>
 )
}

```


### 拖拽排序

通过鼠标拖拽行为，改变树的层级结构


```tsx
import React from 'react'
import Tree from '@hi-ui/tree' 
export const Draggable = () => {
 const [treeData] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 return (
 <> 
 <div className="tree-draggable__wrap">
 <Tree
 showLine
 draggable
 onDrop={(...args) => {
 console.log('onDrop', ...args)
 // setTreeData(data.after)
 return true
 }}
 data={treeData}
 onDragStart={console.log}
 onDragEnd={console.log}
 onDragOver={console.log}
 onDragLeave={console.log}
 />
 </div>
 </>
 )
}

```


### 异步加载

打开下一级时从服务端调取节点数据


```tsx
import React from 'react'
import Tree from '@hi-ui/tree'
import { cloneTree, findNodeById } from '@hi-ui/utils'
import Alert from '@hi-ui/alert' 
export const Dynamic = () => {
 const [treeData, setTreeData] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '小米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 // 加载节点
 const loadChildren = async (node) => {
 return fetch(`https://my-json-server.typicode.com/hiui-group/db/conditiondata?id=${node.id}`)
 .then((res) => res.json())
 .then((data) => {
 if (data[0]) {
 data[0].id = Math.random()
 data[0].parent = treeData
 }

 // Utils Helper: import { cloneTree, findNodeById } from '@hi-ui/utils'
 setTreeData((prev) => {
 const nextData = cloneTree(prev)
 const loadNode = findNodeById(nextData, node.id)
 loadNode.children = data
 console.log(loadNode, nextData)
 return nextData
 })

 // return data
 })
 }

 return (
 <> 
 <div className="tree-dynamic__wrap">
 <Alert
 type="danger"
 closeable={false}
 showIcon={false}
 title={
 '注意：对于异步加载子节点，可以配合 `node.isLeaf: true` 来表明是否为叶子结点。以此来告诉组件该节点是否有下一级子树'
 }
 ></Alert>
 <br />
 <Tree data={treeData} onLoadChildren={loadChildren}></Tree>
 </div>
 </>
 )
}

```


### 基础多选

用于一次性选中同级多个节点或全选同级节点，可与其它组件搭配使用


```tsx
import React from 'react'
import Tree from '@hi-ui/tree' 
export const Checkable = () => {
 const [checkedIds, setCheckedIds] = React.useState([])
 const [treeData] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 {
 id: 6,
 title: '产品',
 disabled: true,
 children: [
 { id: 61, title: '后端' },
 { id: 62, title: '运维' },
 { id: 63, title: '前端' },
 ],
 },
 {
 id: 8,
 title: '发发发',

 children: [],
 },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 return (
 <> 
 <div className="tree-checkable__wrap">
 <Tree
 checkable
 data={treeData}
 checkedIds={checkedIds}
 onCheck={(...args) => {
 console.log(...args)
 setCheckedIds(args[0])
 }}
 render={(node) => `${node.title}(${node.id})`}
 ></Tree>
 </div>
 </>
 )
}

```


### 默认展开所有


```tsx
import React from 'react'
import Tree from '@hi-ui/tree' 
export const Expand = () => {
 return (
 <> 
 <div className="tree-expand__wrap">
 <Tree
 defaultExpandAll
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 ></Tree>
 </div>
 </>
 )
}

```


### 大数据


```tsx
import React from 'react'
import Tree from '@hi-ui/tree' 
export const VirtualList = () => {
 // 模拟 10^4 个数据量
 const [treeData] = React.useState(() => {
 function dig(path = '0', level) {
 const list = []
 for (let i = 0; i < 10; i += 1) {
 const id = `${path}-${i}`
 const treeNode = {
 title: id,
 id,
 children: [] as any[],
 }

 if (level > 0) {
 treeNode.children = dig(id, level - 1)
 }

 list.push(treeNode)
 }
 return list
 }

 const treeData = dig('0', 4)
 return treeData
 })

 return (
 <> 
 <div className="tree-virtual-list__wrap">
 <Tree height={300} data={treeData}></Tree>
 </div>
 </>
 )
}

```


### 编辑用法

通过树的节点进行新增、删除、编辑等操作


```tsx
import React from 'react'
import Tree, { useTreeAction } from '@hi-ui/tree'
import { Modal } from '@hi-ui/modal' 
export const Editable = () => {
 const ActionTree = useTreeAction(Tree)

 return (
 <> 
 <div className="tree-editable__wrap">
 <ActionTree
 expandOnSelect
 editPlaceholder="请填写菜单"
 // 操作菜单 Popper 配置
 actionMenuPopper={{}}
 menuOptions={[
 {
 type: 'addChildNode',
 title: '新建子节点',
 },
 {
 type: 'addSiblingNode',
 title: '新建兄弟节点',
 },
 {
 // type: 'deleteNode',
 title: '删除当前菜单',
 onClick(node, action) {
 action.closeMenu()

 Modal.confirm({
 title: '提示',
 content: '确定删除吗？',
 onConfirm: () => {
 action.deleteNode()
 },
 })
 },
 },
 {
 type: 'editNode',
 title: '编辑当前菜单',
 },
 {
 title: 'Hello，自定义的菜单',
 onClick(node, action) {
 console.log(node)
 action.closeMenu()
 },
 },
 ]}
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 自定义编辑项

用于编辑树操作菜单显示在外面的场景


```tsx
import React from 'react'
import Tree, { useTreeAction } from '@hi-ui/tree'
import Space from '@hi-ui/space'
import PopConfirm from '@hi-ui/pop-confirm'
import { PlusOutlined, DuplicateOutlined, EditOutlined, DeleteOutlined } from '@hi-ui/icons' 
export const ActionRender = () => {
 const ActionTree = useTreeAction(Tree)

 return (
 <> 
 <div className="tree-action-render__wrap">
 <ActionTree
 expandOnSelect
 editPlaceholder="请填写菜单"
 actionRender={(node, editActions) => {
 console.log('node', node)

 const { id } = node

 return id === 11 ? (
 <Space>
 <PlusOutlined onClick={() => editActions.addChildNode(1)} />
 <DuplicateOutlined onClick={() => editActions.addSiblingNode()} />
 <EditOutlined onClick={() => editActions.editNode()} />
 <PopConfirm
 title={'确认删除该节点？'}
 onConfirm={editActions.deleteNode}
 onClose={editActions.closeMenu}
 >
 <DeleteOutlined onClick={() => editActions.openMenu()} />
 </PopConfirm>
 </Space>
 ) : null
 }}
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 />
 </div>
 </>
 )
}

```


### 搜索用法

树的层级多、节点数量庞大，借助搜索工具快速找到结点


```tsx
import React from 'react'
import Tree, { useTreeSearch } from '@hi-ui/tree' 
export const Search = () => {
 const [data] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ])

 const SearchTree = useTreeSearch(Tree)

 return (
 <> 
 <div className="tree-search__wrap">
 <SearchTree searchable={true} searchPlaceholder={'搜索'} data={data} />
 </div>
 </>
 )
}

```


### 自定义搜索 UI

通过 useTreeSearchProps 复用搜索逻辑，搜索 UI 交互展示完全自定义


```tsx
import React from 'react'
import Tree, { useTreeSearchProps } from '@hi-ui/tree'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button' 
export const CustomSearch = () => {
 const [data] = React.useState([
 {
 id: '1',
 title: '小米',
 children: [
 {
 id: '2',
 title: '研发',
 children: [
 { id: '3', title: '后端' },
 { id: '4', title: '运维' },
 { id: '5', title: '前端' },
 ],
 },
 { id: '6', title: '产品' },
 ],
 },
 {
 id: '11',
 title: '大米',
 children: [
 { id: '22', title: '可视化' },
 { id: '66', title: 'HiUI' },
 ],
 },
 ])

 const [searchValue, setSearchValue] = React.useState('')
 const { filterTree, customFilterTree, isEmpty, treeProps } = useTreeSearchProps({
 searchable: true,
 searchPlaceholder: '搜索',
 data,
 // checkable: true,
 })

 return (
 <> 
 <div className="tree-custom-search__wrap">
 <Input
 value={searchValue}
 onChange={(evt) => setSearchValue(evt.target.value)}
 placeholder="请输入要查询的岗位"
 />
 <Button
 style={{ margin: '12px 12px 12px 0' }}
 onClick={() => {
 filterTree(searchValue)
 }}
 >
 点击搜索岗位
 </Button>
 <Button
 style={{ margin: '12px 0' }}
 onClick={() => {
 customFilterTree(searchValue, (node) =>
 !searchValue ? false : (node.raw.title as string).indexOf(searchValue) > -1
 )
 }}
 >
 点击搜索岗位（自定义匹配逻辑）
 </Button>
 <div style={{ fontSize: 14, color: '#5f6a7a' }}>
 我是提示：{isEmpty ? '暂时匹配不到相关岗位信息' : '无'}
 </div>
 <Tree {...treeProps} onCheck={console.log} />
 </div>
 </>
 )
}

```


### 自定义渲染

自定义渲染树节点标题


```tsx
import React from 'react'
import { ExcelColorful } from '@hi-ui/icons'
import Tree, { TreeDataItem } from '@hi-ui/tree' 
export const CustomTitle = () => {
 const [treeData] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 {
 id: 6,
 title: '产品',

 children: [
 { id: 61, title: '后端' },
 { id: 62, title: '运维' },
 { id: 63, title: '前端' },
 ],
 },
 {
 id: 8,
 title: '发发发',

 children: [],
 },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 const renderTreeNodeTitle = (node: TreeDataItem) => {
 return (
 <div
 style={{
 width: '100%',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 }}
 >
 <div>
 {/* 自定义 title 的前缀 icon */}
 {/* <span className="custom-left-icon" style={{ marginRight: 12 }}>
 😄
 </span> */}
 <ExcelColorful style={{ marginRight: 2 }} />
 <span>{node.title}</span>
 <span>{`（${node.id}）`}</span>
 </div>
 {/* 自定义 title 的后缀 icon */}
 {/* <div>
 {Array.isArray(node.children) && node.children.length > 0 ? null : (
 <span className="custom-right-icon">❤</span>
 )}
 </div> */}
 </div>
 )
 }

 return (
 <> 
 <div className="tree-custom-title__wrap">
 <Tree data={treeData} render={renderTreeNodeTitle}></Tree>
 </div>
 </>
 )
}

```


### 自定义 Icon


```tsx
import { FileOutlined, FolderOpenOutlined, FolderOutlined } from '@hi-ui/icons'
import React from 'react'
import Tree from '@hi-ui/tree' 
export const CustomIcon = () => {
 const [treeData] = React.useState([
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '技术',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 {
 id: 6,
 title: '产品',

 children: [
 { id: 61, title: '后端' },
 { id: 62, title: '运维' },
 { id: 63, title: '前端' },
 ],
 },
 {
 id: 8,
 title: '发发发',

 children: [],
 },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '技术' },
 { id: 66, title: '产品' },
 ],
 },
 ])

 return (
 <> 
 <div className="tree-custom-icon__wrap">
 <Tree
 data={treeData}
 collapsedIcon={<FolderOutlined />}
 expandedIcon={<FolderOpenOutlined />}
 leafIcon={<FileOutlined />}
 />
 </div>
 </>
 )
}

```


### 选中时展开子节点


```tsx
import React from 'react'
import Tree from '@hi-ui/tree' 
export const ExpandOnSelect = () => {
 return (
 <> 
 <div className="tree-expand-on-click__wrap">
 <Tree
 expandOnSelect
 onSelect={console.log}
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 disabled: true,
 children: [
 { id: 3, title: '后端', disabled: true },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 ></Tree>
 </div>
 </>
 )
}

```


### 设置尺寸


```tsx
import React from 'react'
import Tree from '@hi-ui/tree' 
export const Size = () => {
 return (
 <> 
 <div className="tree-size__wrap">
 <div>
 <div>
 <h3>
 lg <small>默认</small>
 </h3>
 <Tree
 expandOnSelect
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 disabled: true,
 children: [
 { id: 3, title: '后端', disabled: true },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 />
 </div>
 <div>
 <h3>md</h3>
 <Tree
 expandOnSelect
 size="md"
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 disabled: true,
 children: [
 { id: 3, title: '后端', disabled: true },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 />
 </div>
 <div>
 <h3>sm</h3>
 <Tree
 expandOnSelect
 size="sm"
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 disabled: true,
 children: [
 { id: 3, title: '后端', disabled: true },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 />
 </div>
 </div>
 </div>
 </>
 )
}

```


### 设置滚动位置

仅在设置 height 属性即虚拟列表下有效


```tsx
import React from 'react'
import Tree, { TreeHelper } from '@hi-ui/tree'
import Button from '@hi-ui/button' 
export const ScrollTo = () => {
 const treeRef = React.useRef<TreeHelper>(null)

 const [treeData] = React.useState(() => {
 function dig(path = '0', level) {
 const list: { title: string; id: string; children: any[] }[] = []

 for (let i = 0; i < 5; i += 1) {
 const id = `${path}-${i}`
 const treeNode = {
 title: id,
 id,
 children: [] as any[],
 }

 if (level > 0) {
 treeNode.children = dig(id, level - 1)
 }

 list.push(treeNode)
 }
 return list
 }

 const treeData = dig('0', 4)
 return treeData
 })

 return (
 <> 
 <div className="tree-scroll-to__wrap">
 <Button
 onClick={() => {
 // key 为节点 id
 treeRef.current?.scrollTo?.({ key: '0-2-2-0-0', align: 'top' })
 }}
 >
 scroll to key: 0-2-2-0-0
 </Button>
 <Tree
 innerRef={treeRef}
 height={300}
 defaultExpandAll
 data={treeData}
 expandOnSelect
 ></Tree>
 </div>
 </>
 )
}

```


### 自定义 icon 渲染函数


```tsx
import React from 'react'
import Tree, { useTreeAction } from '@hi-ui/tree'
import { Modal } from '@hi-ui/modal'
import { FileOutlined, FolderOpenOutlined, FolderOutlined } from '@hi-ui/icons' 
export const IconRender = () => {
 const ActionTree = useTreeAction(Tree)

 return (
 <> 
 <div className="tree-icon-render__wrap">
 <ActionTree
 expandOnSelect
 editPlaceholder="请填写菜单"
 menuOptions={[
 {
 type: 'addChildNode',
 title: '新建子节点',
 },
 {
 type: 'addSiblingNode',
 title: '新建兄弟节点',
 },
 {
 // type: 'deleteNode',
 title: '删除当前菜单',
 onClick(node, action) {
 action.closeMenu()

 Modal.confirm({
 title: '提示',
 content: '确定删除吗？',
 onConfirm: () => {
 action.deleteNode()
 },
 })
 },
 },
 {
 type: 'editNode',
 title: '编辑当前菜单',
 },
 {
 title: 'Hello，自定义的菜单',
 onClick(node, action) {
 console.log(node)
 action.closeMenu()
 },
 },
 ]}
 data={[
 {
 id: 1,
 title: '小米',
 children: [
 {
 id: 2,
 title: '研发',
 children: [
 { id: 3, title: '后端' },
 { id: 4, title: '运维' },
 { id: 5, title: '前端' },
 ],
 },
 { id: 6, title: '产品' },
 ],
 },
 {
 id: 11,
 title: '大米',
 children: [
 { id: 22, title: '可视化' },
 { id: 66, title: 'HiUI' },
 ],
 },
 ]}
 iconRender={(node) => {
 if (!node.children?.length) {
 return <FileOutlined />
 }

 if (node.expanded) {
 return <FolderOpenOutlined />
 } else return <FolderOutlined />
 }}
 />
 </div>
 </>
 )
}

```


### 自定义样式

通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制


```tsx
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Tree, { TreeSemanticName } from '@hi-ui/tree' 
export const Semantic = () => {
 const [selected, setSelected] = useState<TreeSemanticName>()

 const treeData = [
 {
 id: '1',
 title: '节点一',
 children: [
 { id: '1-1', title: '子节点 1-1' },
 { id: '1-2', title: '子节点 1-2' },
 ],
 },
 { id: '2', title: '节点二' },
 ]

 return (
 <> 
 <div className="tree-semantic__wrap">
 <Row gutter={12}>
 <Col span={18}>
 <Tree
 data={treeData}
 defaultExpandAll
 height={200}
 classNames={{
 root: 'my-tree__root',
 item: 'my-tree__item',
 itemContent: 'my-tree__item-content',
 itemIcon: 'my-tree__item-icon',
 itemTitle: 'my-tree__item-title',
 }}
 styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
 />
 </Col>
 <Col span={6}>
 <List
 split={false}
 data={[
 { title: 'root', description: '根元素 (ul)' },
 { title: 'item', description: '树节点项 (li)' },
 { title: 'itemContent', description: '节点内容包裹层' },
 { title: 'itemIcon', description: '展开/收起图标' },
 { title: 'itemTitle', description: '节点标题' },
 ]}
 render={(dataItem) => (
 <div
 onMouseEnter={() => setSelected(dataItem.title as TreeSemanticName)}
 onMouseLeave={() => setSelected(undefined)}
 >
 <List.Item {...dataItem} />
 </div>
 )}
 />
 </Col>
 </Row>
 </div>
 </>
 )
}

```


## Props

### Tree Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| className | 组件的注入选择器类 | string | - | - |
| style | 组件的注入样式 | CSSProperties | - | - |
| data *(required)* | 展示数据 | TreeDataItem\[] | - | - |
| defaultExpandAll | 默认展开所有树节点（非受控时才有效） | boolean | true \| false | false |
| expandedIds | 展开的节点 | ReactText\[] | - | - |
| defaultExpandedIds | 默认展开的节点 | ReactText\[] | - | \[] |
| onExpand | 节点被点击(展开/收起)时触发 | ((expandedIds: ReactText\[], node: TreeNodeEventData, expanded: boolean) => void) | - | - |
| onLoadChildren | 点击异步加载子项 | ((node: TreeNodeEventData) => void \| Promise\<void \| TreeDataItem\[]>) | (node: TreeNodeEventData) => void \| Promise\<void \| TreeDataItem\[]> | - |
| selectedId | 选中的节点 | ReactText | - | - |
| defaultSelectedId | 默认选中的节点 | ReactText | - | - |
| onSelect | 点击节点时触发选中，null 表示未选中 | ((selectedId: ReactText \| null, selectedNode: TreeNodeEventData \| null) => void) | (selectedId: ReactText \| null, selectedNode: TreeNodeEventData \| null) => void | - |
| selectable | 节点是否可选中 | boolean | true \| false | true |
| draggable | 节点可拖拽 | boolean | true \| false | false |
| onDragStart | 节点开始拖拽时触发 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; }) => void) | - | - |
| onDragEnd | 节点结束拖拽时触发 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; }, treeData: TreeDataItem\[]) => void) | - | - |
| onDrop | 节点放开时触发，返回 true 表示允许更新拖拽后数据 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; dataStatus: TreeDataStatus; level: TreeLevelStatus; }) => boolean \| Promise<...>) | (evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; dataStatus: TreeDataStatus; level: TreeLevelStatus; }) => boolean \| Promise<...> | - |
| onDropEnd | 节点拖拽成功时触发，\`onDrop\` 不拦截或者返回 \`false\` 才会触发 | ((options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; }) => void) | - | - |
| onDragLeave | 节点 drag leaver 时调用 | ((evt: DragEvent\<Element>, options: { dropNode: TreeNodeEventData; }) => void) | - | - |
| onDragOver | 节点 drag over 时调用 | ((evt: DragEvent\<Element>, options: { dropNode: TreeNodeEventData; }) => void) | - | - |
| checkable | 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用） | boolean | true \| false | false |
| defaultCheckedIds | 默认选中的复选框的节点 | ReactText\[] | - | \[] |
| checkedIds | 选中的复选框的节点 | ReactText\[] | - | - |
| onCheck | 点击节点多选框触发 | ((checkedIds: ReactText\[], options: { checkedNodes: TreeDataItem\[]; semiCheckedIds: ReactText\[]; targetNode: TreeNodeEventData; checked: boolean; }) => void) | - | - |
| height | 设置虚拟滚动容器的可视高度 | number | - | - |
| itemHeight | 设置虚拟列表每项的固定高度 | number | - | 32 |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | true |
| showLine | 展示连接线 | boolean | true \| false | false |
| collapsedIcon | 节点收起时的默认图标 | ReactNode | - | - |
| expandedIcon | 节点展开时的默认图标 | ReactNode | - | - |
| leafIcon | 叶子结点的默认图标 | ReactNode | - | - |
| render | 自定义渲染节点的 title 内容 | ((node: TreeNodeEventData) => ReactNode) | - | - |
| iconRender | 自定义渲染节点的 icon | ((node: TreeNodeEventData) => ReactNode) | - | - |
| onContextMenu | 自定义节点右键菜单 | ((event: MouseEvent\<Element, MouseEvent>, node: TreeNodeEventData) => void) | - | - |
| checkedMode | 多选数据交互时回填、回显模式&#xA;PARENT: 当所有子节点被选中时将只保留父节点&#xA;ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）&#xA;CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）&#xA;SEPARATE：父子完全独立受控 | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | "ALL" |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | HiBaseFieldNames | - | - |
| expandOnSelect | 是否点击节点时展开其子节点 | boolean | true \| false | - |
| size | 设置大小 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<TreeHelper> | - | - |
| shouldShowSwitcher | 自定义切换器显示逻辑 | ((node: TreeNodeEventData) => boolean) | - | - |
| actionMenuPopper | 编辑树模式下操作菜单 Popper 配置 | Omit\<PopperProps, "visible" \| "attachEl"> | Omit\<PopperProps, "visible" \| "attachEl"> | - |
| classNames | | TreeSemanticClassNames | - | - |
| styles | | TreeSemanticStyles | - | - |


### useTreeSearchProps Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| searchable | 节点可搜索，仅在 node.title 类型为字符串下支持 | boolean | true \| false | - |
| searchPlaceholder | 搜索输入占位符 | string | - | - |
| searchEmptyContent | 搜索结果为空时提示文字 | string | - | - |
| onSearch | 输入关键字搜索时触发回调 | ((keyword: string) => void) | - | - |
| className | 组件的注入选择器类 | string | - | - |
| style | 组件的注入样式 | CSSProperties | - | - |
| data *(required)* | 展示数据 | TreeDataItem\[] | - | - |
| defaultExpandAll | 默认展开所有树节点（非受控时才有效） | boolean | true \| false | - |
| expandedIds | 展开的节点 | ReactText\[] | - | - |
| defaultExpandedIds | 默认展开的节点 | ReactText\[] | - | - |
| onExpand | 节点被点击(展开/收起)时触发 | ((expandedIds: ReactText\[], node: TreeNodeEventData, expanded: boolean) => void) | - | - |
| onLoadChildren | 点击异步加载子项 | ((node: TreeNodeEventData) => void \| Promise\<void \| TreeDataItem\[]>) | (node: TreeNodeEventData) => void \| Promise\<void \| TreeDataItem\[]> | - |
| selectedId | 选中的节点 | ReactText | - | - |
| defaultSelectedId | 默认选中的节点 | ReactText | - | - |
| onSelect | 点击节点时触发选中，null 表示未选中 | ((selectedId: ReactText \| null, selectedNode: TreeNodeEventData \| null) => void) | (selectedId: ReactText \| null, selectedNode: TreeNodeEventData \| null) => void | - |
| selectable | 节点是否可选中 | boolean | true \| false | - |
| draggable | 节点可拖拽 | boolean | true \| false | - |
| onDragStart | 节点开始拖拽时触发 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; }) => void) | - | - |
| onDragEnd | 节点结束拖拽时触发 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; }, treeData: TreeDataItem\[]) => void) | - | - |
| onDrop | 节点放开时触发，返回 true 表示允许更新拖拽后数据 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; dataStatus: TreeDataStatus; level: TreeLevelStatus; }) => boolean \| Promise<...>) | (evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; dataStatus: TreeDataStatus; level: TreeLevelStatus; }) => boolean \| Promise<...> | - |
| onDropEnd | 节点拖拽成功时触发，\`onDrop\` 不拦截或者返回 \`false\` 才会触发 | ((options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; }) => void) | - | - |
| onDragLeave | 节点 drag leaver 时调用 | ((evt: DragEvent\<Element>, options: { dropNode: TreeNodeEventData; }) => void) | - | - |
| onDragOver | 节点 drag over 时调用 | ((evt: DragEvent\<Element>, options: { dropNode: TreeNodeEventData; }) => void) | - | - |
| checkable | 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用） | boolean | true \| false | - |
| defaultCheckedIds | 默认选中的复选框的节点 | ReactText\[] | - | - |
| checkedIds | 选中的复选框的节点 | ReactText\[] | - | - |
| onCheck | 点击节点多选框触发 | ((checkedIds: ReactText\[], options: { checkedNodes: TreeDataItem\[]; semiCheckedIds: ReactText\[]; targetNode: TreeNodeEventData; checked: boolean; }) => void) | - | - |
| height | 设置虚拟滚动容器的可视高度 | number | - | - |
| itemHeight | 设置虚拟列表每项的固定高度 | number | - | - |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | - |
| showLine | 展示连接线 | boolean | true \| false | - |
| collapsedIcon | 节点收起时的默认图标 | ReactNode | - | - |
| expandedIcon | 节点展开时的默认图标 | ReactNode | - | - |
| leafIcon | 叶子结点的默认图标 | ReactNode | - | - |
| render | 自定义渲染节点的 title 内容 | ((node: TreeNodeEventData) => ReactNode) | - | - |
| iconRender | 自定义渲染节点的 icon | ((node: TreeNodeEventData) => ReactNode) | - | - |
| onContextMenu | 自定义节点右键菜单 | ((event: MouseEvent\<Element, MouseEvent>, node: TreeNodeEventData) => void) | - | - |
| checkedMode | 多选数据交互时回填、回显模式&#xA;PARENT: 当所有子节点被选中时将只保留父节点&#xA;ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）&#xA;CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）&#xA;SEPARATE：父子完全独立受控 | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | - |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | HiBaseFieldNames | - | - |
| expandOnSelect | 是否点击节点时展开其子节点 | boolean | true \| false | - |
| size | 设置大小 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<TreeHelper> | - | - |
| shouldShowSwitcher | 自定义切换器显示逻辑 | ((node: TreeNodeEventData) => boolean) | - | - |
| actionMenuPopper | 编辑树模式下操作菜单 Popper 配置 | Omit\<PopperProps, "visible" \| "attachEl"> | Omit\<PopperProps, "visible" \| "attachEl"> | - |
| classNames | | TreeSemanticClassNames | - | - |
| styles | | TreeSemanticStyles | - | - |


### useTreeEditProps Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| editable | 开启后节点可编辑（内置：添加同级节点、添加子节点、编辑节点、删除节点、关闭菜单）&#xA;其中添加或编辑节点仅在 node.title 类型为字符串下支持 | boolean | true \| false | - |
| onBeforeSave | 节点保存新增、编辑状态时触发，返回 false 则节点保持失败，不会触发 onSave | ((savedNode: FlattedTreeNodeData, data: TreeDataStatus, level: number) => boolean \| Promise\<boolean>) | (savedNode: FlattedTreeNodeData, data: TreeDataStatus, level: number) => boolean \| Promise\<boolean> | - |
| onSave | 节点保存新增、编辑状态后触发 | ((savedNode: FlattedTreeNodeData, data: TreeDataItem\[]) => void) | - | - |
| onBeforeDelete | 节点删除前触发，返回 false 则节点删除失败，不会触发 onDelete | ((deletedNode: FlattedTreeNodeData, data: TreeDataStatus, level: number) => boolean \| Promise\<boolean>) | (deletedNode: FlattedTreeNodeData, data: TreeDataStatus, level: number) => boolean \| Promise\<boolean> | - |
| onDelete | 节点删除后触发 | ((deletedNode: FlattedTreeNodeData, data: TreeDataItem\[]) => void) | - | - |
| menuOptions | 自定义树菜单行为项 | TreeMenuActionOption\[] \| ((node: FlattedTreeNodeData) => TreeMenuActionOption\[]) | TreeMenuActionOption\[] \| (node: FlattedTreeNodeData) => TreeMenuActionOption\[] | - |
| editPlaceholder | 输入框占位符 | string | - | - |
| actionRender | 自定义可编辑树操作项 | ((node: FlattedTreeNodeData, editActions: TreeEditActions) => ReactNode) | - | - |
| className | 组件的注入选择器类 | string | - | - |
| style | 组件的注入样式 | CSSProperties | - | - |
| data *(required)* | 展示数据 | TreeDataItem\[] | - | - |
| defaultExpandAll | 默认展开所有树节点（非受控时才有效） | boolean | true \| false | - |
| expandedIds | 展开的节点 | ReactText\[] | - | - |
| defaultExpandedIds | 默认展开的节点 | ReactText\[] | - | - |
| onExpand | 节点被点击(展开/收起)时触发 | ((expandedIds: ReactText\[], node: TreeNodeEventData, expanded: boolean) => void) | - | - |
| onLoadChildren | 点击异步加载子项 | ((node: TreeNodeEventData) => void \| Promise\<void \| TreeDataItem\[]>) | (node: TreeNodeEventData) => void \| Promise\<void \| TreeDataItem\[]> | - |
| selectedId | 选中的节点 | ReactText | - | - |
| defaultSelectedId | 默认选中的节点 | ReactText | - | - |
| onSelect | 点击节点时触发选中，null 表示未选中 | ((selectedId: ReactText \| null, selectedNode: TreeNodeEventData \| null) => void) | (selectedId: ReactText \| null, selectedNode: TreeNodeEventData \| null) => void | - |
| selectable | 节点是否可选中 | boolean | true \| false | - |
| draggable | 节点可拖拽 | boolean | true \| false | - |
| onDragStart | 节点开始拖拽时触发 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; }) => void) | - | - |
| onDragEnd | 节点结束拖拽时触发 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; }, treeData: TreeDataItem\[]) => void) | - | - |
| onDrop | 节点放开时触发，返回 true 表示允许更新拖拽后数据 | ((evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; dataStatus: TreeDataStatus; level: TreeLevelStatus; }) => boolean \| Promise<...>) | (evt: DragEvent\<Element>, options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; dataStatus: TreeDataStatus; level: TreeLevelStatus; }) => boolean \| Promise<...> | - |
| onDropEnd | 节点拖拽成功时触发，\`onDrop\` 不拦截或者返回 \`false\` 才会触发 | ((options: { dragNode: TreeNodeEventData; dropNode: TreeNodeEventData; }) => void) | - | - |
| onDragLeave | 节点 drag leaver 时调用 | ((evt: DragEvent\<Element>, options: { dropNode: TreeNodeEventData; }) => void) | - | - |
| onDragOver | 节点 drag over 时调用 | ((evt: DragEvent\<Element>, options: { dropNode: TreeNodeEventData; }) => void) | - | - |
| checkable | 节点前添加 Checkbox 复选框（暂不支持与 draggable 和 editable 同时使用） | boolean | true \| false | - |
| defaultCheckedIds | 默认选中的复选框的节点 | ReactText\[] | - | - |
| checkedIds | 选中的复选框的节点 | ReactText\[] | - | - |
| onCheck | 点击节点多选框触发 | ((checkedIds: ReactText\[], options: { checkedNodes: TreeDataItem\[]; semiCheckedIds: ReactText\[]; targetNode: TreeNodeEventData; checked: boolean; }) => void) | - | - |
| height | 设置虚拟滚动容器的可视高度 | number | - | - |
| itemHeight | 设置虚拟列表每项的固定高度 | number | - | - |
| virtual | 设置 \`true\` 开启虚拟滚动 | boolean | true \| false | - |
| showLine | 展示连接线 | boolean | true \| false | - |
| collapsedIcon | 节点收起时的默认图标 | ReactNode | - | - |
| expandedIcon | 节点展开时的默认图标 | ReactNode | - | - |
| leafIcon | 叶子结点的默认图标 | ReactNode | - | - |
| render | 自定义渲染节点的 title 内容 | ((node: TreeNodeEventData) => ReactNode) | - | - |
| iconRender | 自定义渲染节点的 icon | ((node: TreeNodeEventData) => ReactNode) | - | - |
| onContextMenu | 自定义节点右键菜单 | ((event: MouseEvent\<Element, MouseEvent>, node: TreeNodeEventData) => void) | - | - |
| checkedMode | 多选数据交互时回填、回显模式&#xA;PARENT: 当所有子节点被选中时将只保留父节点&#xA;ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）&#xA;CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）&#xA;SEPARATE：父子完全独立受控 | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | "PARENT" \| "CHILD" \| "ALL" \| "SEPARATE" | - |
| fieldNames | 设置 data 中 id, title, disabled, children 对应的 key | HiBaseFieldNames | - | - |
| expandOnSelect | 是否点击节点时展开其子节点 | boolean | true \| false | - |
| size | 设置大小 | Omit\<HiBaseSizeEnum, "xs"> | Omit\<HiBaseSizeEnum, "xs"> | - |
| innerRef | 提供辅助方法的内部引用 | Ref\<TreeHelper> | - | - |
| shouldShowSwitcher | 自定义切换器显示逻辑 | ((node: TreeNodeEventData) => boolean) | - | - |
| actionMenuPopper | 编辑树模式下操作菜单 Popper 配置 | Omit\<PopperProps, "visible" \| "attachEl"> | Omit\<PopperProps, "visible" \| "attachEl"> | - |
| classNames | | TreeSemanticClassNames | - | - |
| styles | | TreeSemanticStyles | - | - |


## Type

### TreeDataItem

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | -------------- | -------------- | ------------- | ------ |
| id | 树节点唯一 id | ReactText | - | - |
| title | 树节点标题 | ReactNode | - | - |
| disabled | 是否禁用节点 | boolean | true \| false | false |
| children | 该节点的子节点 | TreeDataItem[] | - | - |
| isLeaf | 是否为叶子节点 | boolean | true \| false | - |

### TreeNodeEventData

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ------------------------------ | ------------------- | ------ | ------ |
| children | 下一级树节点列表 | TreeNodeEventData[] | - | - |
| raw | 关联用户传入的原始数据对象 | TreeDataItem | - | - |
| depth | 该节点的层级，从 0（顶层）开始 | number | - | - |
| parent | 该节点的父节点 | TreeNodeEventData | - | - |

### TreeLevelStatus

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------------------ | ------ | ------ | ------ |
| before | 拖拽前在树中的层级 | number | - | - |
| after | 拖拽后在树中的层级 | number | - | - |

### TreeDataStatus

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ---------------------- | -------------- | ------ | ------ |
| before | 更新前整个树的数据结构 | TreeDataItem[] | - | - |
| after | 更新后整个树的数据结构 | TreeDataItem[] | - | - |

### TreeMenuActionOption

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------- | ------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------ |
| type | 菜单执行的功能 | string | editNode: 编辑当前节点 <br/> addChildNode: 添加子节点 <br/> addSiblingNode: 添加同级节点 <br/> deleteNode: 删除当前节点 | - |
| title | 菜单标题 | ReactNode | - | - |
| onClick | 点击菜单项时的回调 | ( item: TreeNodeEventData, action: TreeEditActions) => void | - | - |

### TreeEditActions

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------------- | -------------------- | ---------- | ------ | ------ |
| editNode | 执行编辑节点操作 | () => void | - | - |
| addChildNode | 执行添加子节点操作 | () => void | - | - |
| addSiblingNode | 执行添加兄弟节点操作 | () => void | - | - |
| deleteNode | 执行删除节点操作 | () => void | - | - |
| closeMenu | 执行关闭菜单操作 | () => void | - | - |
