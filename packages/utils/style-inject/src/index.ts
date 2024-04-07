const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * TODO: What is styleInject
 */
const styleInject = (css: string) => {
  if (!css || !isBrowser) return;

  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');

  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
}

export default styleInject
export { styleInject }
