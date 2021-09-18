import React from 'react'
import Message from '../src'
import Button from '@hi-ui/button';

export const Basic = () => {
  console.log(Message);

  return (
    <>
      <h1>Basic</h1>
      <div className="message-basic__wrap">
        {/* <Message></Message> */}
        <Button onClick={() => {
          Message.open({
            title: 'xxxx'
          })
        }}>Toast</Button>
      </div>
    </>
  )
}
