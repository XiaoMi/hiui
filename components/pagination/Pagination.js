import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pager from './Pager'
import Dropdown from '../dropdown/index'
import Input from '../input'
import Provider from '../context'

function isInteger (value) {
  return (
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  )
}

function breakItemRender (page, element) {
  return element
}

function noop () {}

class Pagination extends Component {
  static propTypes = {
    defaultCurrent: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
    itemRender: PropTypes.func,
    pageSizeOptions: PropTypes.array,
    mode: PropTypes.oneOf(['simple', 'normal', 'pn'])
  }

  static defaultProps = {
    pageSizeOptions: [],
    showQuickJumper: true,
    mode: 'normal',
    defaultCurrent: 1,
    pageSize: 10,
    pageBufferSize: 2,
    total: 0,
    onChange: noop,
    className: '',
    prefixCls: 'hi-pagination'
  }

  constructor (props) {
    super(props)

    let current = props.defaultCurrent
    let pageSize = props.pageSize

    this.state = {
      current,
      jumpTo: current,
      pageSize,
      total: props.total,
      prevProps: JSON.parse(JSON.stringify(props))
    }
  }

  componentWillReceiveProps (props) {
    let states = {}

    if (props.defaultCurrent !== this.props.defaultCurrent) {
      states = {
        current: props.defaultCurrent,
        jumpTo: props.defaultCurrent
      }
    }
    if (props.pageSize !== this.props.pageSize) {
      states.pageSize = props.pageSize
    }
    if (props.total !== this.props.total) {
      states.total = props.total
    }

    this.setState({...states})
  }

