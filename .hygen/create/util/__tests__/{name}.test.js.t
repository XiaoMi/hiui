---
to: <%= h.utilsDir(`${name}/__tests__/${name}.test.js`) %>
---
const <%= name %> = require('../src');

describe('@hi-ui/<%= name %>', () => {
  it('needs tests');
});
