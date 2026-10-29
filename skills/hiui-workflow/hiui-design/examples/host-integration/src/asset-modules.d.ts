declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}
