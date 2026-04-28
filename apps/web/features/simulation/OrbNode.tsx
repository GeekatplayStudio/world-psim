"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { Vector3 } from "three";

import { getActorRadius } from "./simulation-data";
import type { SimulationActor } from "./simulation-types";

type DetailBand = "far" | "mid" | "near";

type OrbNodeProps = {
  actor: SimulationActor;
  isSelected: boolean;
  onSelect: (actorId: string) => void;
};

const nextScale = new Vector3(1, 1, 1);

export function OrbNode({ actor, isSelected, onSelect }: OrbNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const auraRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const [detailBand, setDetailBand] = useState<DetailBand>("far");
  const radius = getActorRadius(actor);

  useFrame((_, delta) => {
    if (!meshRef.current || !auraRef.current) {
      return;
    }

    const distance = camera.position.distanceTo(meshRef.current.position);
    const nextBand = distance < 6 ? "near" : distance < 10 ? "mid" : "far";

    setDetailBand((currentBand) => (currentBand === nextBand ? currentBand : nextBand));

    const targetScale = isSelected ? 1.14 : isHovered ? 1.06 : 1;

    nextScale.setScalar(targetScale);
    meshRef.current.scale.lerp(nextScale, 1 - Math.exp(-delta * 8));
    auraRef.current.scale.lerp(nextScale.multiplyScalar(1.18), 1 - Math.exp(-delta * 7));

    meshRef.current.rotation.y += delta * 0.18;
    auraRef.current.rotation.y -= delta * 0.1;
  });

  const showLabel = isSelected || detailBand !== "far";
  const showStats = isSelected || detailBand === "near";

  return (
    <group position={actor.position}>
      <mesh ref={auraRef}>
        <sphereGeometry args={[radius * 1.08, 32, 32]} />
        <meshBasicMaterial
          color={actor.accent}
          transparent
          opacity={isSelected ? 0.14 : isHovered ? 0.09 : 0.04}
          wireframe
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
        }}
        onPointerOut={() => {
          setIsHovered(false);
        }}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={actor.color}
          emissive={actor.accent}
          emissiveIntensity={isSelected ? 1.4 : isHovered ? 1.05 : 0.7}
          metalness={0.3}
          roughness={0.24}
        />
      </mesh>

      {showLabel ? (
        <Html position={[0, radius + 0.8, 0]} center>
          <div className="rounded-full border border-white/10 bg-slate-950/85 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-100 shadow-panel backdrop-blur">
            {actor.label}
          </div>
        </Html>
      ) : null}

      {showStats ? (
        <Html position={[radius + 0.9, 0.2, 0]} transform occlude>
          <div className="w-44 rounded-2xl border border-white/10 bg-slate-950/88 p-3 text-xs text-slate-100 shadow-panel backdrop-blur">
            <p className="font-semibold uppercase tracking-[0.24em] text-cyan-100">
              {actor.region}
            </p>
            <div className="mt-2 space-y-1 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Composite</span>
                <span>{actor.metrics.compositePower}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Military</span>
                <span>{actor.metrics.military}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Diplomatic</span>
                <span>{actor.metrics.diplomatic}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Instability</span>
                <span>{actor.metrics.instability}</span>
              </div>
            </div>
          </div>
        </Html>
      ) : null}
    </group>
  );
}