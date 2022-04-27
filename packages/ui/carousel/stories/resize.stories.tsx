import React from 'react'
import Carousel from '../src'

/**
 * @title 自定义宽高
 */
export const Resize = () => {
  const generateContent = () => {
    return [
      <div
        key={'1'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <img
          src={
            'https://images.unsplash.com/photo-1451772741724-d20990422508?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          }
          alt={'1'}
          onClick={() => console.error('1')}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            color: '#fff',
            fontSize: '36px',
            textShadow: '2px 2px 8px #fff',
          }}
        >
          Christmas
        </div>
      </div>,
      <img
        key={'2'}
        src={
          'https://images.unsplash.com/photo-1595923941716-39a9c58a9661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
        }
        alt={'2'}
        onClick={() => console.error('2')}
      />,
      <img
        key={'3'}
        src={
          'https://images.unsplash.com/photo-1491466424936-e304919aada7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
        }
        alt={'3'}
        onClick={() => console.error('3')}
      />,
      <img
        key={'4'}
        src={
          'https://images.unsplash.com/photo-1640280056011-e1c0fda0fef5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
        }
        alt={'4'}
        onClick={() => console.error('4')}
      />,
    ]
  }

  return (
    <>
      <h1>Resize</h1>
      <h2>760 X 320</h2>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '320px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>760 X 469</h2>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '469px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
      <h2>760 X 200</h2>
      <div className="carousel-basic__wrap" style={{ width: '760px', height: '200px' }}>
        <Carousel>{generateContent()}</Carousel>
      </div>
    </>
  )
}
