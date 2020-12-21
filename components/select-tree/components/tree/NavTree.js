import React, { useState, useRef, useEffect, useCallback } from 'react'
import _ from 'lodash'
import EventEmitter from '../../../_util/EventEmitter'
import Icon from '../../../icon'
import { getRootNodes, getChildrenNodes, getNodeByIdTitle } from './util'
import classNames from 'classnames'
import Checkbox from '../../../checkbox'

const Bread = ({ datas, onClick, onReturnClick, localeDatas }) => {
  const datasArr = Object.keys(datas)
  datasArr.unshift(localeDatas.selectTree.back)
  if (datasArr.length > 3) {
    datasArr.splice(1, datasArr.length - 3, '...')
  }
  return (
    <div className="hi-breadtree__bread">
      {datasArr.map((item, index) => {
        const cls = classNames(
          'hi-breadtree__bread-content',
          datasArr.length > 3 && index === 1 && 'hi-breadtree__bread-content--normal'
        )
        return (
          <React.Fragment key={index}>
            <span
              className={cls}
              onClick={() => {
                index === 0
                  ? onReturnClick()
                  : ((datasArr.length === 4 && index !== 1) || datasArr.length < 4) && onClick(item)
              }}
            >
              {item}
            </span>
            {index < datasArr.length - 1 && <Icon name="right" className="hi-breadtree__separator" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}
const NavTree = ({
  data,
  checkable,
  checkedNodes,
  onCheck,
  onSelected,
  selectedItems,
  autoExpand = true,
  nodeDataState,
  onExpand: expandProps,
  localeDatas,
  activeId,
  setActiveId,
  flattenData
}) => {
  const expandData = useRef()
  const [renderData, setRenderData] = useState([])
  const [fullBreadData, setFullBreadData] = useState({})
  const [loadingState, setLoadingState] = useState('normal')
  const [currentNode, setCurrentNode] = useState(null)

  useEffect(() => {
    setLoadingState(nodeDataState)
  }, [nodeDataState])

  useEffect(() => {
    const roots = currentNode ? getChildrenNodes(currentNode, data) : getRootNodes(data)
    setRenderData(roots)
  }, [data])
  const onBreadClick = (title) => {
    let node = fullBreadData[title]
    if (title === undefined) {
      const fullBreadDataKeys = Object.keys(fullBreadData)
      const len = fullBreadDataKeys.length
      if (len > 1) {
        node = _.cloneDeep(fullBreadData[fullBreadDataKeys[len - 2]])
        console.log(node)
      } else {
        const node = getNodeByIdTitle(activeId, flattenData)
        const childNodes = getChildrenNodes(node, flattenData)
        onReturnClick(node, childNodes)
        return
      }
    }
    const _title = node.title
    setRenderData(getChildrenNodes(node, data))
    setFullBreadData((preData) => {
      const keysArr = Object.keys(preData)
      const delArr = keysArr.filter((_, index) => index > keysArr.indexOf(_title))
      delArr.forEach((key) => {
        delete preData[key]
      })
      return preData
    })
  }
  const onReturnClick = useCallback(() => {
    setLoadingState('normal')
    setRenderData(getRootNodes(data))
    setFullBreadData({})
  })
  const onNodeClick = (node, children) => {
    if (node.isLeaf) {
      onSelected(node)
      return
    }
    expandData.current = expandData.current ? expandData.current.concat([node]) : [].concat([node])
    setFullBreadData((preData) => {
      return {
        ...preData,
        [node.title]: node
      }
    })
    setCurrentNode(node)
    if (children.length > 0) {
      setRenderData(children)
      setActiveId(children[0].id)
    } else {
      setRenderData([])
      setLoadingState('loading')
      expandProps(node, true, (arg) => {
        setLoadingState(arg.length > 0 ? 'normal' : 'empty')
      })
    }
  }
  useEffect(() => {
    EventEmitter.on('$onNodeClick', onNodeClick)
    EventEmitter.on('$onBreadClick', onBreadClick)
  }, [fullBreadData])
  return (
    <div className="hi-breadtree__root">
      {Object.keys(fullBreadData).length > 0 && (
        <Bread datas={fullBreadData} localeDatas={localeDatas} onClick={onBreadClick} onReturnClick={onReturnClick} />
      )}
      {loadingState === 'empty' ? (
        <span className="hi-select-tree--empty">{localeDatas.selectTree.emptyContent}</span>
      ) : (
        <ul className="hi-breadtree__list">
          {renderData.map((node, index) => {
            const children = getChildrenNodes(node, data)
            const textCls = classNames(
              'hi-breadtree__text',
              selectedItems.find((n) => n.id === node.id) && 'hi-breadtree__text--selected'
            )
            return (
              <li key={index} className="hi-breadtree__item" data-selecttree-id={node.id}>
                {checkable && node.isLeaf ? (
                  <Checkbox
                    indeterminate={checkedNodes.semiChecked.includes(node.id)}
                    checked={checkedNodes.checked.includes(node.id)}
                    onChange={(e) => onCheck(e.target.checked, node)}
                  >
                    <span className={classNames(textCls, { 'hi-select-tree__title--focus': node.id === activeId })}>
                      {node.title}
                    </span>
                  </Checkbox>
                ) : (
                  <span
                    className={classNames(textCls, { 'hi-select-tree__title--focus': node.id === activeId })}
                    onClick={() => {
                      onNodeClick(node, children)
                    }}
                  >
                    {node.title}
                  </span>
                )}
                {(children.length > 0 || !node.isLeaf) && (
                  <Icon name={'right'} onClick={() => onNodeClick(node, children)} />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
export default NavTree
