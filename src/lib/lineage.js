import { MathUtils, Vector3 } from "three";
import { ROOT_POS, SPECIES, SPECIES_BY_ID } from "../data/species.js";
import { maToY } from "./time.js";
export const ROOT_NODE = {
  id: "root",
  genus: "Last common",
  sp: "ancestor",
  clade: "root",
  start: ROOT_POS.start,
  end: ROOT_POS.start,
  x: ROOT_POS.x,
  z: ROOT_POS.z,
  note: "The shared ancestor of chimpanzees and hominins. No fossil of it has been identified yet; its age is estimated from the genetic split between our lineages.",
  place: "Africa (probably)",
  src: [],
};
export const FP_STATE = {
  drag: 0,
  marks: [],
  api: null,
  W: 0,
  H: 0,
  chain: null,
  u: 0.5,
  vr: null,
};
export const fpParent = (id) => {
  if (!id || id === "root") return null;
  let s = SPECIES_BY_ID[id];
  return !s || !s.parent || s.parent === "root" ? "root" : s.parent;
};
export const fpKids = (id) =>
  SPECIES.filter(
    (x) =>
      (id === "root" ? !x.parent || x.parent === "root" : x.parent === id) &&
      (!FP_STATE.chain || FP_STATE.chain.has(x.id)),
  ).map((x) => x.id);
export const fpEye = (id, t) => {
  if (id === "root") return new Vector3(ROOT_POS.x, maToY(ROOT_POS.start), ROOT_POS.z);
  let s = SPECIES_BY_ID[id],
    a = Math.max(s.end, t);
  return new Vector3(s.x, (maToY(s.start) + maToY(a)) / 2, s.z);
};
export const fpRole = (fp, id) =>
  !fp ? null : id === fp ? "self" : fpParent(fp) === id ? "anc" : fpKids(fp).includes(id) ? "desc" : null;
export const fpLook = (id, y) => {
  if (id === "root") return new Vector3(ROOT_POS.x, maToY(ROOT_POS.start), ROOT_POS.z);
  let s = SPECIES_BY_ID[id];
  return new Vector3(s.x, MathUtils.clamp(y, maToY(s.start), maToY(Math.max(s.end, 0))), s.z);
};
export const fpName = (s) => (s.id === "root" ? "Last common ancestor" : `${s.genus[0]}. ${s.sp}`);
export const ANC_CHAIN = (() => {
  let c = new Set(["root"]),
    i = "sapiens";
  while (i && i !== "root") {
    c.add(i);
    i = fpParent(i);
  }
  return c;
})();
export const fpSp = (id) => (id === "root" ? ROOT_NODE : SPECIES_BY_ID[id]);
export const fpRels = (id) => {
  let x = [],
    p = fpParent(id);
  p &&
    x.push({
      id: p,
      role: "anc",
    });
  fpKids(id).forEach((k) =>
    x.push({
      id: k,
      role: "desc",
    }),
  );
  return x;
};
export const fpAng = (d) => {
  d = (d + Math.PI) % (2 * Math.PI);
  return (d < 0 ? d + 2 * Math.PI : d) - Math.PI;
};
export const fpBar = (id, t) => {
  if (id === "root") {
    let y = maToY(ROOT_POS.start);
    return [y, y];
  }
  let s = SPECIES_BY_ID[id],
    b = maToY(s.start);
  return [b, Math.max(b, maToY(Math.max(s.end, t)))];
};
export const fpRange = (id, t) => {
  let b = fpBar(id, t),
    sp = b[1] - b[0],
    pad = Math.max(0, (1.4 - sp) / 2);
  return {
    lo: b[0] - pad,
    hi: b[1] + pad,
    b0: b[0],
    b1: b[1],
  };
};
export const fpHeading = (eye, id, asp, fov, ay, from) => {
  let rs = fpRels(id);
  from && rs.length > 1 && (rs = rs.filter((r) => r.id !== from));
  let v = [];
  rs.forEach((r) => {
    let t = fpLook(r.id, ay),
      dx = t.x - eye.x,
      dz = t.z - eye.z,
      h = Math.hypot(dx, dz);
    h > 0.01 &&
      v.push({
        a: Math.atan2(-dx, -dz),
        e: Math.atan2(t.y - eye.y, h),
      });
  });
  if (!v.length) return null;
  let half = Math.atan(Math.tan((fov * Math.PI) / 360) * Math.max(asp, 0.3)) * 0.85,
    best = null;
  for (let i = 0; i < 72; i++) {
    let th = (i / 72) * 2 * Math.PI - Math.PI,
      n = 0,
      c = 0;
    v.forEach((r) => {
      let d = Math.abs(fpAng(th - r.a));
      d <= half && n++;
      c += Math.cos(d);
    });
    (!best || n > best.n || (n === best.n && c > best.c)) &&
      (best = {
        th,
        n,
        c,
      });
  }
  let m = v.filter((r) => Math.abs(fpAng(best.th - r.a)) <= half);
  if (!m.length)
    return {
      yaw: best.th,
      pitch: 0,
    };
  let ds = m.map((r) => fpAng(r.a - best.th)),
    mid = (Math.min(...ds) + Math.max(...ds)) / 2;
  return {
    yaw: best.th + mid,
    pitch: MathUtils.clamp(m.reduce((s, r) => s + r.e, 0) / m.length, -0.6, 0.6),
  };
};
