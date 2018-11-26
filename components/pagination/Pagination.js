import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pager from './Pager'
import Dropdown from '../dropdown/index'
import Input from '../input'
import Provider from '../context'

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
    itemRender: defaultItemRender,
    jumpTo: 1
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
      pageSize,
      total: props.total,
      prevProps: JSON.parse(JSON.stringify(props))
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let prevProps = prevState.prevProps

    if (nextProps.current !== prevProps.current) {
      prevProps.current = nextProps.current
      prevState.current = nextProps.current
    }

    if (nextProps.pageSize !== prevProps.pageSize) {
      prevProps.pageSize = nextProps.pageSize
      prevState.pageSize = nextProps.pageSize
    }

    if (nextProps.total !== prevProps.total) {
      prevProps.total = nextProps.total
      prevState.total = nextProps.total
    }

    return prevState
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
      this.setState({ current: page })

      const pageSize = this.state.pageSize
      this.props.onChange(page, prevPage, pageSize)
    }
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
  sizeChangeEvent (val) {
    this.props.sizeChangeEvent(val, this.state.current)
  }
  render () {
    const { prefixCls, itemRender, className, pageLink, showTotal, total, pageSize, jumpEvent, sizeChangeEvent, theme, localeDatas } = this.props
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
    if (allPages <= 2 + pageBufferSize * 2) {
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
        <li key='prev' className={`${prefixCls}__item ${prefixCls}--break-prev`}>
          ...
        </li>
      )
      jumpNext = (
        <li key='next' className={`${prefixCls}__item ${prefixCls}--break-next`}>
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
      let left = Math.max(1, current - pageBufferSize + 1)
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
      if (current >= pageBufferSize * 2) {
        pagerList[0] = React.cloneElement(pagerList[0], {
          className: `${prefixCls}__item--after-break-prev`
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
            className: `${prefixCls}__item--before-break-next`
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
    const gotoPage = (e) => {
      const val = e.target.value
      const setVal = (val) => {
        this.setState({
          jumpTo: +val,
          current: +val
        })
        jumpEvent(Number(val))
      }

      if (isNaN(parseInt(val, 10)) || parseInt(val, 10) <= 0) return

      if (e.type === 'blur') {
        setVal(val)
      } else if (e.type === 'keypress') {
        if (e.charCode === 13) {
          setVal(val)
        }
      }
    }

    return (
      <div className={`${prefixCls} ${className} theme__${theme}`}>
        {
          showTotal && <span className='hi-pagination__total'>{localeDatas.pagination.total(total)}</span>
        }
        {
          sizeChangeEvent && <div className='hi-pagination__sizechange'>
            {localeDatas.pagination.itemPerPage}
            <span className='hi-pagination__sizechange-button'>
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
                  this.sizeChangeEvent(val)
                }}
              />
            </span>
            {localeDatas.pagination.item}
          </div>
        }
        <ul className='hi-pagination__list'>
          <li
            onClick={this.prev.bind(this)}
            className={`${prefixCls}__item ${prefixCls}--prev ${!prevDisabled ? '' : `${prefixCls}__item--disabled`}`}
          >
            <a href='javascript: void(0)'>
              <i className='hi-icon icon-left' />
            </a>
          </li>
          {pagerList}
          <li
            onClick={this.next.bind(this)}
            className={`${prefixCls}__item ${prefixCls}--next ${!nextDisabled ? '' : `${prefixCls}__item--disabled`}`}
          >
            <a href='javascript: void(0)'>
              <i className='hi-icon icon-right' />
            </a>
          </li>
        </ul>
        {
          jumpEvent && <div className='hi-pagination__goto'>
            {localeDatas.pagination.goto}
            <Input onKeyPress={gotoPage} onBlur={gotoPage} value={this.state.jumpTo} />
          </div>
        }
      </div>
    )
  }
}

export default Provider(Pagination)
