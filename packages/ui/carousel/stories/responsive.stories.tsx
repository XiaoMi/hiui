import React from 'react'
import Carousel from '../src'

/**
 * @title 响应式
 */
export const Responsive = () => {
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
    ]
  }

  return (
    <>
      <h1>Responsive</h1>
      <div className="carousel-Responsive__wrap" style={{ display: 'flex', height: '320px' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Carousel>{generateContent()}</Carousel>
        </div>
        <div
          style={{
            width: '100px',
            marginInlineStart: 4,
            flexBasis: '100px',
            height: '100%',
            flexShrink: 0,
            backgroundColor: '#2660ff',
          }}
        >
          模拟侧边栏定宽
        </div>
      </div>
    </>
  )
}
