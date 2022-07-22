
function cleanSCSS (options = {}) {
  const replaceSassPath = (path) => path.replace(/\.(scss|less)\.js/, '.css')

  return {
    name: 'clean-scss',
    generateBundle (options_, bundle) {
      const visitedCss = [];
      Object.keys(bundle).forEach((name) => {
        const bundleItem = bundle[name];
        if (!Array.isArray(bundleItem.imports)) return
        bundleItem.imports.forEach((importPath, index) => {
          if (/(scss|less)\.js/.test(importPath)) {
            let code = bundle[importPath].code
            if (code && typeof code === 'string') {
              code = code.replace(/\\n\s*/g, '').replace(/@use 'sass:map';/g, '');
              if (!visitedCss.includes(importPath)) {
                Object.assign(bundle[importPath], {
                  code: code || '',
                });
                visitedCss.push(importPath);
              }
            }
          }
        });
      });
    }
  }
}

module.exports = cleanSCSS
