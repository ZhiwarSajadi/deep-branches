import { Html, Sparkles } from "@react-three/drei";
import { ANC_CHAIN, FP_STATE, fpRole } from "../lib/lineage.js";
import { Strata } from "./Strata.jsx";
import { ROOT_POS, SPECIES } from "../data/species.js";
import { maToY } from "../lib/time.js";
import { Branch } from "./Branch.jsx";
import { SpeciesColumn } from "./SpeciesColumn.jsx";
import { NowPlane } from "./NowPlane.jsx";
import { CameraRig } from "./CameraRig.jsx";
export function Scene({
  time,
  selected,
  setSelected,
  hidden: hiddenClades,
  follow,
  autoRotate,
  fp,
  onFp,
  ancm,
  hideLabels,
  cardMinimized,
}) {
  let rootRole = fpRole(fp, "root"),
    rootRel = rootRole === "anc" || rootRole === "desc",
    rootDim = fp && !rootRel && rootRole !== "self",
    rootClk = (p) => {
      p.stopPropagation();
      if (fp) {
        FP_STATE.drag < 6 && rootRel && onFp("root");
        return;
      }
      setSelected("root");
    },
    rootDbl = (p) => {
      p.stopPropagation();
      (!fp || rootRel) && onFp("root");
    },
    dimOf = (a) => (fp ? fpRole(fp, a.id) === null : !ancm && hiddenClades.has(a.clade));
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 10, 8]} intensity={1.6} />
      <directionalLight position={[-8, -4, -6]} intensity={0.5} color="#e8d2bd" />
      <group
        onPointerMissed={() => {
          fp || setSelected(null);
        }}
      >
        <Strata />
        <mesh
          position={[ROOT_POS.x, maToY(ROOT_POS.start), ROOT_POS.z]}
          onClick={rootClk}
          onDoubleClick={rootDbl}
          onPointerOver={(p) => {
            (p.stopPropagation(), (!fp || rootRel) && (document.body.style.cursor = "pointer"));
          }}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <sphereGeometry args={[selected === "root" || rootRel ? 0.3 : 0.22, 24, 24]} />
          <meshStandardMaterial
            color="#2a2522"
            emissive="#2a2522"
            emissiveIntensity={selected === "root" || rootRel ? 0.6 : 0}
            transparent
            opacity={rootDim ? 0.25 : 1}
          />
          {rootRole !== "self" && !(fp && rootRel) && !hideLabels && (
            <Html
              pointerEvents="none"
              style={{
                pointerEvents: "none",
              }}
              position={[0.3, -0.05, 0]}
              zIndexRange={[20, 10]}
            >
              <button
                className={`tag root ${selected === "root" || rootRel ? "on" : ""} ${rootDim ? "dim" : ""} ${rootRel ? "rel" : ""}`}
                data-p="-1"
                style={{
                  pointerEvents: rootDim ? "none" : "auto",
                }}
                onClick={rootClk}
                onDoubleClick={rootDbl}
                title={
                  fp
                    ? rootRel
                      ? "Click to jump here"
                      : ""
                    : "Click for details · double-click for first-person view"
                }
              >
                {rootRel && <span className="role">Ancestor</span>}Last common ancestor
              </button>
            </Html>
          )}
        </mesh>
        {SPECIES.filter((a) => !ancm || ANC_CHAIN.has(a.id)).map((a) => (
          <group key={a.id}>
            {a.id !== "pan" && (
              <Branch
                species={a}
                time={time}
                dimmed={!ancm && hiddenClades.has(a.clade)}
                fp={fp}
                emph={ancm}
              />
            )}
            {a.id === "pan" && (
              <Branch
                species={{
                  ...a,
                  parent: "root",
                }}
                time={time}
                dimmed={hiddenClades.has("pan")}
                fp={fp}
              />
            )}
            <SpeciesColumn
              species={a}
              time={time}
              selected={selected === a.id}
              dimmed={dimOf(a)}
              onSelect={setSelected}
              fp={fp}
              onFp={onFp}
              ancm={ancm}
              hideLabels={hideLabels}
            />
          </group>
        ))}
        <NowPlane time={time} />
      </group>
      <Sparkles count={80} scale={[30, 21, 16]} size={2.2} speed={0.25} opacity={0.5} color="#fff6e6" />
      <CameraRig time={time} follow={follow && !fp} cardOpen={!!selected && !cardMinimized} autoRotate={autoRotate} fp={fp} />
    </>
  );
}
