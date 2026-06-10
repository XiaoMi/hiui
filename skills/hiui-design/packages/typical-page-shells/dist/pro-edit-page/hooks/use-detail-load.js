import { useEffect as i } from "react";
import { useLatest as o, useRequest as f } from "ahooks";
function m(s) {
  const { detailRequest: c, formRef: t } = s, e = o(c), { loading: a, runAsync: r } = f(
    async () => {
      if (e.current)
        return await e.current();
    },
    { manual: !0 }
  );
  return i(() => {
    if (!e.current) return;
    let n = !1;
    return r().then((u) => {
      !n && u && t.current && t.current.setFieldsValue(u);
    }), () => {
      n = !0;
    };
  }, [e, r, t]), { detailLoading: a };
}
export {
  m as useLoadDetail
};
