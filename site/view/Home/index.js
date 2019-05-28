import React from 'react'
import HomeBase from './HomeBase'
import '../../../components/ficon/style/index'
import Button from '../../../components/button/Button'
import packageJson from '../../../package.json'

class Home extends React.Component {
  render () {
    const { designContent, efficiencyContent, featureContent } = this.state
    return (
      <div className='page'>
        <div className='section section--intro'>
          <div className='section__container'>
            <div className='section__content'>
              <h1 className='section__title'>HIUI，设计原则的布道者</h1>
              <div className='section__desc'>
                <p>HIUI是一套适用于前中后台交互与界面设计标准的制定与实施的前端解决方案</p>
              </div>
              <Button type='primary' href='/hiui/zh-CN/docs/quick-start'>
                开始使用
              </Button>
              <a className='github-link' href='https://github.com/XiaoMi/hiui'>
                <i className='hi-fa fa-github' />
                GitHub (v{packageJson.version})
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
                好用的设计
              </h2>
              <ul className={`flat-list flat-list--fade ${designContent ? 'flat-list--show' : ''}`}>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>交互一致性</h3>
                  <div className='flat-list__desc'>
                    最大限度减少用户对交互的认知成本及交互的可预期性
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>视觉统一</h3>
                  <div className='flat-list__desc'>
                    制定视觉风格，产出典型场景的视觉设计方案和界面规范
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>从业务中来</h3>
                  <div className='flat-list__desc'>
                    高度提炼 OA、仓储售后系统、BI 系统、企业中台等项目的设计经验累积
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
                一切优势, 最终都是效率优势
              </h2>
              <div
                className={`section__desc section__desc--fade ${
                  efficiencyContent ? 'section__desc--show' : ''
                }`}
              >
                <p>
                  所有控件组件化，无论前端工程师、PHP 工程师、JAVA
                  工程师，不必为日新月异的前端技术所困扰。规范统一所有 API 接口，方便调用。
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
                优秀到不能被忽视
              </h2>
              <ul
                className={`flat-list flat-list--fade ${featureContent ? 'flat-list--show' : ''}`}
              >
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>实践出真知</h3>
                  <div className='flat-list__desc'>深入海量业务实践，总结典型应用场景</div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>
                    多终端支持<sup>*</sup>
                  </h3>
                  <div className='flat-list__desc'>
                    广泛适用于 PC、H5、APP 以及小程序等各个终端（敬请期待）
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>国际化</h3>
                  <div className='flat-list__desc'>
                    充分预留项目 i18n 的需求，无论在 API 接口还是设计要求
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>极速产出</h3>
                  <div className='flat-list__desc'>产品经理、设计者或工程师，都能快速产出</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='section section--tool'>
          <div className='section__container'>
            <div className='section__content'>
              <h2 className='section__title'>我为人人</h2>
              <ul className='flat-list'>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>
                    HIUI Template<sup>*</sup>
                  </h3>
                  <div className='flat-list__desc'>
                    无需掌握前端框架即可进行页面开发，<a href='javascript: void(0)'>了解更多→</a>
                  </div>
                </li>
                <li className='flat-list__item'>
                  <div className='flat-list__figure' />
                  <h3 className='flat-list__name'>HIUI Library</h3>
                  <div className='flat-list__desc'>
                    集成所有 HIUI 组件的 Axure/Sketch 部件库，
                    <a href='javascript: void(0)'>现在下载→</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='section section--colophon'>
          <div className='section__container'>
            <div className='section__content'>
              <p>小米 · 信息技术部</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeBase(Home)
