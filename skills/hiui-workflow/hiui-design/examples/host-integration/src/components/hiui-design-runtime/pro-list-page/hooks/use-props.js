import { useLatest as o } from "ahooks";
function r(e) {
  const t = e.queryFields ?? [], s = e.tableFields ?? [];
  return {
    queryFields: t,
    tableFields: s
  };
}
function i(e) {
  const t = r(e);
  return { propsRef: o(t) };
}
export {
  r as getNormalizedProps,
  i as useProps
};
