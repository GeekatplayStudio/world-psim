"use client";

import { Html, QuadraticBezierLine } from "@react-three/drei";
import { Vector3 } from "three";

import { getRelationshipColor } from "./simulation-data";
import type { SimulationRelationship } from "./simulation-types";

type RelationshipLineProps = {
  relationship: SimulationRelationship;
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
};

export function RelationshipLine({
  relationship,
  start,
  end,
  isHighlighted
}: RelationshipLineProps) {
  const isActiveConflict = relationship.relationshipType === "active_conflict";
  const startVector = new Vector3(...start);
  const endVector = new Vector3(...end);
  const arcNormal = startVector.clone().add(endVector).normalize();
  const midpoint = startVector.clone().lerp(endVector, 0.5);
  const arcHeight = 1.2 + relationship.strength / 55 + (isActiveConflict ? 1.1 : 0);
  const midVector = arcNormal.multiplyScalar(midpoint.length() + arcHeight);
  const mid: [number, number, number] = [midVector.x, midVector.y, midVector.z];
  const lineWidth = Math.max(
    isActiveConflict ? 4 : 1.5,
    relationship.strength / (isActiveConflict ? 16 : 28)
  );
  const labelClassName = isActiveConflict
    ? "rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-rose-100 shadow-panel backdrop-blur"
    : "rounded-full border border-white/10 bg-slate-950/85 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-100 shadow-panel backdrop-blur";

  return (
    <group>
      {isActiveConflict ? (
        <QuadraticBezierLine
          start={start}
          end={end}
          mid={mid}
          color="#ffd4de"
          lineWidth={lineWidth + 2.6}
          transparent
          opacity={0.14}
        />
      ) : null}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={getRelationshipColor(relationship.relationshipType)}
        lineWidth={lineWidth}
        transparent
        opacity={isActiveConflict ? 0.86 : isHighlighted ? 0.95 : 0.26}
        dashed={relationship.relationshipType === "mediation" || relationship.relationshipType === "ceasefire"}
        dashScale={18}
        gapSize={
          relationship.relationshipType === "mediation" || relationship.relationshipType === "ceasefire"
            ? 0.45
            : 0
        }
      />
      {isHighlighted || isActiveConflict ? (
        <Html position={mid} center>
          <div className={labelClassName}>
            {relationship.relationshipType.replaceAll("_", " ")}
          </div>
        </Html>
      ) : null}
    </group>
  );
}