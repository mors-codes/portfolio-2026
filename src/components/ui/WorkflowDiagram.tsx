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
import { GitBranch, Send, Sparkles, Zap } from "lucide-react";
import "@xyflow/react/dist/style.css";
import type { CaseStudyDiagram, DiagramNodeKind } from "@/data/caseStudies";

type StepData = { label: string; sub?: string; kind: DiagramNodeKind };

const KIND_META = {
  trigger: { label: "Trigger", Icon: Zap, color: "#E5405E" },
  ai: { label: "AI", Icon: Sparkles, color: "#6C47FF" },
  logic: { label: "Logic", Icon: GitBranch, color: "#F59E0B" },
  action: { label: "Action", Icon: Send, color: "#16A34A" },
} as const;

// Edges take the color of the node they point to.
const edgeColor = (diagram: CaseStudyDiagram, targetId: string) => {
  const kind = diagram.nodes.find((n) => n.id === targetId)?.kind;
  return kind ? KIND_META[kind].color : "var(--color-ink)";
};
type StepNode = Node<StepData, "step">;

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" } as const;

// Keep NODE_W in sync with the node's w-[160px] below.
const NODE_W = 160;
const FRAME_PAD = 40;
// The frame's 3px border on each side.
const BORDER_W = 6;

function StepNodeView({ data }: NodeProps<StepNode>) {
  const { label: kindLabel, Icon, color } = KIND_META[data.kind];
  return (
    <div
      className="w-40 border-[3px] bg-bg px-3 py-2.5 text-ink"
      style={{ borderColor: color }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={HANDLE_STYLE}
      />
      <div className="mb-2 flex items-center justify-between">
        <span
          className="px-1.5 py-0.5 font-mono text-[8px] tracking-wider text-white uppercase"
          style={{ backgroundColor: color }}
        >
          {kindLabel}
        </span>
        <Icon size={13} strokeWidth={2.25} color={color} aria-hidden="true" />
      </div>
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

  // Frame width follows the workflow: its span plus padding.
  const frameWidth = useMemo(() => {
    const xs = diagram.nodes.map((n) => n.x);
    return (
      Math.max(...xs) - Math.min(...xs) + NODE_W + FRAME_PAD * 2 + BORDER_W
    );
  }, [diagram]);

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
        style: { stroke: edgeColor(diagram, e.to), strokeWidth: 2.5 },
        labelStyle: {
          fill: edgeColor(diagram, e.to),
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
      className="m-0 mx-auto max-w-full overflow-x-auto border-[3px] border-ink bg-bg"
      style={{ width: frameWidth }}
    >
      <div className="h-85" style={{ minWidth: frameWidth - BORDER_W }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{ padding: `${FRAME_PAD}px` }}
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