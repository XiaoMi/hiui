---
to: <%= h.uiDir(`${name}/__tests__/${name}.test.js`) %>
---
const <%= h.camelCase(name) %> = require('../src');

describe('@hi-ui/<%= name %>', () => {
  it('needs tests');
});
