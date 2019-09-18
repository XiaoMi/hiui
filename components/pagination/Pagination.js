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
    max: PropTypes.number,
    showJumper: PropTypes.bool,
    autoHide: PropTypes.bool,
    total: PropTypes.number,
    onChange: PropTypes.func,
    itemRender: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onJump: PropTypes.func,
    pageSizeOptions: PropTypes.array,
    type: PropTypes.oneOf(['simple', 'default', 'shrink'])
  }

  static defaultProps = {
    pageSizeOptions: [],
    showJumper: false,
    autoHide: false,
    type: 'default',
    defaultCurrent: 1,
    pageSize: 10,
    max: 2,
    total: 0,
    onChange: noop,
    className: '',
    prefixCls: 'hi-pagination'
  }

  constructor (props) {
    super(props)

    const {
      defaultCurrent,
      current: propsCurrent,
      pageSize,
      total
    } = props
    const current = this.getCurrent(propsCurrent !== undefined ? propsCurrent : defaultCurrent, this.calculatePage(total, pageSize))
    this.jumper = React.createRef()
    this.state = {
      current,
      jumpTo: current,
      pageSize,
      total: props.total
    }
  }

  componentWillReceiveProps (props) {
    let states = {}
    if (props.pageSize !== this.props.pageSize) {
      states.pageSize = props.pageSize
    }
    if (props.total !== this.props.total) {
      states.total = props.total
    }
    let current
    if (props.current !== undefined && this.state.current !== props.current) {
      current = this.getCurrent(props.current, this.calculatePage(props.total, props.pageSize))
    }
    if (current) {
      states.current = current
      states.jumpTo = current
    }

    this.setState({...states})
  }

  getCurrent (current, maxPage) {
    if (current < 1) {
      return 1
    } else if (current > maxPage) {
      return maxPage
    }

    return current
  }

  calculatePage (total, pageSize) {
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize
    }
    return Math.ceil(total / pageSize)
  }

  handleChange (page) {
    const prevPage = this.state.current
    const maxPage = this.calculatePage(this.props.total)

    if (isInteger(page) && page !== prevPage && page >= 1 && page <= maxPage) {
      const pageSize = this.state.pageSize
      this.props.onChange(page, prevPage, pageSize)
      this.props.current !== undefined || this.setState({
        current: page,
        jumpTo: page
      })
    }
  }

  prev () {
    if (this.state.current > 1) {
      return this.state.current - 1
    }
    return -1
  }

  next () {
    if (this.state.current < this.calculatePage(this.props.total)) {
      return this.state.current + 1
    }
    return -1
  }

  onPageSizeChange (pageSize) {
    const {
      total,
      onPageSizeChange
    } = this.props
    const current = this.getCurrent(this.state.current, this.calculatePage(total, pageSize)) // pageSize改动需要重新计算当前页，避免超过最大页情况

    this.setState({
      pageSize
    }, () => {
      onPageSizeChange && onPageSizeChange(pageSize, current)
      this.handleChange(current)
    })
  }

  renderPageSizes () {
    const { pageSize, pageSizeOptions, prefixCls, localeDatas: {
      pagination: { itemPerPage: i18nItemPerPage, item: i18nItem }
    } } = this.props

    if (pageSizeOptions.length === 0) {
      return null
    }

    return (
      <div className={`${prefixCls}__sizes ${prefixCls}__text`}>
        <div className={`${prefixCls}__span`}>
          <Dropdown legacy={false} title={`${pageSize} ${i18nItem}/${i18nItemPerPage}`} type='button'
            data={pageSizeOptions.map(n => ({
              value: typeof n === 'object' ? n.value : n,
              title: `${n} ${i18nItem}/${i18nItemPerPage}`
            }))}
            width={100}
            trigger='click'
            onClick={(val) => {
              this.onPageSizeChange(val)
            }}
          />
        </div>
      </div>
    )
  }

  renderJumper () {
    const { showJumper, prefixCls, localeDatas } = this.props

    if (!showJumper) {
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
    const { prefixCls, total } = this.props

    return (
      <div className={`${prefixCls}__jumper-input`}>
        <Input ref={this.jumper} onKeyPress={this.gotoPage.bind(this)} onBlur={this.gotoPage.bind(this)} value={this.state.jumpTo} onChange={(e, tVal) => {
          const val = e.target.value
          if (/^\d+$/.test(val)) {
            const maxPage = this.calculatePage(total)
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
    const setPageNum = (page) => {
      this.handleChange(page)
      this.props.onJump && this.props.onJump(Number(page))
    }

    if (e.type === 'blur') {
      setPageNum(pageNum)
    } else if (e.type === 'keypress') {
      if (e.charCode === 13) {
        setPageNum(pageNum)
        this.jumper.current._Input.blur()
      }
    }
  }

  renderPagers () {
    const { max, total, prefixCls } = this.props
    const {
      current
    } = this.state
    const maxPage = this.calculatePage(total)
    const prevPager = this.renderPrevPager() // 上一页
    const nextPager = this.renderNextPager() // 下一页
    let pagers = [prevPager]
    let leftBuffer, rightBuffer
    if (max * 2 + 1 + 2 >= maxPage) {
      leftBuffer = 1
      rightBuffer = maxPage
    } else if ((maxPage - current) <= max) {
      rightBuffer = maxPage
      leftBuffer = maxPage - 2 * max - 1
      leftBuffer = leftBuffer <= 1 ? 1 : leftBuffer
    } else if ((current - max) <= 1) {
      leftBuffer = 1
      rightBuffer = 2 * max + leftBuffer + 1
      rightBuffer = rightBuffer >= maxPage ? maxPage : rightBuffer
    } else {
      leftBuffer = current - max
      rightBuffer = current + max
    }

    if (leftBuffer !== 1) {
      pagers.push(this.renderPager(1, {active: current === 1}))
    }
    if (leftBuffer > 2) {
      pagers.push(this.renderPager('...', {className: `${prefixCls}__item-break`, itemRender: breakItemRender}))
    }
    for (let index = leftBuffer; index <= rightBuffer; index++) {
      pagers.push(this.renderPager(index, {active: current === index}))
    }
    if (rightBuffer < maxPage - 1) {
      pagers.push(this.renderPager('...', {className: `${prefixCls}__item-break`, itemRender: breakItemRender}))
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
    return this.renderPager(prevPage, {className: `${prefixCls}__item-prev`, disabled: prevPage < 1}, <i className='hi-icon icon-left' />)
  }

  renderNextPager () {
    const { prefixCls } = this.props
    const nextPage = this.next()
    return this.renderPager(nextPage, {className: `${prefixCls}__item-next`, disabled: nextPage < 1}, <i className='hi-icon icon-right' />)
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

  renderNormal () { // 标准分页
    const { prefixCls, showTotal, total, localeDatas: { pagination: { total: i18nTotal } } } = this.props

    return (
      <React.Fragment>
        {
          showTotal &&
          <div className={`${prefixCls}__total ${prefixCls}__text`}>
            {i18nTotal[0]}<span className={`${prefixCls}__span`}>{total}</span>{i18nTotal[1]}
          </div>
        }
        {this.renderPageSizes()}
        {this.renderPagers()}
        {this.renderJumper()}
      </React.Fragment>
    )
  }

  renderSimple () { // 简单分页
    const {
      total,
      prefixCls,
      localeDatas: {
        pagination: { simple: i18nSimple }
      }
    } = this.props
    const maxPage = this.calculatePage(total)

    if (maxPage === 0) {
      return null
    }

    return (
      <div className={`${prefixCls}__text`}>
        <span>{i18nSimple[0]}</span>
        {this.renderJumperInput()}
        <span>{i18nSimple[1]}</span>
        <span className={`${prefixCls}__span`}>/</span>
        {i18nSimple[2]}<span className={`${prefixCls}__span`}>{maxPage}</span>{i18nSimple[3]},
        <span className={`${prefixCls}__span`}>{total} {i18nSimple[4]}</span>
      </div>
    )
  }

  renderPn () { // 上一页下一页
    const {
      prefixCls,
      total,
      showJumper
    } = this.props
    const maxPage = this.calculatePage(total)

    if (maxPage === 0) {
      return null
    }

    const prevPager = this.renderPrevPager()
    const nextPager = this.renderNextPager()

    return (
      <React.Fragment>
        {prevPager}
        {
          showJumper &&
          <div className={`${prefixCls}__text`}>
            {this.renderJumperInput()}
            /
            <span style={{margin: '0 8px'}}>{maxPage}</span>
          </div>
        }
        {nextPager}
      </React.Fragment>
    )
  }

  render () {
    const {
      autoHide,
      total,
      type,
      mode,
      prefixCls,
      className,
      theme
    } = this.props
    const maxPage = this.calculatePage(total)
    if (maxPage === 0 || (autoHide && (maxPage === 1))) {
      return null
    }
    let children

    switch (type || mode) {
      case 'simple':
        children = this.renderSimple()
        break

      case 'shrink':
        children = this.renderPn()
        break

      default:
        children = this.renderNormal()
        break
    }

    return (
      <div className={`${prefixCls} ${prefixCls}--${type} ${className} theme__${theme}`}>
        {children}
      </div>
    )
  }
}

export default Provider(Pagination)
