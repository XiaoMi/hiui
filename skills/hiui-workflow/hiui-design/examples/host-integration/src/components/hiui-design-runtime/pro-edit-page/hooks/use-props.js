import { useLatest as a } from "ahooks";
function b(t) {
  const o = t.fields ?? [], s = t.groups, n = t.steps, e = t.beforeSubmit, c = t.beforeStash, r = t.onCancel, u = t.onSubmitSuccess, S = t.onSubmitError, i = t.onStashSuccess, f = t.onStashError;
  return {
    fields: o,
    groups: s,
    steps: n,
    beforeSubmit: e,
    beforeStash: c,
    onCancel: r,
    onSubmitSuccess: u,
    onSubmitError: S,
    onStashSuccess: i,
    onStashError: f
  };
}
function h(t) {
  const o = b(t);
  return { propsRef: a(o) };
}
export {
  b as getNormalizedProps,
  h as useProps
};
