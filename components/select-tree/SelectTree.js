import React from 'react'
import Tree from './tree'
// import NavTree from './NavTree'
import classNames from 'classnames'
// const PREFIX = 'hi-select-tree'
// const placeholder = '请选择'

class SelectTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdownShow: false,
      selectedItems: [],
      showCount: 0
    }
    this.selectedItemsRef = React.createRef()
  }
  handleClear () {
    this.setState({
      selectedItems: []
    })
  }
  calShowCountFlag = true
  componentDidUpdate () {
    if (this.calShowCountFlag && this.selectedItemsRef.current) {
      const sref = this.selectedItemsRef.current
      // 多选超过一行时以数字显示
      const itemsRect = sref.getBoundingClientRect()
      let width = 0
      let showCount = 0
      const items = sref.querySelectorAll('.hi-select__input--item')
      for (const item of items) {
        const itemRect = item.getBoundingClientRect()
        width += itemRect.width
        if (width + 16 < itemsRect.width) {
          ++showCount
        } else {
          break
        }
      }
      this.setState({ showCount })
      this.calShowCountFlag = false
    } else {
      this.calShowCountFlag = true
    }
  }
  render () {
    const { clearable, data, onChange, defaultValue, type } = this.props
    let { selectedItems, showCount, dropdownShow } = this.state
    showCount =
      showCount === 0 || this.calShowCountFlag
        ? selectedItems.length
        : showCount
    return (
      <div className='hi-select-tree'>
        <div
          className={classNames(
            'hi-select-tree__input',
            selectedItems.length === 0 && 'hi-select-tree__input--placeholder'
          )}
          onClick={() =>
            this.setState({ dropdownShow: !this.state.dropdownShow })}
        >
          <div className='hi-select-tree__selected' ref={this.selectedItemsRef}>
            {selectedItems.length > 0 &&
              selectedItems.slice(0, showCount).map((node, index) => {
                return (
                  <div key={index} className='hi-select__input--item'>
                    <div className='hi-select__input--item__name'>
                      {node.title}
                    </div>
                    <span
                      className='hi-select__input--item__remove'
                      onClick={e => {
                        e.stopPropagation()
                        // this.props.onDelete(node)
                      }}
                    >
                      <i className='hi-icon icon-close' />
                    </span>
                  </div>
                )
              })}
            {showCount < selectedItems.length &&
              <div className='hi-select__input-items--left'>
                +
                <span className='hi-select__input-items--left-count'>
                  {selectedItems.length - showCount}
                </span>
              </div>}
          </div>

          <span className='hi-select__input--icon'>
            <i
              className={classNames(
                `hi-icon icon-${dropdownShow
                  ? 'up'
                  : 'down'} hi-select-tree__input--expand`,
                { clearable: clearable && selectedItems.length > 0 }
              )}
            />
            {clearable &&
              selectedItems.length > 0 &&
              <i
                className={`hi-icon icon-close-circle hi-select-tree__icon-close`}
                onClick={this.handleClear.bind(this)}
              />}
          </span>
        </div>
        <Tree
          data={data}
          defaultCheckedIds={defaultValue}
          checkable={type === 'multiple'}
          // searchable
          // searchMode='highlight' //
          onClick={node => {
            this.setState({ selectedItems: [node] })

            onChange(node.id)
          }}
          onCheck={(result, _, checkedArr) => {
            console.log(result, checkedArr)

            this.setState({ selectedItems: checkedArr })
            // calcShowCount()
          }}
        />
        {/* <NavTree data={data} /> */}
      </div>
    )
  }
}
SelectTree.defaultProps = {
  type: 'single',
  defaultValue: [],
  data: [],
  clearable: true,
  onChange: () => {}
}
export default SelectTree
