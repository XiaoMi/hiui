'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
/**
 * TODO: What is injectHeadStyle
 */

var injectHeadStyle = function injectHeadStyle(css) {
  if (!css || !isBrowser) return;
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
};

exports.default = injectHeadStyle;
exports.injectHeadStyle = injectHeadStyle;
//# sourceMappingURL=inject-head-style.cjs.development.js.map
