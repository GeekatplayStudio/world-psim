"use client";

import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { SRGBColorSpace, TextureLoader, Vector3 } from "three";

import {
  actorIndex,
  simulationActors,
  simulationRelationships
} from "./simulation-data";
import { mapPlaneDepth, mapPlaneWidth } from "./simulation-geo";
import { OrbNode } from "./OrbNode";
import { RelationshipLine } from "./RelationshipLine";
import { worldMapOverlayUri } from "./simulation-world-map";

type SimulationSceneProps = {
  selectedActorId: string | null;
  selectedRelationshipId: string | null;
  showLabels: boolean;
  onSelectActor: (actorId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
  onZoomDistanceChange: (distance: number) => void;
};

const orbitTarget = new Vector3(0, -0.8, 0);

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

function CameraFocusController({
  focusActorId,
  controlsRef
}: {
  focusActorId: string | null;
  controlsRef: React.MutableRefObject<{ target: Vector3; update: () => void } | null>;
}) {
  const { camera } = useThree();
  const focusTargetRef = useRef<Vector3 | null>(null);
  const focusCameraRef = useRef<Vector3 | null>(null);
  const lastFocusActorIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!focusActorId || !controlsRef.current) {
      return;
    }

    const actor = actorIndex[focusActorId];

    if (!actor || lastFocusActorIdRef.current === focusActorId) {
      return;
    }

    lastFocusActorIdRef.current = focusActorId;

    const controls = controlsRef.current;
    const desiredTarget = new Vector3(...actor.position);
    const currentOffset = camera.position.clone().sub(controls.target);
    const nextOffset = currentOffset.lengthSq() > 0 ? currentOffset.normalize() : new Vector3(0.12, 0.5, 0.86);
    const desiredDistance = actor.detailTier === "context" ? 11.4 : 9.8;

    nextOffset.multiplyScalar(desiredDistance);
    nextOffset.y = Math.max(4.4, nextOffset.y);

    focusTargetRef.current = desiredTarget;
    focusCameraRef.current = desiredTarget.clone().add(nextOffset);
  }, [camera, controlsRef, focusActorId]);

  useFrame((_, delta) => {
    if (!controlsRef.current || !focusTargetRef.current || !focusCameraRef.current) {
      return;
    }

    const easing = 1 - Math.exp(-delta * 3.8);
    const controls = controlsRef.current;

    controls.target.lerp(focusTargetRef.current, easing);
    camera.position.lerp(focusCameraRef.current, easing);
    controls.update();

    if (
      camera.position.distanceTo(focusCameraRef.current) < 0.08 &&
      controls.target.distanceTo(focusTargetRef.current) < 0.08
    ) {
      focusTargetRef.current = null;
      focusCameraRef.current = null;
    }
  });

  return null;
}

function WorldMapOverlay() {
  const texture = useLoader(TextureLoader, worldMapOverlayUri);

  texture.colorSpace = SRGBColorSpace;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} renderOrder={1}>
      <planeGeometry args={[mapPlaneWidth, mapPlaneDepth, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.68}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function ConflictField() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[39, 21.5, 1, 1]} />
        <meshStandardMaterial
          color="#07121f"
          emissive="#0f4550"
          emissiveIntensity={0.26}
          metalness={0.08}
          roughness={0.92}
          transparent
          opacity={0.88}
        />
      </mesh>
      <WorldMapOverlay />
      <gridHelper args={[39, 28, "#123841", "#0a1e29"]} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[38.4, 20.8, 24, 16]} />
        <meshBasicMaterial color="#7fd6c3" transparent opacity={0.02} wireframe />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <planeGeometry args={[34, 17.8, 18, 10]} />
        <meshBasicMaterial color="#ff9359" transparent opacity={0.05} wireframe />
      </mesh>
    </group>
  );
}

export function SimulationScene({
  selectedActorId,
  selectedRelationshipId,
  showLabels,
  onSelectActor,
  onSelectRelationship,
  onZoomDistanceChange
}: SimulationSceneProps) {
  const orbitControlsRef = useRef<{ target: Vector3; update: () => void } | null>(null);
  const [hoveredActorId, setHoveredActorId] = useState<string | null>(null);
  const selectedRelationship = selectedRelationshipId
    ? simulationRelationships.find((relationship) => relationship.id === selectedRelationshipId) ?? null
    : null;
  const selectedRelationshipEndpointIds = selectedRelationship
    ? [selectedRelationship.sourceId, selectedRelationship.targetId]
    : [];

  const contextHighlightedRelationshipIds = selectedRelationship && hoveredActorId
    ? simulationRelationships
        .filter((relationship) => {
          const sharesHoveredActor =
            relationship.sourceId === hoveredActorId || relationship.targetId === hoveredActorId;
          const sharesSelectedEndpoint = selectedRelationshipEndpointIds.some(
            (actorId) => relationship.sourceId === actorId || relationship.targetId === actorId
          );

          return sharesHoveredActor && sharesSelectedEndpoint;
        })
        .map((relationship) => relationship.id)
    : [];

  const contextHighlightedActorIds = new Set<string>(selectedRelationshipEndpointIds);

  contextHighlightedRelationshipIds.forEach((relationshipId) => {
    const relationship = simulationRelationships.find((candidate) => candidate.id === relationshipId);

    if (!relationship) {
      return;
    }

    contextHighlightedActorIds.add(relationship.sourceId);
    contextHighlightedActorIds.add(relationship.targetId);
  });

  return (
    <>
      <color attach="background" args={["#050b16"]} />
      <fog attach="fog" args={["#050b16", 24, 74]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#b5ffee", "#041120", 0.5]} />
      <directionalLight position={[14, 16, 9]} intensity={1.18} color="#e5fff6" />
      <pointLight position={[-14, 8, -10]} intensity={10} color="#58ffd1" />
      <pointLight position={[12, 2, 12]} intensity={7.5} color="#ff9d6b" />
      <Stars radius={96} depth={28} count={5200} factor={4.4} saturation={0} fade speed={0.7} />
      <Sparkles count={110} scale={[24, 14, 24]} size={5} speed={0.16} color="#8de8ff" />
      <ConflictField />
      <CameraTelemetry onZoomDistanceChange={onZoomDistanceChange} />
      <CameraFocusController focusActorId={selectedActorId} controlsRef={orbitControlsRef} />

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
            isSelected={relationship.id === selectedRelationshipId}
            isContextHighlighted={contextHighlightedRelationshipIds.includes(relationship.id)}
            showLabels={
              showLabels &&
              relationship.strength >= 62 &&
              (sourceActor.detailTier === "core" || targetActor.detailTier === "core")
            }
            isHighlighted={
              relationship.sourceId === selectedActorId ||
              relationship.targetId === selectedActorId ||
              relationship.id === selectedRelationshipId
            }
            onSelect={onSelectRelationship}
          />
        );
      })}

      {simulationActors.map((actor) => (
        <OrbNode
          key={actor.id}
          actor={actor}
          isSelected={
            actor.id === selectedActorId ||
            actor.id === selectedRelationship?.sourceId ||
            actor.id === selectedRelationship?.targetId
          }
          isContextHighlighted={contextHighlightedActorIds.has(actor.id)}
          showLabels={showLabels && actor.detailTier === "core"}
          onHoverChange={setHoveredActorId}
          onSelect={onSelectActor}
        />
      ))}

      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        enablePan
        enableZoom
        enableRotate
        dampingFactor={0.08}
        minDistance={10}
        maxDistance={46}
        target={[orbitTarget.x, orbitTarget.y, orbitTarget.z]}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI * 0.56}
      />
    </>
  );
}