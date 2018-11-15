import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import shallowequal from 'shallowequal'
import Popper from '../popper'
import Menu from './menu'

class Cascader extends Component {
  noHidePopper = false

  static propTypes = {
    options: PropTypes.array,
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
    noFoundTip: PropTypes.string,
    style: PropTypes.object,
    onActiveItemChange: PropTypes.func,
    onChange: PropTypes.func,
    displayRender: PropTypes.func
  }

  static defaultProps = {
    fieldNames: {},
    options: [],
    value: [],
    searchable: false,
    clearable: true,
    disabled: false,
    changeOnSelect: false,
    placeholder: '请选择',
    noFoundTip: '无匹配数据',
    onActiveItemChange: () => {},
    onChange: () => {}
  }

  constructor (props) {
    super(props)
    const cascaderValue = this.props.value
    const cacheValue = this.props.value
    const cascaderLabel = this.getCascaderLabel(cascaderValue)

    this.debouncedKeywordChange = debounce(this.onKeywordChange.bind(this), 300)
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

  componentWillReceiveProps (props) {
    let value = this.state.cacheValue
    if (!shallowequal(props.value, this.props.value)) {
      value = props.value
    }
    const cascaderLabel = this.getCascaderLabel(value)
    this.setState({
      // cascaderValue: value,
      cacheValue: value, // 缓存原始value，用户可能点击option但是没选中，用于恢复初始value
      cascaderLabel
    })
  }

  componentDidMount () {
    window.addEventListener('click', this.hidePopper.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.hidePopper.bind(this))
  }

  hidePopper (e) {
    !this.noHidePopper && this.setState({
      popperShow: false
    })
    this.noHidePopper = false
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

  getCascaderLabel (values) {
    if (this.props.displayRender) {
      return this.props.displayRender(values)
    }
    if (!values || values.length === 0) {
      return ''
    } else {
      let labels = []
      let index = 0
      let _options = this.props.options
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
        onChange(value)
        this.setState({
          cacheValue: value,
          cascaderLabel: this.getCascaderLabel(value)
        })
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
      options
    } = this.props
    const {
      keyword
    } = this.state
    if (!keyword) {
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
        if (label.indexOf(keyword) > -1 || value.indexOf(keyword) > -1) {
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
        if (label.indexOf(keyword) > -1 || value.indexOf(keyword) > -1) {
          match.matchCount--
        }
        match.options.pop()
      })
    }
    checkOptions(options, initMatchOptions)
    filterOptions = this.formatFilterOptions(filterOptions, keyword)

    this.setState({
      filterOptions
    })
  }

  formatFilterOptions (filterOptions, keyword) {
    const jointOptions = []
    const labelKey = this.labelKey()
    const valueKey = this.valueKey()
    const {
      noFoundTip
    } = this.props

    if (filterOptions.length === 0) {
      return [{
        [labelKey]: noFoundTip,
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
          if (index !== 0) {
            jointOption[labelKey].push(<span className='hi-cascader-menu__item--label-split' key={`split-${index}`}>/</span>)
          }
          jointOption[labelKey].push(this.hightlightKeyword(option[labelKey], keyword, index))
          jointOption[valueKey].push(option[valueKey])
          option.disabled && (jointOption.disabled = option.disabled)
        })
        jointOptions.push(jointOption)
      })
    }

    return jointOptions
  }

  hightlightKeyword (text, keyword, uniqueKey) {
    let parts = text.split(new RegExp(`(${keyword})`, 'gi'))
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
    this.noHidePopper = ReactDOM.findDOMNode(this.inputContainer).contains(e.target)

    // e.stopPropagation()
    if (!this.props.disabled) {
      this.showPopper()
    }
  }

  labelKey () {
    return this.props.fieldNames.label || 'label'
  }

  valueKey () {
    return this.props.fieldNames.value || 'value'
  }

  childrenKey () {
    return this.props.fieldNames.children || 'children'
  }

  render () {
    const {
      className,
      options,
      disabled,
      searchable,
      clearable,
      style
    } = this.props
    const {
      cascaderValue,
      cascaderLabel,
      keyword,
      popperShow,
      filterOptions
    } = this.state
    const extraClass = {
      'hi-cascader--disabled': disabled,
      'hi-cascader--focused': popperShow,
      'hi-cascader--clearable': clearable
    }
    const expandIcon = popperShow ? 'icon-up' : 'icon-down'
    const placeholder = cascaderLabel || this.props.placeholder

    return (
      <div className={classNames('hi-cascader', className, extraClass)} style={style}>
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
        <Popper show={popperShow} attachEle={this.inputContainer} width={'auto'} className='hi-cascader__popper'>
          <Menu
            value={cascaderValue}
            options={filterOptions || options}
            root={() => this}
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

export default Cascader
