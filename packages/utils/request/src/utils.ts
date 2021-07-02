export const isHTTPLink = (url: any): boolean => {
  return /^https?:\/\//.test(url)
}
