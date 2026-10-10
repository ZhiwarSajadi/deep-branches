import { Fragment, createElement, useEffect, useMemo, useRef } from "react";
import { FP_STATE, fpName, fpRels, fpSp } from "../lib/lineage.js";
import { CLADES } from "../data/species.js";
import { formatMaShort, yToMa } from "../lib/time.js";
export function FpHud({ fp, onJump }) {
  let sp = fpSp(fp),
    cc = (
      CLADES[sp.clade] || {
        color: "#2a2522",
      }
    ).color,
    rels = useMemo(
      () =>
        fpRels(fp).map((x) => {
          let s = fpSp(x.id);
          return {
            ...x,
            color: (
              CLADES[s.clade] || {
                color: "#2a2522",
              }
            ).color,
            name: fpName(s),
          };
        }),
      [fp],
    ),
    chips = useRef([]),
    elev = useRef(null),
    track = useRef(null),
    thumb = useRef(null),
    seg = useRef(null),
    maEl = useRef(null);
  useEffect(() => {
    let raf = 0,
      prev = performance.now(),
      lastMa = "";
    let loop = (ts) => {
      raf = requestAnimationFrame(loop);
      let dt = Math.min((ts - prev) / 1e3, 0.1);
      prev = ts;
      let W = FP_STATE.W || innerWidth,
        H = FP_STATE.H || innerHeight,
        L = 14,
        R = W - 14,
        T = 14,
        B = H - 14,
        rc = (q) => {
          let x = document.querySelector(q);
          return x ? x.getBoundingClientRect() : null;
        },
        dk = rc(".dock"),
        cd = rc(".card"),
        ev = rc(".fp-elev"),
        ht = document.querySelector(".fp-hint");
      dk && (B = Math.min(B, dk.top - 12));
      if (cd) {
        cd.left > W * 0.4 ? (R = Math.min(R, cd.left - 14)) : (B = Math.min(B, cd.top - 10));
      }
      if (ht && getComputedStyle(ht).visibility !== "hidden") {
        T = Math.max(T, ht.getBoundingClientRect().bottom + 8);
      }
      ev && (L = Math.max(L, ev.right + 10));
      let vr = FP_STATE.vr;
      if (vr && track.current && thumb.current && seg.current) {
        let span = Math.max(vr.hi - vr.lo, 0.001),
          fu = FP_STATE.u,
          f0 = (vr.b0 - vr.lo) / span,
          f1 = (vr.b1 - vr.lo) / span;
        thumb.current.style.top = ((1 - fu) * 100).toFixed(2) + "%";
        seg.current.style.top = ((1 - f1) * 100).toFixed(2) + "%";
        seg.current.style.height = Math.max((f1 - f0) * 100, 1.5).toFixed(2) + "%";
        let txt = formatMaShort(yToMa(vr.lo + span * fu));
        if (txt !== lastMa && maEl.current) {
          lastMa = txt;
          maEl.current.textContent = txt;
        }
      }
      let M = FP_STATE.marks || [],
        cx = (L + R) / 2,
        cy = (T + B) / 2,
        it = [];
      for (let j = 0; j < rels.length; j++) {
        let k = M[j],
          el = chips.current[j];
        if (!el) continue;
        if (!k || k.id !== rels[j].id) {
          el._on && ((el._on = 0), el.classList.remove("on"));
          continue;
        }
        let w = el.offsetWidth,
          h = el.offsetHeight,
          m = el._st === "edge" ? 26 : 0,
          inside = !k.behind && k.px >= L + m && k.px <= R - m && k.py >= T + m && k.py <= B - m,
          x,
          y,
          ang = 0;
        if (inside) {
          x = k.px;
          y = k.py - h / 2 - 14;
        } else {
          let dx = k.dx,
            dy = k.dy;
          if (!k.behind) {
            dx = k.px - cx;
            dy = k.py - cy;
          }
          let l = Math.hypot(dx, dy);
          if (l < 0.001) {
            dx = 0;
            dy = 1;
          } else {
            dx /= l;
            dy /= l;
          }
          let hw = Math.max((R - L) / 2 - w / 2, 0),
            hh = Math.max((B - T) / 2 - h / 2, 0),
            tx = Math.abs(dx) > 1e-4 ? hw / Math.abs(dx) : 1e9,
            ty = Math.abs(dy) > 1e-4 ? hh / Math.abs(dy) : 1e9,
            tt = Math.min(tx, ty);
          x = cx + dx * tt;
          y = cy + dy * tt;
          ang = Math.atan2(dy, dx);
        }
        let stt = inside ? "pin" : "edge";
        if (el._st !== stt) {
          el._st = stt;
          el.classList.toggle("pin", inside);
          el.title = inside
            ? `Jump to ${rels[j].name}`
            : `Turn to face ${rels[j].name} · double-click to jump there`;
        }
        x = Math.min(Math.max(x, L + w / 2), R - w / 2);
        y = Math.min(Math.max(y, T + h / 2), B - h / 2);
        it.push({
          el,
          w,
          h,
          x,
          y,
          ang,
          inside,
          j,
        });
      }
      it.sort((p, q) => p.y - q.y || p.x - q.x || p.j - q.j);
      for (let ps = 0; ps < 4; ps++) {
        for (let a = 0; a < it.length; a++)
          for (let b = a + 1; b < it.length; b++) {
            let p = it[a],
              q = it[b],
              dx = q.x - p.x,
              dy = q.y - p.y,
              ox = (p.w + q.w) / 2 + 6 - Math.abs(dx),
              oy = (p.h + q.h) / 2 + 4 - Math.abs(dy);
            if (ox > 0 && oy > 0) {
              if (oy <= ox) {
                let sg = dy > 0 ? 1 : dy < 0 ? -1 : p.j < q.j ? 1 : -1;
                p.y -= (sg * oy) / 2;
                q.y += (sg * oy) / 2;
              } else {
                let sg = dx > 0 ? 1 : dx < 0 ? -1 : p.j < q.j ? 1 : -1;
                p.x -= (sg * ox) / 2;
                q.x += (sg * ox) / 2;
              }
            }
          }
        for (let q of it) {
          q.x = Math.min(Math.max(q.x, L + q.w / 2), R - q.w / 2);
          q.y = Math.min(Math.max(q.y, T + q.h / 2), B - q.h / 2);
        }
      }
      let kk = 1 - Math.exp(-dt * 28);
      for (let q of it) {
        let el = q.el;
        if (!el._on) {
          el._on = 1;
          el.classList.add("on");
          el._x = q.x;
          el._y = q.y;
        } else {
          el._x += (q.x - el._x) * kk;
          el._y += (q.y - el._y) * kk;
        }
        el.style.transform = `translate(${el._x.toFixed(1)}px,${el._y.toFixed(1)}px) translate(-50%,-50%)`;
        if (!q.inside) {
          el._arr || (el._arr = el.querySelector(".arr"));
          el._arr && (el._arr.style.transform = `rotate(${q.ang}rad)`);
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fp]);
  let E = createElement,
    setFromY = (cy) => {
      let t = track.current;
      if (!t) return;
      let r = t.getBoundingClientRect();
      FP_STATE.api && FP_STATE.api.setU(1 - (cy - r.top) / Math.max(r.height, 1));
    },
    hb = (d) => ({
      onPointerDown: (v) => {
        v.preventDefault();
        try {
          v.currentTarget.setPointerCapture(v.pointerId);
        } catch {}
        FP_STATE.api && FP_STATE.api.hold(d);
      },
      onPointerUp: () => FP_STATE.api && FP_STATE.api.hold(0),
      onPointerCancel: () => FP_STATE.api && FP_STATE.api.hold(0),
      onLostPointerCapture: () => FP_STATE.api && FP_STATE.api.hold(0),
    }),
    chev = (d) =>
      E(
        "svg",
        {
          width: 16,
          height: 16,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
        },
        E("path", {
          d,
        }),
      );
  return E(
    Fragment,
    null,
    E("div", {
      className: "fp-vignette",
      style: {
        "--c": cc,
      },
    }),
    E(
      "div",
      {
        className: "fp-key",
        "aria-hidden": "true",
      },
      E(
        "span",
        null,
        E(
          "svg",
          {
            width: 30,
            height: 8,
            viewBox: "0 0 30 8",
          },
          E("path", {
            d: "M2 4H28",
            stroke: "currentColor",
            strokeWidth: 3.4,
            strokeLinecap: "round",
            fill: "none",
          }),
        ),
        "Supported link",
      ),
      E(
        "span",
        null,
        E(
          "svg",
          {
            width: 30,
            height: 8,
            viewBox: "0 0 30 8",
          },
          E("path", {
            d: "M2 4H28",
            stroke: "currentColor",
            strokeWidth: 3.4,
            strokeLinecap: "round",
            strokeDasharray: "5 5",
            fill: "none",
          }),
        ),
        "Debated link",
      ),
    ),
    E(
      "div",
      {
        className: "fp-elev",
        ref: elev,
        style: {
          "--c": cc,
        },
        role: "group",
        "aria-label": "Move up and down this bar",
      },
      E(
        "button",
        {
          type: "button",
          title: "Climb toward the present (W / E)",
          "aria-label": "Move up the bar",
          ...hb(1),
        },
        chev("M6 15l6-6 6 6"),
      ),
      E(
        "div",
        {
          className: "fp-track",
          ref: track,
          title: "Drag to move along this bar",
          onPointerDown: (v) => {
            try {
              v.currentTarget.setPointerCapture(v.pointerId);
            } catch {}
            setFromY(v.clientY);
          },
          onPointerMove: (v) => {
            v.buttons && setFromY(v.clientY);
          },
        },
        E("div", {
          className: "fp-seg",
          ref: seg,
        }),
        E("div", {
          className: "fp-thumb",
          ref: thumb,
        }),
      ),
      E(
        "button",
        {
          type: "button",
          title: "Descend toward the past (S / Q)",
          "aria-label": "Move down the bar",
          ...hb(-1),
        },
        chev("M6 9l6 6 6-6"),
      ),
      E("div", {
        className: "ma",
        ref: maEl,
      }),
    ),
    rels.map((x, j) =>
      E(
        "button",
        {
          key: x.id,
          ref: (q) => {
            chips.current[j] = q;
          },
          className: `fp-edge ${x.role}`,
          style: {
            "--c": x.color,
          },
          title: `${x.role === "anc" ? "Ancestor" : "Descendant"} ${x.name}`,
          "aria-label": `${x.role === "anc" ? "Ancestor" : "Descendant"} ${x.name}`,
          onClick: () => {
            let el = chips.current[j];
            el && el._st === "pin" ? onJump(x.id) : FP_STATE.api && FP_STATE.api.turn(x.id);
          },
          onDoubleClick: () => onJump(x.id),
        },
        E(
          "svg",
          {
            className: "arr",
            width: 14,
            height: 14,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2.4,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            "aria-hidden": "true",
          },
          E("path", {
            d: "M4 12h15M13 6l6 6-6 6",
          }),
        ),
        E(
          "svg",
          {
            className: "dot",
            width: 14,
            height: 14,
            viewBox: "0 0 24 24",
            "aria-hidden": "true",
          },
          E("circle", {
            cx: 12,
            cy: 12,
            r: 5,
            fill: "currentColor",
          }),
        ),
        E("b", null, x.role === "anc" ? "Ancestor" : "Descendant"),
        E("i", null, x.name),
      ),
    ),
  );
}
