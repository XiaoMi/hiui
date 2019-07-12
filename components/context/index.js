import React, { Component } from 'react'
import locales from '../locales'

export const ThemeContext = React.createContext('hiui-blue')
export const LocaleContext = React.createContext('zh-CN')
export const VersionContext = React.createContext(1.5)

export default (WrappedComponent) =>
  class WrapperComponent extends Component {
    render () {
      const { theme, locale, version, ...restProps } = this.props
      let ConsumerComponent = (
        <ThemeContext.Consumer>
          {(contextTheme) => (
            <LocaleContext.Consumer>
              {(contextLocale) => (
                <VersionContext.Consumer>
                  {(contextVersion) => (
                    <WrappedComponent
                      theme={contextTheme}
                      version={contextVersion}
                      locale={contextLocale}
                      localeDatas={locales[contextLocale]}
                      {...restProps}
                    />
                  )}
                </VersionContext.Consumer>
              )}
            </LocaleContext.Consumer>
          )}
        </ThemeContext.Consumer>
      )

      return wrapProvider(theme, ThemeContext)(locale, LocaleContext)(
        version,
        VersionContext
      )(ConsumerComponent)
    }
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
