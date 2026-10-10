import { Html } from "@react-three/drei";
import { MathUtils } from "three";
import { CLADES } from "../data/species.js";
import { FP_STATE, fpEye, fpRole } from "../lib/lineage.js";
import { maToY } from "../lib/time.js";
export function SpeciesColumn({ species, time, selected, dimmed, onSelect, fp, onFp, ancm, hideLabels }) {
  let endMa = Math.max(species.end, time),
    hasStarted = time <= species.start,
    color = CLADES[species.clade].color,
    role = fpRole(fp, species.id),
    rel = role === "anc" || role === "desc",
    emph = !!ancm,
    radius = species.id === "pan" ? 0.17 : selected || rel || emph ? 0.22 : 0.15,
    showLabel =
      !hideLabels &&
      !fp &&
      hasStarted &&
      time <= species.start - Math.min(0.15, (species.start - species.end) * 0.6 || 0.15) &&
      role !== "self",
    act = !fp || rel,
    clk = (p) => {
      p.stopPropagation();
      if (fp) {
        FP_STATE.drag < 6 && rel && onFp(species.id);
        return;
      }
      onSelect(species.id);
    },
    dbl = (p) => {
      p.stopPropagation();
      (!fp || rel) && onFp(species.id);
    },
    ov = (p) => {
      p.stopPropagation();
      act && (document.body.style.cursor = "pointer");
    },
    ou = () => (document.body.style.cursor = "");
  return hasStarted ? (
    <group>
      <mesh
        visible={role !== "self"}
        position={[species.x, (maToY(species.start) + maToY(endMa)) / 2, species.z]}
        onClick={clk}
        onDoubleClick={dbl}
        onPointerOver={ov}
        onPointerOut={ou}
      >
        <cylinderGeometry args={[radius, radius, Math.max(maToY(endMa) - maToY(species.start), 0.02), 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected || rel ? 0.55 : emph ? 0.4 : 0.18}
          roughness={0.45}
          transparent
          opacity={dimmed ? (fp ? 0.3 : 0.18) : 1}
        />
      </mesh>
      {time > species.end && role !== "self" && (
        <mesh
          position={[species.x, maToY(endMa), species.z]}
          onClick={clk}
          onDoubleClick={dbl}
          onPointerOver={ov}
          onPointerOut={ou}
        >
          <sphereGeometry args={[radius * 1.7, 20, 20]} />
          <meshBasicMaterial color="#fff7ea" transparent opacity={dimmed ? 0.2 : 0.95} />
        </mesh>
      )}
      {showLabel && !(fp && rel) && (
        <Html
          pointerEvents="none"
          style={{
            pointerEvents: "none",
          }}
          position={[
            species.x + (species.side === "l" ? -(radius + 0.08) : radius + 0.08),
            rel
              ? MathUtils.clamp(fpEye(fp, time).y, maToY(species.start), maToY(endMa))
              : species.id === "pan"
                ? maToY(endMa) - 0.2
                : species.labelAt != null
                  ? maToY(species.labelAt)
                  : maToY((species.start + endMa) / 2),
            species.z,
          ]}
          zIndexRange={selected || rel ? [30, 25] : [20, 10]}
        >
          <button
            data-p={selected ? 9999 : species.pri}
            className={`tag ${species.side === "l" ? "l" : ""} ${selected || rel || emph ? "on" : ""} ${dimmed ? "dim" : ""} ${rel ? "rel" : ""}`}
            style={{
              "--c": color,
              pointerEvents: dimmed ? "none" : "auto",
            }}
            onClick={clk}
            onDoubleClick={dbl}
            title={
              fp
                ? rel
                  ? "Click to jump here"
                  : ""
                : "Click for details · double-click for first-person view"
            }
          >
            {rel && <span className="role">{role === "anc" ? "Ancestor" : "Descendant"}</span>}
            <i>{`${species.genus[0]}. ${species.sp}`}</i>
          </button>
        </Html>
      )}
    </group>
  ) : null;
}
