import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'
import message from '@hi-ui/message'

export const Async = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Async</h1>
      <div className="pop-confirm-async__wrap">
        <PopConfirm
          title="Are U ok ?"
          visible={visible}
          onClose={() => setVisible(false)}
          popper={{ closeOnOutsideClick: false, closeOnEsc: false }}
          closeOnConfirm={false}
          onConfirm={() => {
            message.open({ title: 'PopConfirm will close after 2s.' })
            setTimeout(() => {
              setVisible(false)
            }, 2000)
          }}
        >
          <Button onClick={() => setVisible(true)}>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