  calculatePage (pageSize) {
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize
    }
    return Math.floor((this.props.total - 1) / pageSize) + 1
  }

  isValid (page) {
    return isInteger(page) && page >= 1 && page !== this.state.current
  }

  handleChange (page) {
    if (this.isValid(page)) {
      if (page > this.calculatePage()) {
        page = this.calculatePage()
      }

      const prevPage = this.state.current
      this.setState({
        current: page,
        jumpTo: page
      })

      const pageSize = this.state.pageSize
      this.props.onChange(page, prevPage, pageSize)
    }
  }

  prev () {
    if (this.state.current > 1) {
      return this.state.current - 1
    }
    return -1
  }

  next () {
    if (this.state.current < this.calculatePage()) {
      return this.state.current + 1
    }
    return -1
  }

  sizeChangeEvent (pageSize) {
    this.setState({
      pageSize
    }, () => {
      this.props.sizeChangeEvent && this.props.sizeChangeEvent(pageSize, this.state.current)
    })
  }

  renderPageSizes () {
    const { pageSize, pageSizeOptions, prefixCls, localeDatas } = this.props

    if (pageSizeOptions.length === 0) {
      return null
    }

    return (
      <div className={`${prefixCls}__sizes ${prefixCls}__text`}>
        {localeDatas.pagination.itemPerPage}
        <div className={`${prefixCls}__span`}>
          <Dropdown title={pageSize} type='button'
            list={pageSizeOptions}
            onClick={(val) => {
              this.sizeChangeEvent(val)
            }}
          />
        </div>
        {localeDatas.pagination.item}
      </div>
    )
  }

  renderJumper () {
    const { showQuickJumper, prefixCls, localeDatas } = this.props

    if (!showQuickJumper) {
      return null
    }

    return (
      <div className={`${prefixCls}__jumper ${prefixCls}__text`}>
        {localeDatas.pagination.goto}
        {this.renderJumperInput()}
        {localeDatas.pagination.page}
      </div>
    )
  }

  renderJumperInput () {
    const { prefixCls } = this.props

    return (
      <div className={`${prefixCls}__jumper-input`}>
        <Input onKeyPress={this.gotoPage.bind(this)} onBlur={this.gotoPage.bind(this)} value={this.state.jumpTo} onChange={(e, tVal) => {
          const val = e.target.value
          if (/^\d+$/.test(val)) {
            const maxPage = this.calculatePage()
            const jumpTo = val < 1 ? 1 : (val > maxPage ? maxPage : val)

            this.setState({
              jumpTo
            })
          } else {
            this.setState({
              jumpTo: this.state.jumpTo
            })
          }
        }} />
      </div>
    )
  }

  gotoPage = e => {
    const pageNum = parseInt(e.target.value)
    const setPageNum = (val) => {
      this.setState({
        current: val
      })
      this.props.jumpEvent && this.props.jumpEvent(Number(val))
    }

    if (e.type === 'blur') {
      setPageNum(pageNum)
    } else if (e.type === 'keypress') {
      if (e.charCode === 13) {
        setPageNum(pageNum)
      }
    }
  }

  renderPagers () {
    const { pageBufferSize } = this.props
    const {
      current
    } = this.state
    const maxPage = this.calculatePage()
    if (maxPage === 0) {
      return null
    }
    const prevPager = this.renderPrevPager()
    const nextPager = this.renderNextPager()
    let pagers = [prevPager]
    let leftBuffer, rightBuffer
    if (pageBufferSize * 2 + 1 + 2 >= maxPage) {
      leftBuffer = 1
      rightBuffer = maxPage
    } else if ((maxPage - current) <= pageBufferSize) {
      rightBuffer = maxPage
      leftBuffer = maxPage - 2 * pageBufferSize - 1
      leftBuffer = leftBuffer <= 1 ? 1 : leftBuffer
    } else if ((current - pageBufferSize) <= 1) {
      leftBuffer = 1
      rightBuffer = 2 * pageBufferSize + leftBuffer + 1
      rightBuffer = rightBuffer >= maxPage ? maxPage : rightBuffer
    } else {
      leftBuffer = current - pageBufferSize
      rightBuffer = current + pageBufferSize
    }
    console.log('----------renderPagers', leftBuffer, rightBuffer)
    if (leftBuffer !== 1) {
      pagers.push(this.renderPager(1, {active: current === 1}))
    }
    if (leftBuffer > 2) {
      pagers.push(this.renderPager('...', {itemRender: breakItemRender}))
    }
    for (let index = leftBuffer; index <= rightBuffer; index++) {
      pagers.push(this.renderPager(index, {active: current === index}))
    }
    if (rightBuffer < maxPage - 1) {
      pagers.push(this.renderPager('...', {itemRender: breakItemRender}))
    }
    if (rightBuffer !== maxPage) {
      pagers.push(this.renderPager(maxPage, {active: current === maxPage}))
    }
    pagers.push(nextPager)

    return pagers
  }

  renderPrevPager () {
    const { prefixCls } = this.props
    const prevPage = this.prev()
    return this.renderPager(prevPage, {className: `${prefixCls}__item--after-break-prev`, disabled: prevPage < 1}, <i className='hi-icon icon-left' />)
  }

  renderNextPager () {
    const { prefixCls } = this.props
    const nextPage = this.next()
    return this.renderPager(nextPage, {className: `${prefixCls}__item--after-break-next`, disabled: nextPage < 1}, <i className='hi-icon icon-right' />)
  }

  pagerIndex = 0
  renderPager (page, props, children) {
    const { prefixCls, itemRender, pageLink } = this.props
    this.pagerIndex++

    return (
      <Pager
        key={this.pagerIndex}
        rootPrefixCls={prefixCls}
        onClick={this.handleChange.bind(this)}
        page={page}
        pageLink={!!pageLink}
        itemRender={itemRender || props.itemRender}
        {...props}
      >
        {children}
      </Pager>
    )
  }

  renderNormal () {
    const { prefixCls, showTotal, total } = this.props

    return (
      <React.Fragment>
        {
          showTotal &&
          <div className={`${prefixCls}__total ${prefixCls}__text`}>
            共<span className={`${prefixCls}__span`}>{total}</span>条
          </div>
        }
        {this.renderPageSizes()}
        {this.renderPagers()}
        {this.renderJumper()}
      </React.Fragment>
    )
  }

  renderSimple () {
    const {
      total,
      prefixCls
    } = this.props
    const maxPage = this.calculatePage()

    if (maxPage === 0) {
      return null
    }

    return (
      <div className={`${prefixCls}__text`}>
        <span>第</span>
        {this.renderJumperInput()}
        <span>页</span>
        <span className={`${prefixCls}__span`}>/</span>
        共<span className={`${prefixCls}__span`}>{this.calculatePage()}</span>页,
        <span className={`${prefixCls}__span`}>{total}条记录</span>
      </div>
    )
  }

  renderPn () { // 上一页下一页
    const {
      prefixCls,
      showQuickJumper
    } = this.props
    const maxPage = this.calculatePage()

    if (maxPage === 0) {
      return null
    }

    const prevPager = this.renderPrevPager()
    const nextPager = this.renderNextPager()

    return (
      <React.Fragment>
        {prevPager}
        {
          showQuickJumper &&
          <div className={`${prefixCls}__text`}>
            {this.renderJumperInput()}
            /
            <span style={{marginRight: '8px'}}>{maxPage}</span>
          </div>
        }
        {nextPager}
      </React.Fragment>
    )
  }

  render () {
    const {
      mode,
      prefixCls,
      className,
      theme
    } = this.props
    let children

    switch (mode) {
      case 'normal':
        children = this.renderNormal()
        break

      case 'simple':
        children = this.renderSimple()
        break

      case 'pn':
        children = this.renderPn()
        break

      default:
        children = this.renderNormal()
        break
    }

    return (
      <div className={`${prefixCls} ${prefixCls}--${mode} ${className} theme__${theme}`}>
        {children}
      </div>
    )
  }
}

export default Provider(Pagination)
