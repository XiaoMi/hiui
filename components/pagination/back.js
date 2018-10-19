import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pager from './Pager'
import Dropdown from '../dropdown/index'
import Input from '../input'
function isIntege (value) {
  return (
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  )
}

function defaultItemRender (page, type, element) {
  return element
}

function noop () {}

class Pagination extends Component {
  static propTypes = {
    defaultCurrent: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    pageLink: PropTypes.any,
    onChange: PropTypes.func
  }

  static defaultProps = {
    defaultCurrent: 1,
    current: 1,
    pageSize: 10,
    pageBufferSize: 2,
    total: 0,
    onChange: noop,
    className: '',
    prefixCls: 'hi-pagination',
    itemRender: defaultItemRender
  }

  constructor (props) {
    super(props)

    const hasOnChange = props.onChange !== noop
    const hasCurrent = 'current' in props
    if (hasCurrent && !hasOnChange) {
      console.warn(
        'Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.'
      )
    }

    let current = props.defaultCurrent
    if ('current' in props) {
      current = props.current
    }

    let pageSize = props.pageSize

    this.state = {
      current,
      pageSize
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if ('current' in nextProps) {
      return {
        current: nextProps.current,
        pageSize: nextProps.pageSize,
        total: nextProps.total
      }
    }
    return null
  }

  calculatePage (p) {
    let pageSize = p
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize
    }
    return Math.floor((this.props.total - 1) / pageSize) + 1
  }

  isValid (page) {
    return isIntege(page) && page >= 1 && page !== this.state.current
  }

  handleChange (p) {
    let page = p
    if (this.isValid(page)) {
      if (page > this.calculatePage()) {
        page = this.calculatePage()
      }
      const prevPage = this.state.current
      this.setState({
        current: page
      })
      const pageSize = this.state.pageSize
      this.props.onChange(page, prevPage, pageSize)

      return page
    }
    return this.state.current
  }

  hasPrev () {
    return this.state.current > 1
  }

  hasNext () {
    return this.state.current < this.calculatePage()
  }

  prev () {
    if (this.hasPrev()) {
      this.handleChange(this.state.current - 1)
    }
  }

  next () {
    if (this.hasNext()) {
      this.handleChange(this.state.current + 1)
    }
  }

  render () {
    const { prefixCls, itemRender, className, pageLink, showTotal, total, pageSize, jumpEvent, sizeChangeEvent } = this.props
    const { current } = this.state
    const allPages = this.calculatePage()
    const pagerList = []
    let jumpPrev = null
    let jumpNext = null
    let firstPager = null
    let lastPager = null
    const pageBufferSize = this.props.pageBufferSize
    // const prevPage = current - 1 > 0 ? current - 1 : 0
    // const nextPage = current + 1 < allPages ? current + 1 : allPages
    if (allPages <= 5 + pageBufferSize * 2) {
      for (let i = 1; i <= allPages; i++) {
        const active = (this.state.current === i)
        pagerList.push(
          <Pager
            rootPrefixCls={prefixCls}
            onClick={this.handleChange.bind(this)}
            key={i}
            page={i}
            active={active}
            pageLink={!!pageLink}
            itemRender={itemRender}
          />
        )
      }
    } else {
      jumpPrev = (
        <li key='prev' className={`${prefixCls}-break-prev`}>
          ...
        </li>
      )
      jumpNext = (
        <li key='next' className={`${prefixCls}-break-next`}>
          ...
        </li>
      )
      firstPager = (
        <Pager
          first
          rootPrefixCls={prefixCls}
          onClick={this.handleChange.bind(this)}
          key={1}
          page={1}
          active={false}
          pageLink={!!pageLink}
          itemRender={itemRender}
        />
      )
      lastPager = (
        <Pager
          last
          rootPrefixCls={prefixCls}
          onClick={this.handleChange.bind(this)}
          key={allPages}
          page={allPages}
          active={false}
          pageLink={!!pageLink}
          itemRender={itemRender}
        />
      )
      let left = Math.max(1, current - pageBufferSize)
      let right = Math.min(current + pageBufferSize, allPages)

      if (current - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2
      }
      if (allPages - current <= pageBufferSize) {
        left = allPages - pageBufferSize * 2
      }
      for (let i = left; i <= right; i++) {
        const active = (current === i)
        pagerList.push(
          <Pager
            rootPrefixCls={prefixCls}
            onClick={this.handleChange.bind(this)}
            key={i}
            page={i}
            active={active}
            pageLink={!!pageLink}
            itemRender={itemRender}
          />
        )
      }
      if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
        pagerList[0] = React.cloneElement(pagerList[0], {
          className: `${prefixCls}-item-after-break-prev`
        })
        pagerList.unshift(jumpPrev)
      }
      if (
        allPages - current >= pageBufferSize * 2 &&
        current !== allPages - 2
      ) {
        pagerList[pagerList.length - 1] = React.cloneElement(
          pagerList[pagerList.length - 1],
          {
            className: `${prefixCls}-item-before-break-next`
          }
        )
        pagerList.push(jumpNext)
      }
      if (left !== 1) {
        pagerList.unshift(firstPager)
      }
      if (right !== allPages) {
        pagerList.push(lastPager)
      }
    }

    const prevDisabled = !this.hasPrev()
    const nextDisabled = !this.hasNext()
    return (
      <div className={`${prefixCls} ${className}`}>
        {
          showTotal && <span className='hi-pagination-total'>共{total}条</span>
        }
        {
          sizeChangeEvent && <div className='hi-pagination-sizechange'>
            每页
            <span className='hi-pagination-sizechange-button'>
              <Dropdown title={pageSize} type='button'
                list={[{
                  value: 10,
                  title: '10'
                }, {
                  value: 20,
                  title: '20'
                }, {
                  value: 50,
                  title: '50'
                }, {
                  value: 100,
                  title: '100'
                }]}
                onClick={(val) => {
                  sizeChangeEvent(val)
                }}
              />
            </span>
            条
          </div>
        }
        <ul className='hi-pagination-list-container'>
          <li
            onClick={this.prev.bind(this)}
            className={`${!prevDisabled
              ? ''
              : `${prefixCls}-disabled`} ${prefixCls}-prev`}
          >
            <a href='javascript:;'>
              <i className='hi-icon icon-left' />
            </a>
          </li>
          {pagerList}
          <li
            onClick={this.next.bind(this)}
            className={`${!nextDisabled
              ? ''
              : `${prefixCls}-disabled`} ${prefixCls}-next`}
          >
            <a href='javascript:;'>
              <i className='hi-icon icon-right' />
            </a>
          </li>
        </ul>
        {
          jumpEvent && <div className='hi-pagination-jump'>
            前往
            <Input onBlur={(e) => {
              let val = e.target.value
              jumpEvent(Number(val))
            }} value={1} />
          </div>
        }
      </div>
    )
  }
}

export default Pagination
