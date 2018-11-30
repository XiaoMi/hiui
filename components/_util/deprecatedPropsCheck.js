function deprecatedWarning (componentName, propName, propValue) {
  console.warn(
    `Deprecated Warning: Invalid prop \`${propName}\` of value \`${propValue}\` supplied to \`${componentName}\`.`
  )
}

export default function deprecatedPropsCheck (deprecatedProps, props, componentName) {
  for (const propName in deprecatedProps) {
    if (deprecatedProps.hasOwnProperty(propName)) {
      if (deprecatedProps[propName].includes(props[propName])) {
        deprecatedWarning(componentName, propName, props[propName])
      }
    }
  }
}

export { deprecatedWarning }
