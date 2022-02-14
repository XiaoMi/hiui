import React from 'react'
import Button from '../src'

export const Unset = () => {
  const btnRef = React.useRef(null)
  React.useEffect(() => {
    console.log(btnRef)
  }, [])
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" appearance="unset">
          主要按钮
        </Button>
        <Button type="secondary" appearance="unset">
          次要按钮
        </Button>
        <Button type="default" appearance="unset">
          中性按钮
        </Button>
        <Button type="danger" appearance="unset">
          危险按钮
        </Button>
        <Button type="success" appearance="unset">
          成功按钮
        </Button>
      </div>
    </>
  )
}
