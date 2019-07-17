import React from 'react'
import HomeBase from './HomeBase'
import '@components/ficon/style/index'
import Button from '@components/button/Button'
import { version } from '../../../package.json'

class Home extends React.Component {
  render () {
    const { designContent, efficiencyContent, featureContent } = this.state
    return (
      <div className='page'>
        <div className='section section--intro'>
          <div className='section__container'>
            <div className='section__content'>
              <h1 className='section__title'>HIUI, the evangelist for the principles of design</h1>
              <div className='section__desc'>
                <p>
                  HIUi is a solution that is adequate for the fomulation and implementation of
                  interaction and UI design standard for front,middle and backend.
                </p>
              </div>
              <Button type='primary' href='/en-US/docs/quick-start'>
                Start
              </Button>
              <a className='github-link' href='https://github.com/XiaoMi/hiui'>
                <i className='hi-fa fa-github' />
                GitHub (v{version})
              </a>
            </div>
            <div className='section__figure' />
          </div>
        </div>

        <div className='section section--design'>
          <div className='section__container'>
            <div className='section__content' ref={this.designContent}>
              <h2
                className={`section__title section__title--fade ${
                  designContent ? 'section__title--show' : ''
                }`}
              >
                Excellent Design
              </h2>
              <ul className={`flat-list flat-list--fade ${designContent ? 'flat-list--show' : ''}`}>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>Interaction Consistency</h3>
                  <div className='flat-list__desc'>
                    Highly minimize user perception of interaction costs and predictability of
                    interactions
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>Visual Unity</h3>
                  <div className='flat-list__desc'>
                    Build outstanding vitual style and get vitual design and interface specification
                    for typical scenario.
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>From the Bussiness</h3>
                  <div className='flat-list__desc'>
                    Highly refined design experience in OA, warehousing and after-sales systems, BI
                    systems
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='section section--efficiency'>
          <div className='section__container'>
            <div className='section__content' ref={this.efficiencyContent}>
              <h2
                className={`section__title section__title--fade ${
                  efficiencyContent ? 'section__title--show' : ''
                }`}
              >
                All advantages, ultimately the efficiency advantage
              </h2>
              <div
                className={`section__desc section__desc--fade ${
                  efficiencyContent ? 'section__desc--show' : ''
                }`}
              >
                <p>
                  All the control will be component-based, whether you are a front-end developer,
                  php developer or Java developer, you dont need to concern about the front-end tech
                  you may know or not. We have standardlized all API and easy for you to use.
                </p>
              </div>
            </div>
            <div
              className={`section__figure section__figure--fade ${
                efficiencyContent ? ' section__figure--show' : ''
              }`}
            />
          </div>
        </div>

        <div className='section section--feature'>
          <div className='section__container'>
            <div className='section__content' ref={this.featureContent}>
              <h2
                className={`section__title section__title--fade ${
                  featureContent ? 'section__title--show' : ''
                }`}
              >
                way too excellent to be ignored
              </h2>
              <ul
                className={`flat-list flat-list--fade ${featureContent ? 'flat-list--show' : ''}`}
              >
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>Practise to get the truth</h3>
                  <div className='flat-list__desc'>
                    Deep going through bussiness practise, summerize typical application scenarios
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>
                    Multi-terminal support<sup>*</sup>
                  </h3>
                  <div className='flat-list__desc'>
                    It is widely applicated to PC, H5, APP, mini apps and other terminals (coming
                    soon)
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>i18n</h3>
                  <div className='flat-list__desc'>
                    Fully reserved the requirement for i18n project include both API and interface
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>Extremely fast output</h3>
                  <div className='flat-list__desc'>
                    You can get what you want real quick for every PM ,designer and developer
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='section section--tool'>
          <div className='section__container'>
            <div className='section__content'>
              <h2 className='section__title'>One for all</h2>
              <ul className='flat-list'>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>
                    HIUI Template<sup>*</sup>
                  </h3>
                  <div className='flat-list__desc'>
                    Instantly page development without knowing any front-end framework,{' '}
                    <a href='javascript: void(0)'>Learn more→</a>
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>HIUI Library</h3>
                  <div className='flat-list__desc'>
                    Axure/Sketch component library which integrates all HIUI components,{' '}
                    <a href='javascript: void(0)'>Download→</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='section section--colophon'>
          <div className='section__container'>
            <div className='section__content'>
              <p>Xiaomi · Info Tech Dep</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeBase(Home)
