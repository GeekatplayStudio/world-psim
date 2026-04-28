"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { Color, Vector3 } from "three";

import { getActorRadius } from "./simulation-data";
import type { SimulationActor } from "./simulation-types";

type DetailBand = "far" | "mid" | "near";

type OrbNodeProps = {
  actor: SimulationActor;
  isSelected: boolean;
  isContextHighlighted: boolean;
  showLabels: boolean;
  onHoverChange: (actorId: string | null) => void;
  onSelect: (actorId: string) => void;
};

const nextScale = new Vector3(1, 1, 1);
const conflictHotColor = new Color("#ff2350");
const conflictHotAccent = new Color("#ffc4d0");

export function OrbNode({
  actor,
  isSelected,
  isContextHighlighted,
  showLabels,
  onHoverChange,
  onSelect
}: OrbNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const auraRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const [detailBand, setDetailBand] = useState<DetailBand>("far");
  const radius = getActorRadius(actor);
  const displayColor = new Color(actor.color).lerp(conflictHotColor, actor.conflictNormalized * 0.52);
  const displayAccent = new Color(actor.accent).lerp(conflictHotAccent, actor.conflictNormalized * 0.46);

  useFrame((_, delta) => {
    if (!meshRef.current || !auraRef.current) {
      return;
    }

    const distance = camera.position.distanceTo(meshRef.current.position);
    const nextBand = distance < 9.5 ? "near" : distance < 15.5 ? "mid" : "far";

    setDetailBand((currentBand) => (currentBand === nextBand ? currentBand : nextBand));

    const targetScale = isSelected ? 1.16 : isContextHighlighted ? 1.1 : isHovered ? 1.06 : 1;

    nextScale.setScalar(targetScale);
    meshRef.current.scale.lerp(nextScale, 1 - Math.exp(-delta * 8));
    auraRef.current.scale.lerp(nextScale.multiplyScalar(1.18), 1 - Math.exp(-delta * 7));
  });

  const showLabel = showLabels || isSelected || isContextHighlighted || isHovered || detailBand === "near";
  const ambientGlow = 0.08 + actor.conflictNormalized * 0.24;
  const auraOpacity = isSelected
    ? 0.3
    : isContextHighlighted
      ? 0.22 + actor.conflictNormalized * 0.14
      : isHovered
        ? 0.16
        : 0.05 + actor.conflictNormalized * 0.08;

  return (
    <group position={actor.position}>
      <mesh ref={auraRef}>
        <sphereGeometry args={[radius * 1.18, 22, 22]} />
        <meshBasicMaterial
          color={displayAccent}
          transparent
          opacity={auraOpacity}
        />
      </mesh>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect(actor.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setIsHovered(true);
          onHoverChange(actor.id);
        }}
        onPointerOut={() => {
          setIsHovered(false);
          onHoverChange(null);
        }}
      >
        <sphereGeometry args={[radius, 36, 36]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={displayAccent}
          emissiveIntensity={
            isSelected
              ? 1.18
              : isContextHighlighted
                ? 0.82 + ambientGlow
                : isHovered
                  ? 0.56
                  : 0.18 + ambientGlow
          }
          metalness={0.08}
          roughness={isContextHighlighted ? 0.46 : 0.52}
        />
      </mesh>

      {showLabel ? (
        <Html
          position={[radius + 0.45, Math.max(0.12, radius * 0.18), 0]}
          transform
          occlude
          distanceFactor={10}
          style={{ pointerEvents: "none" }}
        >
          <div className="rounded-full border border-white/10 bg-slate-950/90 px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-slate-100 shadow-panel backdrop-blur">
            {actor.label}
          </div>
        </Html>
      ) : null}

    </group>
  );
}