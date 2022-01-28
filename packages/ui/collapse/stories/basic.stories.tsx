import React from 'react'
import Collapse from '../src'
import { FileFilled } from '@hi-ui/icons'

export const Basic = () => {
  return (
    <>
      <h1>Collapse</h1>
      <div className="collapse-basic__wrap">
        <h2>basic</h2>
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
          <Collapse.Panel title="test4" id="4" extra={<FileFilled />}>
            extra
          </Collapse.Panel>
        </Collapse>
        <h2>accordion</h2>
        <Collapse defaultActiveId={['2']} arrowPlacement="left" accordion>
          <Collapse.Panel title="test1" id="1" disabled>
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test2" id="2">
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test3" id="3">
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test4" id="4" extra={<FileFilled />}>
            extra
          </Collapse.Panel>
        </Collapse>
        <h2>right</h2>
        <Collapse defaultActiveId={['2']} arrowPlacement="right">
          <Collapse.Panel title="test1" id="1" disabled>
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test2" id="2">
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test3" id="3">
            dsadasdadasdasdsa
          </Collapse.Panel>
          <Collapse.Panel title="test4" id="4" extra={<FileFilled />}>
            extra
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  )
}
