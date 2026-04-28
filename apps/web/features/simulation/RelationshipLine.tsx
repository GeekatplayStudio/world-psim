"use client";

import { Html, QuadraticBezierLine } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { Vector3 } from "three";

import { getRelationshipColor } from "./simulation-data";
import type { SimulationRelationship } from "./simulation-types";

type RelationshipLineProps = {
  relationship: SimulationRelationship;
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
  isSelected: boolean;
  isContextHighlighted: boolean;
  showLabels: boolean;
  onSelect: (relationshipId: string) => void;
};

export function RelationshipLine({
  relationship,
  start,
  end,
  isHighlighted,
  isSelected,
  isContextHighlighted,
  showLabels,
  onSelect
}: RelationshipLineProps) {
  const isActiveConflict = relationship.relationshipType === "active_conflict";
  const startVector = new Vector3(...start);
  const endVector = new Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const distance = direction.length();
  const midpoint = startVector.clone().lerp(endVector, 0.5);
  const sideVector = new Vector3(-direction.z, 0, direction.x);

  if (sideVector.lengthSq() > 0) {
    sideVector.normalize().multiplyScalar(
      distance * (isActiveConflict ? 0.045 : 0.028) * (relationship.sourceId < relationship.targetId ? 1 : -1)
    );
  }

  const arcHeight = Math.min(3.1, 0.34 + distance * 0.08 + (isActiveConflict ? 0.62 : 0.18));
  const midVector = midpoint.clone().add(sideVector);

  midVector.y = Math.max(startVector.y, endVector.y) + arcHeight;

  const mid: [number, number, number] = [midVector.x, midVector.y, midVector.z];
  const lineWidth = Math.max(
    isActiveConflict ? 2.25 : 1.08,
    relationship.strength / (isActiveConflict ? 26 : 46)
  );
  const conflictCoreColor = relationship.strength >= 88 ? "#ff103d" : "#ff335a";
  const showLabel = showLabels || isHighlighted || isSelected || isContextHighlighted;
  const labelClassName = isActiveConflict
    ? "rounded-full border border-rose-400/30 bg-rose-500/18 px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] text-rose-100 shadow-panel backdrop-blur"
    : "rounded-full border border-white/10 bg-slate-950/88 px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] text-slate-100 shadow-panel backdrop-blur";

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(relationship.id);
  };

  return (
    <group>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color="#ffffff"
        lineWidth={Math.max(lineWidth + 2.2, 4.2)}
        transparent
        opacity={0.001}
        onClick={handleSelect}
      />
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={isActiveConflict ? "#ff9bad" : "#d8f4ff"}
        lineWidth={lineWidth + (isActiveConflict ? 1.1 : 0.55) + (isContextHighlighted ? 0.22 : 0)}
        transparent
        opacity={
          isContextHighlighted
            ? 0.22
            : isActiveConflict
              ? 0.13
              : isHighlighted || isSelected
                ? 0.14
                : 0.04
        }
        onClick={handleSelect}
      />
      {isActiveConflict ? (
        <QuadraticBezierLine
          start={start}
          end={end}
          mid={mid}
          color="#ffb7c6"
          lineWidth={lineWidth + 0.7 + (isContextHighlighted ? 0.18 : 0)}
          transparent
          opacity={isSelected ? 0.26 : isContextHighlighted ? 0.22 : 0.18}
          onClick={handleSelect}
        />
      ) : null}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={isActiveConflict ? conflictCoreColor : getRelationshipColor(relationship.relationshipType)}
        lineWidth={lineWidth + (isContextHighlighted ? 0.12 : 0)}
        transparent
        opacity={
          isSelected
            ? 1
            : isContextHighlighted
              ? 0.92
              : isActiveConflict
                ? 0.94
                : isHighlighted
                  ? 0.94
                  : 0.3
        }
        dashed={relationship.relationshipType === "mediation" || relationship.relationshipType === "ceasefire"}
        dashScale={18}
        gapSize={
          relationship.relationshipType === "mediation" || relationship.relationshipType === "ceasefire"
            ? 0.45
            : 0
        }
        onClick={handleSelect}
      />
      {showLabel ? (
        <Html position={mid} center style={{ pointerEvents: "none" }}>
          <div className={labelClassName}>
            {relationship.relationshipType.replaceAll("_", " ")}
          </div>
        </Html>
      ) : null}
    </group>
  );
}