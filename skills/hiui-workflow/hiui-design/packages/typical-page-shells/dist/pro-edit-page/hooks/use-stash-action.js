import { useRequest as a } from "ahooks";
function c(r) {
  const { stashRequest: t } = r, { loading: e, runAsync: n } = a(
    async (o) => {
      if (t)
        return await t(o).catch((s) => {
          throw console.error("[ProEditPage] stash request error:", s), s;
        });
    },
    { manual: !0 }
  );
  return {
    stashAsync: n,
    stashLoading: e
  };
}
export {
  c as useStashAction
};
