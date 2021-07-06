---
to: <%= h.uiDir(`${name}/src/styles/${name}.scss`) %>
---
@import '~@hi-ui/core-css/lib/index.scss';

$prefix: '#{$component-prefix}-<%= name %>' !default;

.#{$prefix} {

}
