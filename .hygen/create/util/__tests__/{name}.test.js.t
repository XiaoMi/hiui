---
to: <%= h.utilsDir(`${name}/__tests__/${name}.test.js`) %>
---
const <%= h.hump(name) %> = require('../src');

describe('@hi-ui/<%= name %>', () => {
  it('needs tests');
});
