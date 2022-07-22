
function injectCSSImport (options = {}) {
  const replaceSassPath = (path) => path.replace(/\.(scss|less)\.js/, '.css')

  return {
    name: 'inject-css-import',
    generateBundle (options_, bundle) {
      const visitedCss = [];
      Object.keys(bundle).forEach((name) => {
        const bundleItem = bundle[name];
        if (!Array.isArray(bundleItem.imports)) return
        bundleItem.imports.forEach((importPath, index) => {
          console.log(importPath);
          if (/(scss|less)\.js/.test(importPath)) {
            let code = bundle[importPath].code
            if (code && typeof code === 'string') {
              code = code.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/@use.*';/g, '');
              const codes = (/var\s.*=\s*"(.*})";\n/igm).exec(code)
              const nextFileName = replaceSassPath(importPath)
              if (!visitedCss.includes(importPath)) {
                Object.assign(bundle[importPath], {
                  fileName: nextFileName,
                  code: codes  && codes[1] || '',
                  importedBindings: null,
                  imports: []
                });
                visitedCss.push(importPath);
              }
              delete bundleItem.importedBindings[importPath];
              bundleItem.importedBindings[nextFileName] = [];
              bundleItem.imports[index] = replaceSassPath(bundleItem.imports[index]);
              bundleItem.code = replaceSassPath(bundleItem.code);
            }
          }
        });
      });
    }
  }
}

module.exports = injectCSSImport
