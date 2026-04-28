"use client";

import { OrbitControls, Stars } from "@react-three/drei";

import {
  actorIndex,
  simulationActors,
  simulationRelationships
} from "./simulation-data";
import { OrbNode } from "./OrbNode";
import { RelationshipLine } from "./RelationshipLine";

type SimulationSceneProps = {
  selectedActorId: string;
  onSelectActor: (actorId: string) => void;
};

export function SimulationScene({
  selectedActorId,
  onSelectActor
}: SimulationSceneProps) {
  return (
    <>
      <color attach="background" args={["#050b16"]} />
      <fog attach="fog" args={["#050b16", 14, 30]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 10, 6]} intensity={1.8} color="#bfe8ff" />
      <pointLight position={[-12, 6, -8]} intensity={48} color="#5fd2ff" />
      <pointLight position={[10, -2, 10]} intensity={26} color="#ffb286" />
      <gridHelper args={[34, 34, "#12374a", "#0a2030"]} position={[0, -5.5, 0]} />
      <Stars radius={80} depth={24} count={4200} factor={4} saturation={0} fade speed={0.65} />

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
        minDistance={5.2}
        maxDistance={18}
        target={[0, 0.4, 0]}
        maxPolarAngle={Math.PI * 0.9}
      />
    </>
  );
}