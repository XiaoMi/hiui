import React from 'react'
import { TextLoop } from 'react-text-loop-next'
import Marquee from 'react-fast-marquee'
import Alert from '../src'

export const Carousel = () => {
  return (
    <>
      <h1>轮播通知</h1>
      <div className="alert-Carousel__wrap">
        <Alert
          title={
            <TextLoop mask>
              <div>蒹葭苍苍，白露为霜。</div>
              <div>所谓伊人，在水一方。</div>
              <div>溯洄从之，道阻且长。</div>
              <div>溯游从之，宛在水中央。</div>
              <div>蒹葭凄凄，白露未晞。</div>
            </TextLoop>
          }
        />
        <br />
        <Alert
          title={
            <Marquee pauseOnHover gradient={false}>
              所谓伊人，在水之湄。溯洄从之，道阻且跻。溯游从之，宛在水中坻。蒹葭采采，白露未已。
            </Marquee>
          }
        />
      </div>
    </>
  )
}
