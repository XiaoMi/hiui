import { useRef as u, useState as l, useEffect as a } from "react";
function m() {
  const t = u(null), [o, r] = l(0);
  return a(() => {
    const e = t.current;
    if (!e) return;
    const s = requestAnimationFrame(() => {
      r(e.offsetHeight);
    }), n = new ResizeObserver((i) => {
      for (const f of i) {
        const c = f.target;
        r(c.offsetHeight);
      }
    });
    return n.observe(e), () => {
      cancelAnimationFrame(s), n.disconnect();
    };
  }, []), { filterRef: t, filterHeight: o };
}
export {
  m as useFilterHeight
};
