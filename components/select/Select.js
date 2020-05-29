import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import Provider from '../context'
import fetchJsonp from 'fetch-jsonp'
import qs from 'qs'
import _ from 'lodash'

class Select extends Component {
  autoloadFlag = true; // 第一次自动加载数据标识

  static propTypes = {
    type: PropTypes.oneOf(['single', 'multiple']),
    multipleWrap: PropTypes.oneOf(['wrap', 'nowrap']),
    data: PropTypes.array,
    dataSource: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number
    ]),
    showCheckAll: PropTypes.bool,
    autoload: PropTypes.bool,
    searchable: PropTypes.bool,
    filterOption: PropTypes.func,
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    emptyContent: PropTypes.string,
    optionWidth: PropTypes.number,
    style: PropTypes.object,
    onChange: PropTypes.func,
    render: PropTypes.func,
    open: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    type: 'single',
    multipleWrap: 'nowrap',
    disabled: false,
    clearable: true,
    defaultValue: '',
    autoload: false,
    showCheckAll: false,
    open: true,
    onClick: () => {},
    onBlur: () => {},
    onFocus: () => {}
  };

  constructor (props) {
    super(props)

    const { data, value, defaultValue } = props
    const dropdownItems = cloneDeep(data)
    const initialValue = value === undefined ? defaultValue : value
    const selectedItems = this.resetSelectedItems(
      initialValue,
      dropdownItems,
      []
    )

    const searchable = this.getSearchable()
    this.debouncedFilterItems = debounce(this.onFilterItems.bind(this), 300)
    this.clickOutsideHandel = this.clickOutside.bind(this)

    this.state = {
      searchable,
      queryLength: 1,
      focusedIndex: 0,
      selectedItems,
      cacheSelectedItems: selectedItems,
      dropdownItems,
      dropdownShow: false,
      fetching: false,
      keyword: '',
      filterText: '',
      searchInput: {
        width: 2
      }
    }
  }

  getChildContext () {
    return {
      component: this
    }
  }

  componentWillMount () {
    if (this.isRemote() && this.props.autoload) {
      this.remoteSearch()
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandel)
    this.resetFocusedIndex()
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickOutside (e) {
    const selectInput = ReactDOM.findDOMNode(this.selectInput)
    if (
      (selectInput && selectInput.contains(e.target)) ||
      (e.target.tagName === 'INPUT' &&
        e.target.className.includes('hi-select__dropdown__searchbar--input'))
    ) {
      return
    }
    this.hideDropdown()
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.data, this.props.data)) {
      const selectedItems = this.resetSelectedItems(
        nextProps.value || this.state.selectedItems,
        nextProps.data,
        []
      )
      this.setState({
        selectedItems,
        cacheSelectedItems: selectedItems,
        dropdownItems: cloneDeep(nextProps.data)
      })
    } else {
      if (!_.isEqual(nextProps.value, this.props.value)) {
        const selectedItems = this.resetSelectedItems(
          nextProps.value,
          this.state.dropdownItems,
          []
        ) // 异步获取时会从内部改变dropdownItems，所以不能从list取
        this.setState({
          selectedItems,
          cacheSelectedItems: selectedItems
        })
      }
    }
  }

  getSearchable () {
    const { searchable } = this.props

    if (this.isRemote()) {
      return true
    }
    return searchable
  }

  parseValue (value = this.props.value) {
    if (Array.isArray(value)) {
      return value.map(v => {
        if (typeof v === 'object') {
          return v.id
        } else {
          return v
        }
      })
    } else {
      return [value]
    }
  }

  isRemote () {
    const { dataSource, onSearch } = this.props
    return onSearch || dataSource
  }

  resetSelectedItems (value, dropdownItems = [], reviceSelectedItems = []) {
    const values = this.parseValue(value)
    let selectedItems = []
    dropdownItems.forEach(item => {
      if (values.includes(item.id)) {
        selectedItems.push(item)
      }
    })
    return _.uniqBy(reviceSelectedItems.concat(selectedItems), 'id')
  }

  onEnterSelect () {
    const { dropdownItems, focusedIndex } = this.state
    const item = dropdownItems[focusedIndex]
    this.onClickOption(item, focusedIndex)
  }

  onChange (selectedItems, changedItems, callback, cacheSelectedItems) {
    const { onChange, value } = this.props
    value === undefined &&
      this.setState(
        {
          selectedItems
        },
        callback
      )
    const selectedIds = selectedItems.map(({ id }) => id)
    onChange && onChange(selectedIds, changedItems)
  }

  checkAll (filterItems, e) {
    // 全选
    e && e.stopPropagation()

    const { selectedItems } = this.state
    let _selectedItems = [...selectedItems]
    let changedItems = []
    filterItems.forEach(item => {
      if (!item.disabled && this.matchFilter(item)) {
        if (
          !_selectedItems.map(selectItem => selectItem.id).includes(item.id)
        ) {
          _selectedItems.push(item)
          changedItems.push(item)
        }
      }
    })
    this.onChange(_selectedItems, changedItems, () => {}, _selectedItems)
  }

  onClickOption (item, index) {
    if (!item || item.disabled) return

    let selectedItems = this.state.selectedItems.concat()
    let cacheSelectedItems = this.state.selectedItems.concat()
    let focusedIndex = index

    if (this.props.type === 'multiple') {
      let itemIndex = this.state.selectedItems.findIndex(sItem => {
        return sItem.id === item.id
      })
      if (itemIndex === -1) {
        selectedItems.push(item)
        if (
          !cacheSelectedItems.map(cacheItem => cacheItem.id).includes(item.id)
        ) {
          cacheSelectedItems.push(item)
        }
      } else {
        selectedItems.splice(itemIndex, 1)
      }
    } else {
      selectedItems = [item]
      this.setState({
        cacheSelectedItems: [item]
      })
    }

    this.onChange(
      selectedItems,
      item,
      () => {
        this.setState({
          focusedIndex,
          cacheSelectedItems:
            this.props.type === 'multiple' ? cacheSelectedItems : [item]
        })
      },
      this.props.type === 'multiple' ? cacheSelectedItems : [item]
    )
    if (this.props.type !== 'multiple') {
      this.hideDropdown()
    }
  }

  clearKeyword () {
    this.setState(
      {
        keyword: ''
      },
      () => {
        this.selectInput.clearInput()
      }
    )
  }

  handleInputClick = e => {
    let { dropdownShow } = this.state
    if (dropdownShow) {
      this.hideDropdown()
      return
    }

    !this.getSearchable() && this.selectInput.focus()
    if (this.props.disabled) {
      return
    }

    if (dropdownShow === false) {
      this.showDropdown()
    }
  };

  hideDropdown () {
    this.state.dropdownShow === true &&
      this.setState(
        { dropdownShow: false, cacheSelectedItems: this.state.selectedItems },
        () => {
          this.clearKeyword()
        }
      )
  }

  showDropdown () {
    this.state.dropdownShow === false && this.setState({ dropdownShow: true })
  }

  deleteItem (item) {
    if (item.disabled) return
    let selectedItems = this.state.selectedItems.concat()
    const sIndex = selectedItems.findIndex((obj, index, arr) => {
      return obj.id === item.id
    })

    selectedItems.splice(sIndex, 1)
    this.onChange(
      selectedItems,
      item,
      () => {
        !this.getSearchable() && this.selectInput.focus()
      },
      selectedItems
    )
  }
  // 全部删除
  deleteAllItems () {
    const { type } = this.props
    const focusedIndex = this.resetFocusedIndex()
    const changedItems = [...this.state.selectedItems]
    this.onChange(
      [],
      type === 'multiple' ? changedItems : changedItems[0],
      () => {
        this.setState({ focusedIndex })
        this.onFilterItems('')
      },
      []
    )
  }

  remoteSearch (keyword) {
    const { onSearch, dataSource, autoload } = this.props
    if (onSearch && typeof onSearch === 'function') {
      this.setState({
        fetching: true
      })
      onSearch(keyword).finally(() => {
        this.setState({ fetching: false })
      })
    } else {
      const _dataSource =
        typeof dataSource === 'function' ? dataSource(keyword) : dataSource
      let {
        url,
        transformResponse,
        error,
        params,
        headers,
        mode,
        data = {},
        type = 'GET',
        key,
        jsonpCallback = 'callback',
        ...options
      } = _dataSource

      keyword =
        !keyword && this.autoloadFlag && autoload
          ? _dataSource.keyword
          : keyword
      this.autoloadFlag = false // 第一次自动加载数据后，输入的关键词即使为空也不再使用默认关键词
      Object.assign(options, { mode }, { headers })

      const queryParams = qs.stringify(
        Object.assign({}, params, key && { [key]: keyword })
      )
      if (!_.isEmpty(queryParams)) {
        url = url.includes('?')
          ? `${url}&${queryParams}`
          : `${url}?${queryParams}`
      }
      if (type.toUpperCase() === 'POST') {
        options.body = JSON.stringify(data)
      }

      this.setState({
        fetching: true
      })

      if (type.toUpperCase() === 'JSONP') {
        const _o = {
          jsonpCallback: jsonpCallback,
          jsonpCallbackFunction: jsonpCallback
        }
        fetchJsonp(url, _o)
          .then(res => res.json())
          .then(json => {
            this._setDropdownItems(json, transformResponse)
          })
      } else {
        /* eslint-disable */
        fetch(url, {
          method: type,
          ...options
        })
          .then(response => response.json())
          .then(
            res => {
              this._setDropdownItems(res, transformResponse);
            },
            err => {
              error && error(err);
              this.setState({
                fetching: false
              });
            }
          );
      }
    }
  }
  _setDropdownItems(res, func) {
    let dropdownItems = [];
    if (func) {
      dropdownItems = func(res);
    } else {
      dropdownItems = res.data;
    }
    if (Array.isArray(dropdownItems)) {
      const reviceSelectedItems =
        this.props.type === "multiple"
          ? (this.props.dataSource && this.state.selectedItems) || []
          : this.state.cacheSelectedItems;
      const selectedItems = this.resetSelectedItems(
        this.props.value,
        dropdownItems,
        reviceSelectedItems
      );
      this.setState({
        dropdownItems,
        selectedItems
      });
    }
    this.setState({
      fetching: false
    });
  }
  onFilterItems(keyword) {
    const { onSearch, dataSource, autoload } = this.props;
    this.setState(
      {
        keyword: keyword
      },
      () => this.resetFocusedIndex()
    );

    if (dataSource) {
      if (autoload || (keyword && keyword.length >= this.state.queryLength)) {
        this.remoteSearch(keyword);
      }
    } else if (onSearch) {
      this.remoteSearch(keyword);
    }
  }

  matchFilter(item) {
    const { filterOption } = this.props;
    const { searchable, keyword } = this.state;

    const shouldMatch = this.isRemote() || !searchable || !keyword;

    if (typeof filterOption === "function") {
      return shouldMatch || filterOption(keyword, item);
    }

    return (
      shouldMatch ||
      String(item.id).includes(keyword) ||
      String(item.title).includes(keyword)
    );
  }

  resetFocusedIndex(setState = true) {
    let focusedIndex = -1;

    this.state.dropdownItems.every(item => {
      focusedIndex++;
      if (!item.disabled && this.matchFilter(item)) {
        return false;
      }
      return true;
    });
    setState &&
      this.setState({
        focusedIndex
      });
    return focusedIndex;
  }

  setFocusedIndex(focusedIndex) {
    this.setState({ focusedIndex });
  }

  moveFocusedIndex(direction) {
    let { focusedIndex } = this.state;
    const { dropdownItems } = this.state;

    if (direction === "up") {
      dropdownItems
        .slice(0, focusedIndex)
        .reverse()
        .every(item => {
          focusedIndex--;
          if (!item.disabled && this.matchFilter(item)) {
            return false;
          }
          return true;
        });
    } else {
      dropdownItems.slice(focusedIndex + 1).every(item => {
        focusedIndex++;
        if (!item.disabled && this.matchFilter(item)) {
          return false;
        }
        return true;
      });
    }
    this.setState({
      focusedIndex
    });
  }

  localeDatasProps(key) {
    const { localeDatas } = this.props;
    if (this.props[key]) {
      return this.props[key];
    } else {
      return localeDatas.select[key];
    }
  }

  render() {
    const {
      type,
      showCheckAll,
      className,
      disabled,
      clearable,
      style,
      children,
      optionWidth,
      render,
      multipleWrap,
      onClick,
      onBlur,
      onFocus,
      dataSource,
      filterOption,
      onSearch,
      theme,
      localeDatas
    } = this.props;
    const placeholder = this.localeDatasProps("placeholder");
    const emptyContent = this.localeDatasProps("emptyContent");
    const searchPlaceholder = this.localeDatasProps("searchPlaceholder");
    const {
      selectedItems,
      cacheSelectedItems,
      dropdownItems,
      searchable,
      dropdownShow,
      focusedIndex,
      fetching
    } = this.state;
    const extraClass = {
      "is-multiple": type === "multiple",
      "is-single": type === "single"
    };
    const selectInputWidth = this.selectInputContainer
      ? this.selectInputContainer.getBoundingClientRect().width
      : null;
    return (
      <div
        className={classNames("hi-select", className, extraClass)}
        style={style}
      >
        <div
          className="hi-select__input-container"
          ref={node => {
            this.selectInputContainer = node;
          }}
        >
          <SelectInput
            ref={node => {
              this.selectInput = node;
            }}
            theme={theme}
            mode={type}
            disabled={disabled}
            searchable={searchable}
            clearable={clearable}
            show={dropdownShow && this.props.open}
            dropdownShow={dropdownShow}
            placeholder={placeholder}
            selectedItems={selectedItems}
            dropdownItems={dropdownItems}
            multipleMode={multipleWrap}
            container={this.selectInputContainer}
            moveFocusedIndex={this.moveFocusedIndex.bind(this)}
            onClick={() => {
              if (this.props.open) {
                this.handleInputClick();
              }
              onClick();
            }}
            onBlur={onBlur}
            onFocus={onFocus}
            onDelete={this.deleteItem.bind(this)}
            onClear={this.deleteAllItems.bind(this)}
            onSearch={this.debouncedFilterItems.bind(this)}
            onEnterSelect={this.onEnterSelect.bind(this)}
          />
        </div>
        {children}
        <Popper
          show={dropdownShow && this.props.open}
          attachEle={this.selectInputContainer}
          zIndex={1050}
          topGap={5}
          leftGap={0}
          preventOverflow={this.props.preventOverflow}
          className="hi-select__popper"
          placement={this.props.placement || "top-bottom-start"}
        >
          {dropdownShow && this.props.open && (
            <SelectDropdown
              noFoundTip={emptyContent}
              localeMap={localeDatas.select || {}}
              mode={type}
              searchPlaceholder={searchPlaceholder}
              theme={theme}
              onBlur={onBlur}
              onFocus={onFocus}
              isOnSearch={onSearch || dataSource}
              onSearch={this.debouncedFilterItems.bind(this)}
              searchable={searchable}
              showCheckAll={showCheckAll}
              checkAll={this.checkAll.bind(this)}
              loading={fetching}
              focusedIndex={focusedIndex}
              filterOption={filterOption}
              matchFilter={this.matchFilter.bind(this)}
              setFocusedIndex={this.setFocusedIndex.bind(this)}
              show={dropdownShow && this.props.open}
              optionWidth={optionWidth}
              selectInputWidth={selectInputWidth}
              onEnterSelect={this.onEnterSelect.bind(this)}
              moveFocusedIndex={this.moveFocusedIndex.bind(this)}
              dropdownItems={
                dataSource && this.state.keyword === ""
                  ? cacheSelectedItems
                  : dropdownItems
              }
              selectedItems={selectedItems}
              dropdownRender={render}
              onClickOption={this.onClickOption.bind(this)}
            />
          )}
        </Popper>
      </div>
    );
  }
}
Select.childContextTypes = {
  component: PropTypes.any
};

export default Provider(Select);
