import { useLatest as t } from "ahooks";
function e(o) {
  return { ...o };
}
function p(o) {
  const r = e(o);
  return { propsRef: t(r) };
}
export {
  e as getNormalizedProps,
  p as useProps
};
