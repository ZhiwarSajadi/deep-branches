import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";
import { FP_STATE, fpAng, fpBar, fpHeading, fpLook, fpRange, fpRels, fpSp } from "../lib/lineage.js";
import { PREFERS_REDUCED_MOTION } from "../lib/motion.js";
import { maToY } from "../lib/time.js";
export function CameraRig({ time, follow, cardOpen, autoRotate, fp }) {
  let r = useRef(),
    i = useRef(null),
    { camera: a, size: s, gl } = useThree(),
    u = s.width > 760,
    st = useRef({
      yaw: 0,
      pitch: 0,
      cy: 0,
      cp: 0,
      fov: 70,
      saved: null,
      ret: 0,
      eye: new Vector3(),
      anchor: 0,
      u: 0.5,
      hold: 0,
      vy: 0,
      vp: 0,
      rate: 6,
      down: false,
      last: null,
      keys: {},
      rels: [],
      q: new Quaternion(),
      eu: new Euler(),
      m: new Matrix4(),
      v: new Vector3(),
      p: new Vector3(),
    }).current,
    live = useRef({}).current;
  live.s = s;
  live.n = time;
  useEffect(() => {
    if (st.active || st.ret) return;
    let d = s.width / s.height;
    a.position.setLength(u ? 44 : Math.min(85, 12.6 / (Math.tan((19 * Math.PI) / 180) * d)));
    return () => a.clearViewOffset();
  }, [s, a, u]);
  useEffect(() => {
    if (fp) {
      if (!st.saved) st.saved = a.position.clone();
      st.ret = 0;
      st.active = true;
      let from = st.last && st.last !== fp ? st.last : null;
      st.last = fp;
      if (!from) st.fov = 70;
      let sp = fpSp(fp),
        rg0 = fpRange(fp, time);
      st.u = 1;
      st.anchor = rg0.hi;
      st.eye.set(sp.x, st.anchor, sp.z);
      st.rels = fpRels(fp);
      FP_STATE.marks = st.rels.map((x) => ({
        id: x.id,
        px: 0,
        py: 0,
        dx: 0,
        dy: 0,
        behind: false,
      }));
      st.vy = st.vp = 0;
      st.rate = 6;
      st.eu.setFromQuaternion(a.quaternion, "YXZ");
      st.cy = st.eu.y;
      st.cp = MathUtils.clamp(st.eu.x, -1.5, 1.5);
      let h = fpHeading(st.eye, fp, s.width / s.height, st.fov, st.anchor, from);
      if (h) {
        st.yaw = st.cy + fpAng(h.yaw - st.cy);
        st.pitch = h.pitch;
      } else {
        st.yaw = st.cy + fpAng(Math.atan2(st.eye.x, st.eye.z) - st.cy);
        st.pitch = 0;
      }
    } else if (st.active) {
      st.active = false;
      st.ret = 1;
      st.last = null;
      st.keys = {};
      FP_STATE.marks = [];
    }
  }, [fp]);
  useEffect(() => {
    if (!fp) return;
    let el = gl.domElement,
      ptrs = new Map(),
      pinch = 0,
      lastT = 0;
    el.style.cursor = "grab";
    el.style.touchAction = "none";
    let face = (id) => {
        let tg = fpLook(id, st.eye.y),
          dx = tg.x - st.eye.x,
          dz = tg.z - st.eye.z,
          dy = tg.y - st.eye.y,
          h = Math.hypot(dx, dz);
        if (h + Math.abs(dy) < 0.001) return;
        st.yaw += fpAng(Math.atan2(-dx, -dz) - st.yaw);
        st.pitch = MathUtils.clamp(Math.atan2(dy, h), -1.2, 1.2);
        st.rate = 6;
        st.vy = st.vp = 0;
      },
      recenter = () => {
        let z = live.s,
          h = fpHeading(st.eye, fp, z.width / z.height, st.fov, st.eye.y, null);
        if (h) {
          st.yaw += fpAng(h.yaw - st.yaw);
          st.pitch = h.pitch;
          st.rate = 6;
          st.vy = st.vp = 0;
        }
      };
    FP_STATE.api = {
      turn: face,
      recenter,
      hold: (d) => {
        st.hold = d;
      },
      setU: (u) => {
        st.u = MathUtils.clamp(u, 0, 1);
      },
    };
    let radPx = () => ((st.fov * Math.PI) / 180 / Math.max(el.clientHeight, 1)) * 2.2,
      pd = (v) => {
        if (v.pointerType === "mouse" && v.button !== 0) return;
        ptrs.set(v.pointerId, {
          x: v.clientX,
          y: v.clientY,
        });
        st.down = true;
        if (ptrs.size === 1) {
          FP_STATE.drag = 0;
          el.style.cursor = "grabbing";
          st.vy = st.vp = 0;
          st.rate = 24;
          lastT = performance.now();
        } else {
          let [p1, p2] = [...ptrs.values()];
          pinch = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          FP_STATE.drag += 99;
          st.vy = st.vp = 0;
        }
      },
      pm = (v) => {
        let p = ptrs.get(v.pointerId);
        if (!p) return;
        let dx = v.clientX - p.x,
          dy = v.clientY - p.y;
        p.x = v.clientX;
        p.y = v.clientY;
        if (ptrs.size >= 2) {
          let [p1, p2] = [...ptrs.values()],
            d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          d > 0 && pinch > 0 && (st.fov = MathUtils.clamp((st.fov * pinch) / d, 25, 95));
          pinch = d;
          FP_STATE.drag += 99;
          return;
        }
        FP_STATE.drag += Math.abs(dx) + Math.abs(dy);
        let now = performance.now(),
          dt = Math.max((now - lastT) / 1e3, 0.008),
          k = radPx(),
          ay = dx * k,
          ap = dy * k;
        lastT = now;
        st.rate = 24;
        st.yaw += ay;
        st.pitch = MathUtils.clamp(st.pitch + ap, -1.5, 1.5);
        st.vy = st.vy * 0.6 + (ay / dt) * 0.4;
        st.vp = st.vp * 0.6 + (ap / dt) * 0.4;
      },
      pu = (v) => {
        if (!ptrs.delete(v.pointerId)) return;
        ptrs.size < 2 && (pinch = 0);
        if (!ptrs.size) {
          st.down = false;
          el.style.cursor = "grab";
          (PREFERS_REDUCED_MOTION || performance.now() - lastT > 90) && (st.vy = st.vp = 0);
        } else st.vy = st.vp = 0;
      },
      wh = (v) => {
        v.preventDefault();
        let m = v.deltaMode === 1 ? 33 : v.deltaMode === 2 ? 400 : 1,
          dy = v.deltaY * m;
        if (v.shiftKey) {
          let d = Math.abs(v.deltaY) >= Math.abs(v.deltaX) ? dy : v.deltaX * m;
          st.u = MathUtils.clamp(st.u - d * 0.0012, 0, 1);
          return;
        }
        st.fov = MathUtils.clamp(st.fov + dy * (v.ctrlKey ? 0.12 : 0.04), 25, 95);
      },
      KEYS = {
        ArrowLeft: 1,
        ArrowRight: 1,
        ArrowUp: 1,
        ArrowDown: 1,
        KeyA: 1,
        KeyD: 1,
        KeyW: 1,
        KeyS: 1,
        PageUp: 1,
        PageDown: 1,
        KeyQ: 1,
        KeyE: 1,
      },
      kd = (v) => {
        if (v.ctrlKey || v.metaKey || v.altKey) return;
        let tg = v.target;
        if (tg && tg.tagName === "INPUT") return;
        if (KEYS[v.code]) {
          v.preventDefault();
          st.keys[v.code] = 1;
          return;
        }
        if (v.code === "KeyR" || v.code === "Home") {
          v.preventDefault();
          recenter();
          return;
        }
        if (v.code === "Equal" || v.code === "NumpadAdd") st.fov = MathUtils.clamp(st.fov - 6, 25, 95);
        else if (v.code === "Minus" || v.code === "NumpadSubtract")
          st.fov = MathUtils.clamp(st.fov + 6, 25, 95);
      },
      ku = (v) => {
        delete st.keys[v.code];
      },
      bl = () => {
        st.keys = {};
      };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    window.addEventListener("pointercancel", pu);
    el.addEventListener("wheel", wh, {
      passive: false,
    });
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", bl);
    return () => {
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("pointercancel", pu);
      el.removeEventListener("wheel", wh);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", bl);
      el.style.cursor = "";
      st.down = false;
      st.keys = {};
      st.hold = 0;
      FP_STATE.vr = null;
      FP_STATE.api = null;
    };
  }, [fp, gl]);
  useFrame((state, delta) => {
    let d = r.current;
    if (!d) return;
    let dt = Math.min(delta, 0.5),
      di = Math.min(delta, 0.05),
      now = performance.now();
    st.lc !== cardOpen && ((st.lc = cardOpen), (st.lt = now));
    let open = now - (st.lt || 0) > 380 ? cardOpen : !cardOpen,
      f = u ? (open ? s.width * 0.08 : -s.width * 0.08) : 0;
    i.current = i.current === null ? f : i.current + (f - i.current) * (1 - Math.exp(-dt * 5));
    a.setViewOffset(s.width, s.height, i.current, u ? -s.height * 0.02 : s.height * 0.08, s.width, s.height);
    if (fp) {
      d.enabled = false;
      let K = st.keys,
        ky = (K.ArrowLeft || K.KeyA ? 1 : 0) - (K.ArrowRight || K.KeyD ? 1 : 0),
        kp = (K.ArrowUp ? 1 : 0) - (K.ArrowDown ? 1 : 0),
        kw = MathUtils.clamp(
          (K.KeyW || K.PageUp || K.KeyE ? 1 : 0) - (K.KeyS || K.PageDown || K.KeyQ ? 1 : 0) + (st.hold || 0),
          -1,
          1,
        ),
        zs = st.fov / 70;
      if (ky || kp) {
        st.yaw += ky * 1.7 * di * zs;
        st.pitch = MathUtils.clamp(st.pitch + kp * 1.2 * di * zs, -1.5, 1.5);
        st.rate = 14;
        st.vy = st.vp = 0;
      }
      if (!st.down && (Math.abs(st.vy) > 0.02 || Math.abs(st.vp) > 0.02)) {
        st.yaw += st.vy * di;
        st.pitch = MathUtils.clamp(st.pitch + st.vp * di, -1.5, 1.5);
        let dc = Math.exp(-dt * 3.5);
        st.vy *= dc;
        st.vp *= dc;
        st.rate = 24;
      }
      let sp = fpSp(fp),
        rg = fpRange(fp, time),
        spn = Math.max(rg.hi - rg.lo, 0.001);
      kw && (st.u = MathUtils.clamp(st.u + (kw * 2.4 * di) / spn, 0, 1));
      st.eye.set(sp.x, rg.lo + spn * st.u, sp.z);
      FP_STATE.u = st.u;
      FP_STATE.vr = rg;
      a.position.lerp(st.eye, PREFERS_REDUCED_MOTION ? 1 : 1 - Math.exp(-dt * 7.5));
      let kr = PREFERS_REDUCED_MOTION ? 1 : 1 - Math.exp(-dt * st.rate);
      st.cy += (st.yaw - st.cy) * kr;
      st.cp += (st.pitch - st.cp) * kr;
      a.quaternion.setFromEuler(st.eu.set(st.cp, st.cy, 0, "YXZ"));
      Math.abs(a.fov - st.fov) > 0.01 &&
        ((a.fov += (st.fov - a.fov) * (PREFERS_REDUCED_MOTION ? 1 : 1 - Math.exp(-dt * 7.7))),
        a.updateProjectionMatrix());
      a.updateMatrixWorld();
      FP_STATE.W = s.width;
      FP_STATE.H = s.height;
      let M = FP_STATE.marks,
        rl = st.rels;
      for (let j = 0; j < rl.length && j < M.length; j++) {
        let tg = fpLook(rl[j].id, a.position.y),
          k = M[j];
        st.v.copy(tg).applyMatrix4(a.matrixWorldInverse);
        k.behind = st.v.z > -0.05;
        k.dx = st.v.x;
        k.dy = -st.v.y;
        st.p.copy(tg).project(a);
        k.px = (st.p.x * 0.5 + 0.5) * s.width;
        k.py = (-st.p.y * 0.5 + 0.5) * s.height;
      }
      return;
    }
    if (st.ret) {
      d.enabled = false;
      let k1 = PREFERS_REDUCED_MOTION ? 1 : 1 - Math.exp(-dt * 5.7),
        k2 = PREFERS_REDUCED_MOTION ? 1 : 1 - Math.exp(-dt * 13.4),
        k3 = PREFERS_REDUCED_MOTION ? 1 : 1 - Math.exp(-dt * 7.7);
      a.position.lerp(st.saved, k1);
      st.m.lookAt(a.position, d.target, a.up);
      st.q.setFromRotationMatrix(st.m);
      a.quaternion.slerp(st.q, k2);
      a.fov += (38 - a.fov) * k3;
      a.updateProjectionMatrix();
      if (a.position.distanceTo(st.saved) < 0.04) {
        a.position.copy(st.saved);
        a.fov = 38;
        a.updateProjectionMatrix();
        st.ret = 0;
        st.saved = null;
        d.enabled = true;
        d.update();
      }
      return;
    }
    d.enabled = true;
    if (follow) {
      let h = MathUtils.clamp(maToY(time) * 0.35, -2, 1.4);
      d.target.y += (h - d.target.y) * 0.04;
    }
    d.update();
  });
  return (
    <OrbitControls
      ref={r}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      autoRotate={!cardOpen && autoRotate}
      autoRotateSpeed={0.5}
      minDistance={7}
      maxDistance={100}
      target={[0.2, -1.5, 0.2]}
      enablePan={false}
      camera={a}
    />
  );
}
