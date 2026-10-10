import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide } from "three";
import { Line } from "@react-three/drei";
import { maToY } from "../lib/time.js";
export function NowPlane({ time }) {
  let glowRef = useRef(),
    top = time <= 0.004;

  useFrame(({ clock: t }) => {
    if (glowRef.current) {
      glowRef.current.material.opacity = top ? 0.1 : 0.1 + Math.sin(t.elapsedTime * 2) * 0.03;
    }
  });

  return (
    <group position={[0, maToY(time) + 0.012, 0.2]} renderOrder={10}>
        <mesh ref={glowRef} renderOrder={10} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[22, 12]} />
          <meshBasicMaterial
            color="#fff4e2"
            transparent
            opacity={0.1}
            depthWrite={false}
            side={DoubleSide}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
        <Line
          points={[
            [-11, 0, -6],
            [11, 0, -6],
            [11, 0, 6],
            [-11, 0, 6],
            [-11, 0, -6],
          ]}
          color="#fffaf2"
          lineWidth={2}
          renderOrder={11}
        />
      </group>
  );
}
