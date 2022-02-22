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
          return (
            <React.Fragment key={belong}>
              <h2>{belong}</h2>
              <h3>filled</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {ComponentGroup[belong as keyof typeof ComponentGroup]
                  .filter((item) => item.type === 'filled')
                  .map(renderIcon)}
              </div>
              <h3>outlined</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {ComponentGroup[belong as keyof typeof ComponentGroup]
                  .filter((item) => item.type === 'outlined')
                  .map(renderIcon)}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}
