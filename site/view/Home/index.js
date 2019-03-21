import React from 'react'
import HomeBase from './HomeBase'
import '../../../components/ficon/style/index'

class Home extends React.Component {
  render () {
    const {designText, efficiencyText, excelText, excelList} = this.state
    return (
      <div className='page'>
        <div className='section section--branding branding'>
          <div className='container'>
            <div className='branding__content'>
              <h1 className='branding__title'>HIUI，设计原则的布道者</h1>
              <div className='branding__desc'>
                <p>HIUI是一套适用于前中后台交互与界面设计标准的制定与实施的前端解决方案</p>
              </div>
              <div className='branding__figure' />
              <div className='branding__actions'>
                <a className='branding__btn branding__btn--primary' href={'#/zh-CN/docs'}>开始使用</a>
                <a className='branding__btn branding__btn--icon' href='https://github.com/XiaoMi/hiui'><i className='hi-fa fa-github' />GitHub (v1.4)</a>
              </div>
            </div>
          </div>
        </div>

        <div className='section-banner'>
          <div className='container'>
            <div className='bg' />
            <div className='con'>
              <div className='text'>HIUI，设计原则的布道者</div>
              <div className='desc'>HIUI是一套适用于前中后台交互与界面设计标准的制定与实施的前端解决方案</div>
              <div className='use'><a href={`#/zh-CN/docs`}>开始使用</a></div>
              <div className='use'><a href={`#/zh-CN/docs`}>GitHub</a></div>
            </div>
          </div>
        </div>

        <div className='section-design'>
          <div className='container'>
            <div className={`text ${designText ? 'trans' : ''}`} ref={this.designText}>好用的设计</div>
            <div className={`item-list clearfix ${designText ? 'trans' : ''}`} ref={this.designList}>
              <div className='item'>
                <div className='pic' />
                <div className='title'>交互一致性</div>
                <div className='desc'>最大限度减少用户对交互的认知成本及交互的可预期性</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>视觉统一</div>
                <div className='desc'>制定视觉风格，产出典型场景的视觉设计方案和界面规范</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>从业务中来</div>
                <div className='desc'>高度提炼 OA、仓储售后系统、BI 系统、企业中台等项目的设计经验累积</div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-efficiency'>
          <div className='container'>
            <div className='bg' />
            <div className={`con ${efficiencyText ? 'trans' : ''}`} ref={this.efficiencyText}>
              <div className='text'>一切优势, 最终都是效率优势</div>
              <div className='desc'>所有控件组件化，无论前端工程师、PHP 工程师、JAVA 工程师，不必为日新月异的前端技术所困扰。规范统一所有 API 接口，方便调用。</div>
            </div>
          </div>
        </div>

        <div className='section-excel'>
          <div className='container'>
            <div className={`text ${excelText ? 'trans' : ''}`} ref={this.excelText}>优秀到不能被忽视</div>
            <div className={`item-list clearfix ${excelList ? 'trans' : ''}`} ref={this.excelList}>
              <div className='item'>
                <div className='pic' />
                <div className='title'>实践出真知</div>
                <div className='desc'>深入海量业务实践，总结典型应用场景</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>多终端支持</div>
                <div className='desc'>广泛适用于 PC、H5、APP 以及小程序等各个终端<sup>*</sup></div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>国际化</div>
                <div className='desc'>充分预留项目 i18n 的需求，无论在 API 接口还是设计要求</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>极速产出</div>
                <div className='desc'>产品经理、设计者或工程师，都能快速产出</div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-renren'>
          <div className='container'>
            <div className='text'>我为人人</div>
            <div className='item-list clearfix'>
              <div className='item'>
                <div className='pic' />
                <div className='text-con'>
                  <div className='title'>HIUI Template<sup>*</sup></div>
                  <div className='desc'>无需掌握前端框架即可进行页面开发</div>
                </div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='text-con'>
                  <div className='title'>HIUI Library<sup>*</sup></div>
                  <div className='desc'>集成所有 HIUI 组件的 Axure/Sketch 部件库</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-footer'>* 敬请期待</div>
      </div>
    )
  }
}

export default HomeBase(Home)
