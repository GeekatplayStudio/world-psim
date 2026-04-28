"use client";

import { Html, QuadraticBezierLine } from "@react-three/drei";

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
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    Math.max(start[1], end[1]) + 1.1 + relationship.strength / 120,
    (start[2] + end[2]) / 2
  ];

  return (
    <group>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={getRelationshipColor(relationship.relationshipType)}
        lineWidth={Math.max(1.8, relationship.strength / 22)}
        transparent
        opacity={isHighlighted ? 0.95 : 0.38}
        dashed={relationship.relationshipType === "mediation"}
        dashScale={18}
        gapSize={relationship.relationshipType === "mediation" ? 0.45 : 0}
      />
      {isHighlighted ? (
        <Html position={mid} center>
          <div className="rounded-full border border-white/10 bg-slate-950/85 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-100 shadow-panel backdrop-blur">
            {relationship.relationshipType.replaceAll("_", " ")}
          </div>
        </Html>
      ) : null}
    </group>
  );
}