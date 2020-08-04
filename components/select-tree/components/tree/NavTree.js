import React, { useState, useRef, useEffect } from 'react'
import Icon from '../../../icon'
import { getRootNodes, getChildrenNodes } from './util'
import classNames from 'classnames'
import Loading from '../../../loading'
// import './select-dropdown.scss'
import Checkbox from '../../../checkbox'

const Bread = ({ datas, onClick, onReturnClick }) => {
  const datasArr = Object.keys(datas)
  datasArr.unshift(
    <span style={{ color: '#4284F5' }} onClick={() => { }}>返回</span>
  )
  if (datasArr.length > 3) {
    datasArr.splice(1, datasArr.length - 3, '...')
  }
  return <div className='hi-breadtree__bread'>
    {
      datasArr.map((item, index) => {
        const cls = classNames(
          'hi-breadtree__bread-content',
          datasArr.length > 3 && index === 1 && 'hi-breadtree__bread-content--normal'
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
            index < datasArr.length - 1 && <Icon name='right' className='hi-breadtree__separator' />
          }
        </React.Fragment>
      })
    }
  </div>
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
  isRemoteLoadData,
  onExpand: expandProps
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
    let roots = currentNode ? getChildrenNodes(currentNode, data) : getRootNodes(data)
    setRenderData(roots)
  }, [data])
  const onBreadClick = (title) => {
    const node = fullBreadData[title]
    setRenderData(getChildrenNodes(node, data))
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
    setLoadingState('normal')
    setRenderData(getRootNodes(data))
    setFullBreadData({})
  }
  const onExpand = (node, children) => {
    expandData.current = expandData.current ? expandData.current.concat([node]) : [].concat([node])
    setFullBreadData(preData => {
      return {
        ...preData,
        [node.title]: node
      }
    })
    setCurrentNode(node)
    if (children.length > 0) {
      setRenderData(children)
    } else {
      setRenderData([])
      setLoadingState('loading')
      expandProps(node, true, (arg) => {
        setLoadingState(arg.length > 0 ? 'normal' : 'empty')
      })
    }
  }
  return (
    <div className='hi-breadtree__root'>
      {
        Object.keys(fullBreadData).length > 0 && <Bread datas={fullBreadData} onClick={onBreadClick} onReturnClick={onReturnClick} />
      }
      {
        loadingState === 'loading' && <Loading size='small' />
      }
      <ul className='hi-breadtree__list'>
        {
          loadingState === 'empty' ? <li><span className='hi-select-tree--empty-text'>无结果</span></li> : renderData.map((node, index) => {
            const children = getChildrenNodes(node, data)
            const textCls = classNames(
              'hi-breadtree__text',
              selectedItems.find(n => n.id === node.id) && 'hi-breadtree__text--selected'
            )
            return (
              <li key={index} className='hi-breadtree__item'>
                {
                  (checkable && node.isLeaf) ? <Checkbox
                    indeterminate={checkedNodes.semiChecked.includes(node.id)}
                    checked={checkedNodes.checked.includes(node.id)}
                    onChange={e => onCheck(e.target.checked, node)}
                  >
                    <span className={textCls}>
                      {node.title}
                    </span>
                  </Checkbox>
                    : <span
                      className={textCls}
                      onClick={() => {
                        console.log(111, node.isLeaf, autoExpand)
                        node.isLeaf && onSelected(node)
                        autoExpand && onExpand(node, children)
                      }}
                    >
                      {node.title}
                    </span>
                }
                {
                  (children.length > 0 || !node.isLeaf) && <Icon name={'right'} onClick={() => onExpand(node, children)} />
                }
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
export default NavTree
