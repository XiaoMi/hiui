import { useRequest as i } from "ahooks";
function D(t) {
  const { request: e } = t, { data: a, loading: n, runAsync: r, refreshAsync: s } = i(
    async function() {
      return e ? await e() : null;
    },
    { manual: !1, refreshDeps: [e] }
  );
  return {
    detailData: a ?? null,
    isDetailDataLoading: n,
    getDetailData: r,
    refreshDetailData: s
  };
}
export {
  D as useFetchDetail
};
