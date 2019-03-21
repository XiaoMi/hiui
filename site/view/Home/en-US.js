import React from 'react'
import HomeBase from './HomeBase'

class Home extends React.Component {
  render () {
    const {designText, efficiencyText, excelText, excelList} = this.state
    return (
      <div className='page'>
        <div className='section-banner'>
          <div className='container'>
            <div className='bg' />
            <div className='con'>
              <div className='text'>HIUI, the evangelist for the principles of design</div>
              <div className='desc'>HIUi is a solution that is adequate for the fomulation and implementation of interaction and UI design standard for front,middle and backend .</div>
              <div className='use'><a href={`#/en-US/docs`}>Start</a></div>
            </div>
          </div>
        </div>

        <div className='section-design'>
          <div className='container'>
            <div className={`text ${designText ? 'trans' : ''}`} ref={this.designText}>excellent design</div>
            <div className={`item-list clearfix ${designText ? 'trans' : ''}`} ref={this.designList}>
              <div className='item'>
                <div className='pic' />
                <div className='title'>interaction consistency</div>
                <div className='desc'>Highly minimize user perception of interaction costs and predictability of interactions</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>visual unity</div>
                <div className='desc'>Build outstanding vitual style and get vitual design and interface specification for  typical scenario.</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>from the bussiness</div>
                <div className='desc'>Highly refined design experience in OA, warehousing and after-sales systems, BI systems, and corporate mid-station projects</div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-efficiency'>
          <div className='container'>
            <div className='bg' />
            <div className={`con ${efficiencyText ? 'trans' : ''}`} ref={this.efficiencyText}>
              <div className='text'>All advantages, ultimately the efficiency advantage</div>
              <div className='desc'>All the control will be component-based, whether you are a front-end developer, php developer or Java developer, you dont need to concern about the front-end tech you may know or not. We have standardlized all API and easy for you to use.</div>
            </div>
          </div>
        </div>

        <div className='section-excel'>
          <div className='container'>
            <div className={`text ${excelText ? 'trans' : ''}`} ref={this.excelText}>way too excellent to be ignored</div>
            <div className={`item-list clearfix ${excelList ? 'trans' : ''}`} ref={this.excelList}>
              <div className='item'>
                <div className='pic' />
                <div className='title'>practise to get the truth</div>
                <div className='desc'>deep going through bussiness practise, summerize typical application scenarios</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>multi-terminal support</div>
                <div className='desc'>it is widely applicated to PC, H5, APP, mini apps and other terminals<sup>*</sup></div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>internationalization</div>
                <div className='desc'>fully reserved the requirement for i18n project include both API and interface</div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='title'>extremely fast output</div>
                <div className='desc'>you can get what you want real quick for every PM ,designer and developer</div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-renren'>
          <div className='container'>
            <div className='text'>one for all</div>
            <div className='item-list clearfix'>
              <div className='item'>
                <div className='pic' />
                <div className='text-con'>
                  <div className='title'>HIUI Template<sup>*</sup></div>
                  <div className='desc'>instantly page development without knowing any front-end framework</div>
                </div>
              </div>
              <div className='item'>
                <div className='pic' />
                <div className='text-con'>
                  <div className='title'>HIUI Library<sup>*</sup></div>
                  <div className='desc'>Axure/Sketch component library which integrates all HIUI components</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='section-footer'>* Stay tuned</div>
      </div>
    )
  }
}

export default HomeBase(Home)
