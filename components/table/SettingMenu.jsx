import React, { useRef, useState, useContext } from 'react'
import TableContext from './context'
import Popper from '../popper'
import Switch from '../switch'
import Icon from '../icon'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useClickOutside from './hooks/useClickOutside'

const StandardTable = () => {
  const colMenuRef = useRef(null)
  const [showPopper, setShowPopper] = useState(false)
  const popperMenu = useRef(null)
  useClickOutside(popperMenu, () => setShowPopper(false), colMenuRef)

  const { sortCol, setSortCol, visibleCols, setVisibleCols, setCacheVisibleCols, columns } = useContext(TableContext)

  const grid = 8
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: '#fff',
    border: isDragging ? '1px dashed #4285f4' : 'none',

    // styles we need to apply on draggables
    ...draggableStyle
  })

  const getListStyle = (isDraggingOver) => ({
    padding: grid,
    width: 250
  })

  return (
    <div
      ref={colMenuRef}
      onClick={() => {
        setShowPopper(!showPopper)
      }}
      style={{
        position: 'absolute',
        height: '100%',
        zIndex: 3,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #E0E1E2',
        borderBottom: '1px solid #E0E1E2',
        color: '#999999',
        cursor: 'pointer',
        fontSize: '14px',
        width: 16,
        background: 'rgb(251, 251, 251)'
      }}
    >
      <Icon name="set" />
      <Popper show={showPopper} attachEle={colMenuRef.current} zIndex={1040} placement="bottom-end" width="250">
        <div ref={popperMenu}>
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
                  <div
                    style={{
                      display: 'flex',
                      borderTop: '1px solid rgba(231,231,231,1)',
                      height: 48,
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        textAlign: 'center',
                        borderRight: '1px solid rgba(231,231,231,1)',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        setShowPopper(false)
                        setCacheVisibleCols(
                          sortCol.filter((c) => visibleCols.map((vc) => vc.dataKey).includes(c.dataKey))
                        )
                      }}
                    >
                      确定
                    </div>
                    <div
                      style={{ width: '50%', textAlign: 'center', cursor: 'pointer' }}
                      onClick={(e) => {
                        setVisibleCols(columns)
                        setCacheVisibleCols(columns)
                      }}
                    >
                      重置
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Popper>
    </div>
  )
}

export default StandardTable
