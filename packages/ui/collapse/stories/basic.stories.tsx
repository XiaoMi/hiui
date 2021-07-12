import React from 'react'
import Collapse from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Collapse</h1>
      <div className="collapse-basic__wrap">
        <Collapse defaultActiveId={['2']} arrowPlacement="left">
          <Collapse.Panel title="test1" id="1" disabled>
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test2" id="2">
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test3" id="3">
            dsadasdadasdasdsa
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  )
}
