import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import Popper from '../popper'
import isEqual from 'lodash/isEqual'
import shallowequal from 'shallowequal'
import Menu from './Menu'
import Provider from '../context'

class Cascader extends Component {
  static propTypes = {
    data: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.array
    ]),
    fieldNames: PropTypes.object,
    searchable: PropTypes.bool,
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    changeOnSelect: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    emptyContent: PropTypes.string,
    style: PropTypes.object,
    onActiveItemChange: PropTypes.func,
    onChange: PropTypes.func,
    displayRender: PropTypes.func,
    filterOption: PropTypes.func
  }

  static defaultProps = {
    fieldNames: {},
    data: [],
    value: [],
    searchable: false,
    clearable: true,
    disabled: false,
    changeOnSelect: false,
    onActiveItemChange: () => {},
    onChange: () => {}
  }

  constructor (props) {
    super(props)
    const cascaderValue = this.props.value
    const cacheValue = this.props.value
    const cascaderLabel = this.getCascaderLabel(cascaderValue)
    this.hiCascader = React.createRef()
    this.debouncedKeywordChange = debounce(this.onKeywordChange.bind(this), 300)
    this.clickOutsideHandel = this.clickOutside.bind(this)
    this.state = {
      filterOptions: false,
      cacheValue,
      cascaderValue,
      cascaderLabel,
      popperShow: false,
      keyword: ''
    }
  }

  getChildContext () {
    return {
      component: this
    }
  }
  componentWillReceiveProps (nextProps) {
    if (!shallowequal(nextProps.value, this.props.value) || !isEqual(nextProps.data, this.props.data)) {
      const cascaderLabel = this.getCascaderLabel(nextProps.value, nextProps.data)
      this.setState({
        cacheValue: nextProps.value, // 缓存原始value，用户可能点击option但是没选中，用于恢复初始value
        cascaderLabel
      })
    }
  }
  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandel)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickOutside (e) {
    if (
      (ReactDOM.findDOMNode(this.inputContainer) && ReactDOM.findDOMNode(this.inputContainer).contains(e.target)) ||
      (ReactDOM.findDOMNode(this.menuNode) && ReactDOM.findDOMNode(this.menuNode).contains(e.target))
    ) {
      return
    }
    this.hidePopper()
  }

  hidePopper (e) {
    this.setState({
      popperShow: false
    })
  }

  showPopper () {
    this.setState({
      keyword: '',
      filterOptions: false,
      cascaderValue: this.state.cacheValue,
      popperShow: true
    })
    this.inputRef.focus()
  }

  getCascaderLabel (values, data) {
    if (this.props.displayRender) {
      return this.props.displayRender(values)
    }
    if (!values || values.length === 0) {
      return ''
    } else {
      let labels = []
      let index = 0
      let _options = data || this.props.data
      const labelKey = this.labelKey()
      const valueKey = this.valueKey()
      const childrenKey = this.childrenKey()

      while (_options && _options.length > 0 && labels.length <= values.length) {
        let value = values[index]
        index++
        _options.every(option => {
          if (option[valueKey] === value) {
            labels.push(option[labelKey])
            _options = option[childrenKey]
            return false
          } else {
            _options = []
            return true
          }
        })
      }
      return labels.join(' / ')
    }
  }

  clearValue (e) {
    e.stopPropagation()
    this.onChangeValue([], false)
  }

  onChangeValue (value, hasChildren) {
    const {
      onChange,
      onActiveItemChange,
      changeOnSelect
    } = this.props
    this.setState({
      filterOptions: false,
      keyword: '',
      cascaderValue: value
    }, () => {
      if (changeOnSelect || !hasChildren) {
        this.setState({
          cacheValue: value,
          cascaderLabel: this.getCascaderLabel(value)
        }, () => onChange(value))
      }
      if (hasChildren) {
        onActiveItemChange(value)
      } else {
        this.hidePopper()
      }
    })
  }

  onKeywordChange () {
    const {
      data
    } = this.props
    const {
      keyword
    } = this.state
    if (!keyword) {
      this.setState({
        filterOptions: false
      })
      return
    }
    const labelKey = this.labelKey()
    const valueKey = this.valueKey()
    const childrenKey = this.childrenKey()
    let filterOptions = []
    const initMatchOptions = {options: [], matchCount: 0}
    const checkOptions = (options, match) => {
      options.map(option => {
        let label = option[labelKey]
        const value = option[valueKey]
        const children = option[childrenKey]
        if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
          match.matchCount++
        }

        match.options.push({
          [labelKey]: label,
          [valueKey]: value,
          disabled: option.disabled
        })

        if (children && children.length > 0) {
          checkOptions(children, match)
        } else {
          if (match.matchCount > 0) {
            filterOptions.push(match.options.slice())
          }
        }
        if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
          match.matchCount--
        }

        match.options.pop()
      })
    }

    checkOptions(data, initMatchOptions)
    filterOptions = this.formatFilterOptions(filterOptions, keyword)
    this.setState({
      filterOptions
    })
  }

  localeDatasProps (key) {
    const {
      localeDatas
    } = this.props

    if (this.props[key]) {
      return this.props[key]
    } else {
      return localeDatas.cascader[key]
    }
  }

  formatFilterOptions (filterOptions, keyword) {
    const {
      filterOption: filterFunc
    } = this.props
    const jointOptions = []
    const levelItems = []
    const levelItemsObj = {}

    const labelKey = this.labelKey()
    const valueKey = this.valueKey()
    const emptyContent = this.localeDatasProps('noFoundTip')
    if (filterOptions.length === 0) {
      return [{
        [labelKey]: emptyContent,
        [valueKey]: '',
        disabled: true
      }]
    } else {
      filterOptions.map(options => {
        let jointOption = {
          jointOption: true,
          [labelKey]: [],
          [valueKey]: []
        }
        options.map((option, index) => {
          let levelItem = {
            jointOption: true,
            [labelKey]: [],
            [valueKey]: []
          }
          if (index !== 0) {
            jointOption[labelKey].push(<span className='hi-cascader-menu__item--label-split' key={`split-${index}`}>/</span>)
          }
          levelItem[labelKey] = jointOption[labelKey].concat(this.hightlightKeyword(option[labelKey], keyword, index + '-' + jointOption[labelKey].length))
          levelItem[valueKey] = jointOption[valueKey].concat(option[valueKey])

          jointOption[labelKey].push(this.hightlightKeyword(option[labelKey], keyword, index))
          jointOption[valueKey].push(option[valueKey])
          option.disabled && (jointOption.disabled = option.disabled)
          option.disabled && (levelItem.disabled = option.disabled)
          if (!levelItemsObj[levelItem[valueKey]]) {
            levelItemsObj[levelItem[valueKey]] = levelItem[valueKey]
            if (filterFunc) {
              if (filterFunc(keyword, option) && (levelItem[valueKey].toString().includes(keyword) || option[labelKey].toString().includes(keyword))) levelItems.push(levelItem)
            } else {
              if (levelItem[valueKey].toString().includes(keyword) || option[labelKey].toString().includes(keyword)) levelItems.push(levelItem)
            }
          }
        })

        jointOptions.push(jointOption)
      })
    }
    if (levelItems.length === 0) {
      return [{
        [labelKey]: emptyContent,
        [valueKey]: '',
        disabled: true
      }]
    }
    return levelItems
  }

  hightlightKeyword (text, keyword, uniqueKey) {
    let parts = text.split(new RegExp(`(\\${keyword})`, 'gi'))
    return (
      <span key={uniqueKey}>
        { parts.map((part, i) =>

          <span key={i} className={part === keyword ? 'hi-cascader-menu__item--label-hightlight' : ''}>
            { part }
          </span>
        )
        }
      </span>
    )
  }

  handleClick (e) {
    if (this.state.popperShow) {
      this.hidePopper()
      return
    }
    // e.stopPropagation()
    if (!this.props.disabled) {
      this.showPopper()
    }
  }

  labelKey () {
    return this.props.fieldNames.label || 'content'
  }

  valueKey () {
    return this.props.fieldNames.value || 'id'
  }

  childrenKey () {
    return this.props.fieldNames.children || 'children'
  }

  render () {
    const {
      className,
      data,
      disabled,
      searchable,
      clearable,
      style
    } = this.props
    const {
      cascaderValue,
      keyword,
      popperShow,
      filterOptions,
      cascaderLabel
    } = this.state
    const extraClass = {
      'hi-cascader--disabled': disabled,
      'hi-cascader--focused': popperShow,
      'hi-cascader--clearable': clearable
    }
    const expandIcon = popperShow ? 'icon-up' : 'icon-down'
    const placeholder = cascaderLabel || this.localeDatasProps('placeholder')
    return (
      <div className={classNames('hi-cascader', className, extraClass)} style={style} ref={this.hiCascader}>
        <div className='hi-cascader__input-container' ref={node => { this.inputContainer = node }} onClick={this.handleClick.bind(this)}>
          <input
            ref={node => {
              this.inputRef = node
            }}
            className='hi-cascader__input-keyword'
            value={(popperShow && keyword) || (!popperShow && cascaderLabel) || ''}
            readOnly={!searchable}
            disabled={disabled}
            placeholder={placeholder}
            onChange={e => { this.setState({keyword: e.target.value}) }}
            onKeyUp={this.debouncedKeywordChange.bind(this)}
          />
          <span className='hi-cascader__icon'>
            <i className={classNames('hi-cascader__icon--expand', 'hi-icon', expandIcon)} />
            {
              clearable &&
              <i className='hi-cascader__icon--clear hi-icon icon-close-circle' onClick={this.clearValue.bind(this)} />
            }
          </span>
        </div>
        <Popper
          show={popperShow}
          attachEle={this.inputContainer}
          zIndex={1050}
          topGap={5}
          width={'auto'}
          className='hi-cascader__popper'
          placement='top-bottom-start'
        >
          <Menu
            ref={node => { this.menuNode = node }}
            value={cascaderValue}
            options={filterOptions || data}
            root={() => this}
            isFiltered={filterOptions}
            filterOptionWidth={this.hiCascader.current && this.hiCascader.current.clientWidth}
            onSelect={this.onChangeValue.bind(this)}
          />
        </Popper>
      </div>
    )
  }
}

Cascader.childContextTypes = {
  component: PropTypes.any
}

export default Provider(Cascader)
export {
  Cascader
}
