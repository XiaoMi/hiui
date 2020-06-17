import React, { useState, useRef } from 'react'
import Icon from '../icon'
import { getRootNodes } from './tree/util'
import classNames from 'classnames'
import './select-dropdown.scss'
import Checkbox from '../checkbox'

const renderRootEl = (data, checkable, onExpand, onCheck) => {
  return data.map((node, index) => {
    return (
      <li key={index} className='hi-select__dropdown--item'>
        {checkable && node.isLeaf && <Checkbox onChange={e => onCheck(e.target.checked, node)} />}
        <span className='hi-select__dropdown--text' onClick={() => onExpand(node)}>{node.title}</span>
        {node.children &&
          node.children.length > 0 &&
          <Icon name={'right'} onClick={() => {}} />}
      </li>
    )
  })
}
const Bread = ({datas, onClick, onReturnClick}) => {
  const datasArr = Object.keys(datas)
  datasArr.unshift(
    <span style={{color: '#4284F5'}} onClick={() => {}}>返回</span>
  )
  if (datasArr.length > 3) {
    datasArr.splice(1, datasArr.length - 3, '...')
  }
  return <div className='hi-select-breadcrumb'>
    {
      datasArr.map((item, index) => {
        const cls = classNames(
          'hi-select-breadcrumb__content',
          datasArr.length > 3 && index === 1 && 'hi-select-breadcrumb__content--normal'
        )
        return <React.Fragment key={index}>
          <span
            className={cls}

            onClick={() => {
              index === 0 ? onReturnClick() : (((datasArr.length === 4 && index !== 1) || datasArr.length < 4) && onClick(item))
            }}
          >
            {item}
          </span>
          {
            index < datasArr.length - 1 && <Icon name='right' className='hi-select-breadcrumb__separator' />
          }
        </React.Fragment>
      })
    }
  </div>
}
const NavTree = ({ data, checkable, checkedNodes, onCheck }) => {
  const expandData = useRef()
  const [renderData, setRenderData] = useState(getRootNodes(data))
  const [fullBreadData, setFullBreadData] = useState({})

  const onBreadClick = (title) => {
    const node = fullBreadData[title]
    setRenderData(node.children || [])
    setFullBreadData(preData => {
      const keysArr = Object.keys(preData)
      const delArr = keysArr.filter((_, index) => index > keysArr.indexOf(title))
      delArr.forEach(key => {
        delete preData[key]
      })
      return preData
    })
  }
  const onReturnClick = () => {
    setRenderData(getRootNodes(data))
    setFullBreadData({})
  }
  const onExpand = (node) => {
    if (node.children && node.children.length > 0) {
      expandData.current = expandData.current ? expandData.current.concat([node]) : [].concat([node])
      setRenderData(node.children || [])
      setFullBreadData(preData => {
        return {
          ...preData,
          [node.title]: node
        }
      })
    }
  }
  return (
    <div className='hi-select__dropdown'>
      {
        Object.keys(fullBreadData).length > 0 && <Bread datas={fullBreadData} onClick={onBreadClick} onReturnClick={onReturnClick} />
      }
      <ul className='hi-select__dropdown--items'>
        {renderRootEl(renderData, checkable, onExpand, onCheck)}
      </ul>
    </div>
  )
}
export default NavTree
