"use client";

import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

import {
  actorIndex,
  simulationActors,
  simulationRelationships
} from "./simulation-data";
import { OrbNode } from "./OrbNode";
import { RelationshipLine } from "./RelationshipLine";

type SimulationSceneProps = {
  selectedActorId: string | null;
  onSelectActor: (actorId: string) => void;
  onZoomDistanceChange: (distance: number) => void;
};

const orbitTarget = new Vector3(0, 0, 0);

function CameraTelemetry({ onZoomDistanceChange }: Pick<SimulationSceneProps, "onZoomDistanceChange">) {
  const { camera } = useThree();
  const lastDistanceRef = useRef<number>(camera.position.distanceTo(orbitTarget));

  useFrame(() => {
    const distance = camera.position.distanceTo(orbitTarget);

    if (Math.abs(lastDistanceRef.current - distance) > 0.05) {
      lastDistanceRef.current = distance;
      onZoomDistanceChange(Number(distance.toFixed(2)));
    }
  });

  return null;
}

function WorldShell() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[5.2, 72, 72]} />
        <meshStandardMaterial
          color="#10345a"
          emissive="#3fb7ff"
          emissiveIntensity={0.62}
          metalness={0.12}
          roughness={0.62}
          transparent
          opacity={0.76}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 8, 0]}>
        <sphereGeometry args={[5.36, 36, 36]} />
        <meshBasicMaterial color="#89ebff" transparent opacity={0.18} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[5.62, 48, 48]} />
        <meshBasicMaterial color="#6dd7ff" transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0, Math.PI / 8]}>
        <torusGeometry args={[5.98, 0.03, 16, 180]} />
        <meshBasicMaterial color="#68d8ff" transparent opacity={0.32} />
      </mesh>
      <mesh rotation={[Math.PI / 1.85, 0, -Math.PI / 6]}>
        <torusGeometry args={[6.32, 0.025, 16, 180]} />
        <meshBasicMaterial color="#ffb97b" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

export function SimulationScene({
  selectedActorId,
  onSelectActor,
  onZoomDistanceChange
}: SimulationSceneProps) {
  return (
    <>
      <color attach="background" args={["#050b16"]} />
      <fog attach="fog" args={["#050b16", 22, 56]} />
      <ambientLight intensity={0.34} />
      <hemisphereLight args={["#9be8ff", "#041120", 0.42]} />
      <directionalLight position={[10, 10, 7]} intensity={1.1} color="#d9f7ff" />
      <pointLight position={[-12, 6, -8]} intensity={9} color="#5fd2ff" />
      <pointLight position={[10, -2, 10]} intensity={6} color="#ffb286" />
      <Stars radius={86} depth={26} count={5200} factor={4.8} saturation={0} fade speed={0.7} />
      <Sparkles count={80} scale={[18, 12, 18]} size={6} speed={0.2} color="#8de8ff" />
      <WorldShell />
      <CameraTelemetry onZoomDistanceChange={onZoomDistanceChange} />

      {simulationRelationships.map((relationship) => {
        const sourceActor = actorIndex[relationship.sourceId];
        const targetActor = actorIndex[relationship.targetId];

        if (!sourceActor || !targetActor) {
          return null;
        }

        return (
          <RelationshipLine
            key={relationship.id}
            relationship={relationship}
            start={sourceActor.position}
            end={targetActor.position}
            isHighlighted={
              relationship.sourceId === selectedActorId ||
              relationship.targetId === selectedActorId
            }
          />
        );
      })}

      {simulationActors.map((actor) => (
        <OrbNode
          key={actor.id}
          actor={actor}
          isSelected={actor.id === selectedActorId}
          onSelect={onSelectActor}
        />
      ))}

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        dampingFactor={0.08}
        minDistance={9.5}
        maxDistance={34}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI * 0.9}
      />
    </>
  );
}