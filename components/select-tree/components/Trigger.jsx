import React from 'react'
import classNames from 'classnames'

const Trigger = ({inputRef, type, selectedItems, onTrigger, checkedEvents, onClear, showCount, clearable, show, selectedItemsRef}) => {
  return (
    <div
      ref={inputRef}
      className={classNames(
        'hi-select-tree__input',
        type === 'multiple' ? 'multiple-values' : 'single-values',
        selectedItems.length === 0 && 'hi-select-tree__input--placeholder'
      )}
      onClick={onTrigger}
    >
      <div className='hi-select-tree__selected' ref={selectedItemsRef}>
        {selectedItems.length > 0 &&
          selectedItems.slice(0, showCount).map((node, index) => {
            return (
              <div key={index} className='hi-select__input--item'>
                <div className='hi-select__input--item__name'>
                  {node ? node.title : ''}
                </div>
                {type === 'multiple' && (
                  <span
                    className='hi-select__input--item__remove'
                    onClick={(e) => {
                      e.stopPropagation()
                      checkedEvents(false, node)
                    }}
                  >
                    <i className='hi-icon icon-close' />
                  </span>
                )}
              </div>
            )
          })}
        {showCount < selectedItems.length && (
          <div className='hi-select__input-items--left'>
            +
            <span className='hi-select__input-items--left-count'>
              {selectedItems.length - showCount}
            </span>
          </div>
        )}
      </div>

      <span className='hi-select__input--icon'>
        <i
          className={classNames(
            `hi-icon icon-${
              show ? 'up' : 'down'
            } hi-select-tree__input--expand`,
            { clearable: clearable && selectedItems.length > 0 }
          )}
        />
        {clearable && selectedItems.length > 0 && (
          <i
            className={`hi-icon icon-close-circle hi-select-tree__icon-close`}
            onClick={onClear}
          />
        )}
      </span>
    </div>
  )
}

export default Trigger
