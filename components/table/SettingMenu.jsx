import React, { useRef, useState, useContext } from 'react'
import TableContext from './context'
import Popper from '../popper'
import Switch from '../switch'
import Icon from '../icon'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useClickOutside from './hooks/useClickOutside'

const SettingMenu = () => {
  const colMenuRef = useRef(null)
  const [showPopper, setShowPopper] = useState(false)
  const popperMenu = useRef(null)
  useClickOutside(popperMenu, () => setShowPopper(false), colMenuRef)

  const {
    sortCol,
    setSortCol,
    visibleCols,
    setVisibleCols,
    setCacheVisibleCols,
    columns,
    theme,
    localeDatas
  } = useContext(TableContext)

  const grid = 8
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: '#fff',
    border: isDragging ? '1px dashed var(--color-primary)' : 'none',

    // styles we need to apply on draggables
    ...draggableStyle
  })

  const getListStyle = (isDraggingOver) => ({
    padding: grid,
    width: 250
  })

  return (
    <React.Fragment>
      <div
        ref={colMenuRef}
        className={'hi-table__setting-btn'}
        onClick={() => {
          setShowPopper(!showPopper)
        }}
      >
        <Icon name="set" />
      </div>
      <Popper show={showPopper} attachEle={colMenuRef.current} zIndex={1040} placement="bottom-end" width="250">
        <div ref={popperMenu} className={`theme__${theme} hi-table__setting-menu`}>
          <DragDropContext
            onDragEnd={(result) => {
              if (result.destination) {
                const _sortCol = [...sortCol]
                const [removed] = _sortCol.splice(result.source.index, 1)
                _sortCol.splice(result.destination.index, 0, removed)
                setSortCol(_sortCol)
              }
            }}
          >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={Object.assign(
                    {
                      marginTop: 8,
                      width: 276,
                      boxSizing: 'border-box',
                      background: '#fff',
                      boxShadow: '0px 2px 8px 0px rgba(56,62,71,0.1)',
                      borderRadius: 4,
                      border: '1px solid rgba(231,231,231,1)'
                    },
                    getListStyle(snapshot.isDraggingOver)
                  )}
                  {...provided.droppableProps}
                >
                  <div style={{ padding: '16px 20px' }}>
                    {sortCol.map((c, index) => (
                      <Draggable key={c.dataKey} draggableId={c.dataKey} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={Object.assign(
                              {
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              },
                              getItemStyle(snapshot.isDragging, provided.draggableProps.style)
                            )}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Switch
                                checked={visibleCols.map((vc) => vc.dataKey).includes(c.dataKey)}
                                onChange={(checked) => {
                                  if (checked) {
                                    setVisibleCols(visibleCols.concat(c))
                                  } else {
                                    setVisibleCols(visibleCols.filter((col) => col.dataKey !== c.dataKey))
                                  }
                                }}
                              />
                              <span style={{ display: 'inline-block', marginLeft: 9 }}>
                                {typeof c.title === 'function' ? c.title() : c.title}
                              </span>
                            </div>

                            <Icon name="columns" />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                  <div className="btn-group">
                    <div
                      className={`btn btn--left`}
                      onClick={(e) => {
                        setShowPopper(false)
                        setCacheVisibleCols(
                          sortCol.filter((c) => visibleCols.map((vc) => vc.dataKey).includes(c.dataKey))
                        )
                      }}
                    >
                      {localeDatas.table.confirm}
                    </div>
                    <div
                      className={`btn`}
                      onClick={(e) => {
                        setVisibleCols(columns)
                        setCacheVisibleCols(columns)
                      }}
                    >
                      {localeDatas.table.reset}
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Popper>
    </React.Fragment>
  )
}

export default SettingMenu
