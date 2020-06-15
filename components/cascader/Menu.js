import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Loading from '../loading'

class Menu extends Component {
  static propTypes = {
    value: PropTypes.array,
    options: PropTypes.array,
    onSelect: PropTypes.func
  }

  root () {
    return this.props.root()
  }

  getOptionValues (values, optionValue, index) {
    if (index === 0) {
      return [optionValue]
    } else {
      return values.slice(0, index).concat([optionValue])
    }
  }

  renderMenus = () => {
    const {
      value,
      options,
      onSelect,
      isFiltered,
      filterOptionWidth,
      theme,
      trigger,
      onHoverSelect,
      onHoverClick
    } = this.props
    const root = this.root()
    const menus = []
    const valueKey = root.valueKey()
    const labelKey = root.labelKey()
    const childrenKey = root.childrenKey()
    let currentOptions = options.slice()
    let deep = 0
    while (currentOptions) {
      let currentValue = value[deep]
      const _currentOptions = currentOptions.slice()
      currentOptions = false

      menus.push(
        <ul className={`hi-cascader-menu theme__${theme}`} key={deep} style={{width: isFiltered ? filterOptionWidth : 'auto'}}>
          {
            _currentOptions.length === 0 &&
            <Loading size='small' />
          }
          {
            _currentOptions.map((option, index) => {
              const optionValue = option[valueKey]
              const hasChildren = Array.isArray(option[childrenKey])
              const isExpanded = hasChildren && optionValue === currentValue
              // const expandIcon = isExpanded ? 'icon-right' : 'icon-right'
              const expandIcon = 'icon-right'
              const optionValues = option.jointOption ? optionValue : this.getOptionValues(value, optionValue, deep) // jointOption为true代表搜索拼接出来的option，直接取value即可
              if (isExpanded) {
                currentOptions = option[childrenKey]
              }
              return (
                <li
                  className={classNames('hi-cascader-menu__item', {
                    'hi-cascader-menu__item-expanded': hasChildren,
                    'hi-cascader-menu__item-disabled': !!option.disabled,
                    'hi-cascader-menu__item-active': currentValue === optionValue
                  })}
                  onMouseEnter={(e) => {
                    if (trigger === 'hover') {
                      e.stopPropagation()
                      !option.disabled && onHoverSelect(optionValues, hasChildren)
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (trigger === 'click') {
                      !option.disabled && onSelect(optionValues, hasChildren)
                    } else {
                      !option.disabled && onHoverClick(optionValues, hasChildren)
                    }
                  }}
                  key={optionValue + index}
                >
                  <span className='hi-cascader-menu__item--label'>
                    { option[labelKey] }
                  </span>
                  {
                    hasChildren &&
                    <i className={classNames('hi-cascader-menu__item--icon', 'hi-icon', expandIcon)} />
                  }
                </li>
              )
            })
          }
        </ul>
      )
      deep++
    }
    return menus
  }

  render () {
    const menus = this.renderMenus()

    return menus
  }
}

export default Menu
