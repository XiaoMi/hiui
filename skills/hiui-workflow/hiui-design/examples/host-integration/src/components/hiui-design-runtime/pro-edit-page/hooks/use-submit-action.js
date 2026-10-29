import { useRequest as s } from "ahooks";
function c(u) {
  const { submitRequest: t } = u, { loading: e, runAsync: n } = s(
    async (o) => {
      if (t)
        return await t(o).catch((r) => {
          throw console.error("[ProEditPage] submit request error:", r), r;
        });
    },
    { manual: !0 }
  );
  return {
    submitAsync: n,
    submitLoading: e
  };
}
export {
  c as useSubmitAction
};
