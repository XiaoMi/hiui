import React, { useCallback, useMemo } from 'react'
import { ComponentGroup } from './group'

export const Basic = () => {
  const keys = useMemo(() => Object.keys(ComponentGroup).sort(), [])

  const renderIcon = useCallback(({ component: Component, tagName }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '200px',
          padding: '24px 0',
          margin: '12px',
          marginLeft: '0px',
          background: '#eee',
          borderRadius: '8px',
        }}
      >
        <Component style={{ fontSize: '32px' }} />
        <div style={{ marginTop: '24px', fontSize: '14px' }}>{tagName}</div>
      </div>
    )
  }, [])
  return (
    <>
      <h1>Icons</h1>
      <div className="icons-basic__wrap">
        {keys.map((belong) => {
          const types = Array.from(
            new Set(ComponentGroup[belong as keyof typeof ComponentGroup].map((item) => item.type))
          )
          return (
            <React.Fragment key={belong}>
              <h2>{belong}</h2>
              {types.map((type) => (
                <React.Fragment key={type}>
                  <h3>{type}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {ComponentGroup[belong as keyof typeof ComponentGroup]
                      .filter((item) => item.type === type)
                      .map(renderIcon)}
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}
