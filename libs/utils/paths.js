const docEnv = process.env.DOC_ENV
// const nodeEnv = process.env.NODE_ENV
export const isGithub = docEnv === 'github'
// const isDevelopment = nodeEnv === 'development'

export const paths = {
  publicPath: isGithub ? '/hiui/' : '/'
}
