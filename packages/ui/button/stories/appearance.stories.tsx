import React from 'react'
import Space from '@hi-ui/space'
import Button from '../src'

/**
 * @title 不同外观
 */
export const Appearance = () => {
  return (
    <>
      <h1>不同外观</h1>
      <div className="button-basic__wrap">
        <Space direction="column" size="lg">
          <div>
            <Button type="primary" appearance="solid">
              Solid
            </Button>
            <Button type="default" appearance="solid">
              Solid
            </Button>
            <Button type="danger" appearance="solid">
              Solid
            </Button>
            <Button type="success" appearance="solid">
              Solid
            </Button>
          </div>
          <div>
            <Button type="primary" appearance="filled">
              Filled
            </Button>
            <Button type="default" appearance="filled">
              Filled
            </Button>
            <Button type="danger" appearance="filled">
              Filled
            </Button>
            <Button type="success" appearance="filled">
              Filled
            </Button>
          </div>
          <div>
            <Button type="primary" appearance="line">
              Line
            </Button>
            <Button type="default" appearance="line">
              Line
            </Button>
            <Button type="danger" appearance="line">
              Line
            </Button>
            <Button type="success" appearance="line">
              Line
            </Button>
          </div>
          <div>
            <Button type="primary" appearance="text">
              Text
            </Button>
            <Button type="default" appearance="text">
              Text
            </Button>
            <Button type="danger" appearance="text">
              Text
            </Button>
            <Button type="success" appearance="text">
              Text
            </Button>
          </div>
          <div style={{ width: '324px' }}>
            <Button type="primary" appearance="link">
              Link
            </Button>
            <Button type="default" appearance="link">
              Link
            </Button>
            <Button type="danger" appearance="link">
              Link
            </Button>
            <Button type="success" appearance="link">
              Link
            </Button>
          </div>
        </Space>
      </div>
    </>
  )
}
