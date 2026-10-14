import { DoubleSide } from "three";
import { Edges, Html, Line } from "@react-three/drei";
import { maToY } from "../lib/time.js";
export function Strata() {
  return (
    <group>
      {["#b9ab9c", "#a99886", "#c4b6a4", "#9f8f80", "#bfae99", "#ae9d8d", "#c8bcae", "#b3a493"].map(
        (e, t) => (
          <mesh position={[0, (maToY(t) + maToY(t + 1)) / 2, 0.2]} key={t}>
            <boxGeometry args={[30, maToY(t) - maToY(t + 1), 16]} />
            <meshStandardMaterial
              color={e}
              transparent
              opacity={0.075}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>
        ),
      )}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[30, 21, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges color="#6f6158" />
      </mesh>
      {Array.from(
        {
          length: 9,
        },
        (e, t) => (
          <group key={t}>
            <Line
              points={[
                [-15, maToY(t), 8.2],
                [15, maToY(t), 8.2],
                [15, maToY(t), -7.8],
                [-15, maToY(t), -7.8],
                [-15, maToY(t), 8.2],
              ]}
              color="#6f6158"
              lineWidth={0.6}
              transparent
              opacity={0.25}
            />
            <Html
              pointerEvents="none"
              style={{
                pointerEvents: "none",
              }}
              position={[t === 0 ? 15.3 : -15.3, maToY(t), 8.2]}
              center
              zIndexRange={[5, 0]}
            >
              <span className="tick">{t === 0 ? "Today" : `${t} Ma`}</span>
            </Html>
          </group>
        ),
      )}
    </group>
  );
}
