"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  Background,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { CaseStudyDiagram, DiagramNodeKind } from "@/data/caseStudies";

type StepData = { label: string; sub?: string; kind: DiagramNodeKind };
type StepNode = Node<StepData, "step">;

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" } as const;

function StepNodeView({ data }: NodeProps<StepNode>) {
  // "ai" renders inverted, same as the cards on the Works section.
  const inverted = data.kind === "ai";
  return (
    <div
      className={`w-40 border-[3px] border-ink px-3 py-2.5 ${
        inverted ? "bg-ink text-bg" : "bg-bg text-ink"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={HANDLE_STYLE}
      />
      <p className="font-sans text-[14px] leading-tight font-medium">
        {data.label}
      </p>
      {data.sub && (
        <p className="mt-1 font-sans text-[11px] leading-tight font-light opacity-60">
          {data.sub}
        </p>
      )}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        style={HANDLE_STYLE}
      />
    </div>
  );
}

// Must live outside the component so React Flow gets a stable reference.
const NODE_TYPES = { step: StepNodeView };

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export default function WorkflowDiagram({
  diagram,
}: {
  diagram: CaseStudyDiagram;
}) {
  const reduced = useReducedMotion();

  const nodes = useMemo<StepNode[]>(
    () =>
      diagram.nodes.map((n) => ({
        id: n.id,
        type: "step",
        position: { x: n.x, y: n.y },
        data: { label: n.label, sub: n.sub, kind: n.kind },
      })),
    [diagram],
  );

  const edges = useMemo<Edge[]>(
    () =>
      diagram.edges.map((e) => ({
        id: `${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        type: "smoothstep",
        animated: !reduced,
        label: e.label,
        style: { stroke: "var(--color-ink)", strokeWidth: 2.5 },
        labelStyle: {
          fill: "var(--color-ink)",
          fontSize: 10,
          fontFamily: "var(--font-mono)",
        },
        labelShowBg: true,
        labelBgStyle: { fill: "var(--color-bg)" },
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 0,
      })),
    [diagram, reduced],
  );

  return (
    <figure
      aria-label="Workflow diagram"
      className="m-0 overflow-x-auto border-[3px] border-ink bg-bg"
    >
      <div className="h-85 min-w-275">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.2}
          maxZoom={1}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        >
          <Background
            gap={24}
            size={2.4}
            color="var(--color-ink)"
            style={{ opacity: 0.18 }}
          />
        </ReactFlow>
      </div>
    </figure>
  );
}