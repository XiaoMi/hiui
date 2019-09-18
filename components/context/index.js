import React, { Component, forwardRef } from 'react'
import locales from '../locales'

export const ThemeContext = React.createContext('hiui-blue')
export const LocaleContext = React.createContext('zh-CN')

export default (WrappedComponent) => {
  class WrapperComponent extends Component {
    static displayName = WrappedComponent.name
    render () {
      const { theme, locale, innerRef, ...restProps } = this.props
      let ConsumerComponent = (
        <ThemeContext.Consumer>
          {(contextTheme) => (
            <LocaleContext.Consumer>
              {(contextLocale) => (
                <WrappedComponent
                  theme={contextTheme}
                  locale={contextLocale}
                  localeDatas={locales[contextLocale]}
                  ref={innerRef}
                  innerRef={innerRef}
                  {...restProps}
                />
              )}
            </LocaleContext.Consumer>
          )}
        </ThemeContext.Consumer>
      )

      return wrapProvider(theme, ThemeContext)(locale, LocaleContext)(
        ConsumerComponent
      )
    }
  }
  return forwardRef((props, ref) => {
    return <WrapperComponent {...props} innerRef={ref} />
  })
}

function wrapProvider (value, context) {
  wrapProvider.Providers || (wrapProvider.Providers = [])
  if (value !== undefined && context) {
    wrapProvider.Providers.push({
      value,
      context
    })
  }
  if (!context) {
    let component = value
    wrapProvider.Providers.reverse().map((obj) => {
      component = (
        <obj.context.Provider value={obj.value}>
          {component}
        </obj.context.Provider>
      )
    })
    wrapProvider.Providers = []
    return component
  }
  return wrapProvider
}
