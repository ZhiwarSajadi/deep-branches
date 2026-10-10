import { useMemo } from "react";
import { QuadraticBezierCurve3, Vector3 } from "three";
import { Line } from "@react-three/drei";
import { CLADES, ROOT_POS, SPECIES_BY_ID } from "../data/species.js";
import { maToY } from "../lib/time.js";
import { fpParent } from "../lib/lineage.js";
export function Branch({ species, time, dimmed, fp, emph }) {
  let parent = species.parent === "root" ? null : SPECIES_BY_ID[species.parent],
    joinMa = parent ? Math.max(Math.min(species.start + 0.15, parent.start), parent.end) : ROOT_POS.start,
    curvePoints = useMemo(() => {
      let f = parent
          ? new Vector3(parent.x, maToY(joinMa), parent.z)
          : new Vector3(ROOT_POS.x, maToY(ROOT_POS.start), ROOT_POS.z),
        h = new Vector3(species.x, maToY(species.start), species.z),
        p = f.clone().lerp(h, 0.5);
      return (
        (p.y = f.y + (h.y - f.y) * 0.25),
        new QuadraticBezierCurve3(f, p, h).getPoints(28).map((g) => g.toArray())
      );
    }, [species, parent, joinMa]);
  if (time >= joinMa) return null;
  let hot = fp && (species.id === fp || fpParent(species.id) === fp),
    dim = fp ? !hot : dimmed;
  let span = Math.max(joinMa - species.start, 0.05),
    progress = Math.min(1, (joinMa - time) / span),
    pointCount = Math.max(2, Math.round(curvePoints.length * progress)),
    ds = !!species.dashed,
    lineWidth = fp ? (hot ? (ds ? 5 : 6) : ds ? 2.6 : 3.2) : emph ? (ds ? 3.4 : 4.8) : ds ? 2 : 3.2,
    op = fp ? (hot ? 1 : 0.42) : emph ? 1 : dim ? 0.12 : 0.9,
    dsz = fp ? (hot ? 0.34 : 0.26) : emph ? 0.24 : 0.18,
    gsz = fp ? (hot ? 0.2 : 0.16) : 0.14,
    pts = curvePoints.slice(0, pointCount),
    col = CLADES[species.clade].color,
    main = (
      <Line
        points={pts}
        color={col}
        lineWidth={lineWidth}
        dashed={ds}
        dashSize={dsz}
        gapSize={gsz}
        transparent
        opacity={op}
        {...(fp && hot
          ? {
              depthTest: false,
              renderOrder: 19,
            }
          : null)}
      />
    );
  return fp && hot ? (
    <>
      <Line
        points={pts}
        color="#2a2522"
        lineWidth={lineWidth + 3.6}
        dashed={ds}
        dashSize={dsz}
        gapSize={gsz}
        transparent
        opacity={0.34}
        depthTest={false}
        renderOrder={18}
      />
      {main}
    </>
  ) : (
    main
  );
}
