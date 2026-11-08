"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
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

type NodeState = "idle" | "active" | "dimmed";

// Node objects stay fixed. Highlight state flows through context, because
// swapping the nodes array on every step makes React Flow re-measure the
// nodes, and they flicker.
type StepData = { label: string; sub?: string; kind: DiagramNodeKind };
type StepNode = Node<StepData, "step">;

type DiagramState = {
  states: Record<string, NodeState>;
  activeId: string | null;
  onSelect: (id: string) => void;
};

const DiagramContext = createContext<DiagramState>({
  states: {},
  activeId: null,
  onSelect: () => {},
});

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

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" } as const;

// Keep NODE_W in sync with the node's w-40 below.
const NODE_W = 160;
const FRAME_PAD = 40;
// The frame's 3px border on each side.
const BORDER_W = 6;
// How long each step stays lit while the flow runs.
const STEP_MS = 2800;

function StepNodeView({ id, data }: NodeProps<StepNode>) {
  const { states, activeId, onSelect } = useContext(DiagramContext);
  const state = states[id] ?? "idle";
  const active = state === "active";
  const { label: kindLabel, Icon, color } = KIND_META[data.kind];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={activeId === id ? "step" : undefined}
      onClick={() => onSelect(id)}
      onKeyDown={onKeyDown}
      className={`pointer-events-auto w-40 cursor-pointer border-[3px] bg-bg px-3 py-2.5 text-ink transition-[opacity,box-shadow,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
        state === "dimmed" ? "opacity-30" : "opacity-100"
      }`}
      style={{
        borderColor: color,
        boxShadow: active ? `4px 4px 0 0 ${color}` : undefined,
      }}
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

// The node itself plus every node before it, following edges backward.
function ancestors(diagram: CaseStudyDiagram, start: string) {
  const seen = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const e of diagram.edges) {
      if (e.to === cur && !seen.has(e.from)) {
        seen.add(e.from);
        stack.push(e.from);
      }
    }
  }
  return seen;
}

export default function WorkflowDiagram({
  diagram,
}: {
  diagram: CaseStudyDiagram;
}) {
  const reduced = useReducedMotion();

  // The flow steps through the nodes left to right and loops. Clicking a step
  // jumps the flow to it, and it carries on from there.
  const order = useMemo(
    () => [...diagram.nodes].sort((a, b) => a.x - b.x || a.y - b.y),
    [diagram],
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [index, setIndex] = useState(0);
  const [runKey, setRunKey] = useState(0);

  // With reduced motion the flow stays idle until a step is clicked.
  const shown = (started && !reduced) || clicked;
  const activeId = shown ? (order[index]?.id ?? null) : null;
  const activeNode = diagram.nodes.find((n) => n.id === activeId);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Runs only while the diagram is on screen. Changing `runKey` (a click)
  // restarts the timer, so the clicked step gets its full time.
  useEffect(() => {
    if (reduced || !inView || order.length < 2) return;
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % order.length),
      STEP_MS,
    );
    return () => window.clearInterval(t);
  }, [reduced, inView, order.length, runKey]);

  const onSelect = useCallback(
    (id: string) => {
      const i = order.findIndex((n) => n.id === id);
      if (i < 0) return;
      setIndex(i);
      setClicked(true);
      setRunKey((k) => k + 1);
    },
    [order],
  );

  // Frame width follows the workflow: its span plus padding.
  const frameWidth = useMemo(() => {
    const xs = diagram.nodes.map((n) => n.x);
    return (
      Math.max(...xs) - Math.min(...xs) + NODE_W + FRAME_PAD * 2 + BORDER_W
    );
  }, [diagram]);

  // Lights the way to the current step, so it reads like a run moving through.
  const route = useMemo(
    () => (activeId ? ancestors(diagram, activeId) : null),
    [diagram, activeId],
  );

  const states = useMemo(() => {
    const out: Record<string, NodeState> = {};
    for (const n of diagram.nodes) {
      if (!activeId) out[n.id] = "idle";
      else out[n.id] = n.id === activeId ? "active" : "dimmed";
    }
    return out;
  }, [diagram, activeId]);

  const context = useMemo<DiagramState>(
    () => ({ states, activeId, onSelect }),
    [states, activeId, onSelect],
  );

  // Built once per diagram. Never rebuilt when the step changes.
  const nodes = useMemo<StepNode[]>(
    () =>
      diagram.nodes.map(
        (n): StepNode => ({
          id: n.id,
          type: "step",
          position: { x: n.x, y: n.y },
          data: { label: n.label, sub: n.sub, kind: n.kind },
        }),
      ),
    [diagram],
  );

  const edges = useMemo<Edge[]>(
    () =>
      diagram.edges.map((e): Edge => {
        const onRoute = !route || (route.has(e.from) && route.has(e.to));
        const color = edgeColor(diagram, e.to);
        return {
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          type: "smoothstep",
          animated: !reduced,
          label: e.label,
          style: {
            stroke: color,
            strokeWidth: route && onRoute ? 3.5 : 2.5,
            opacity: onRoute ? 1 : 0.15,
            transition: "opacity 200ms",
          },
          labelStyle: {
            fill: color,
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            opacity: onRoute ? 1 : 0.2,
          },
          labelShowBg: true,
          labelBgStyle: {
            fill: "var(--color-bg)",
            opacity: onRoute ? 1 : 0.2,
          },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 0,
        };
      }),
    [diagram, route, reduced],
  );

  return (
    <div ref={wrapRef}>
      <figure
        aria-label="Workflow diagram"
        className="m-0 mx-auto max-w-full overflow-x-auto border-[3px] border-ink bg-bg"
        style={{ width: frameWidth }}
      >
        <div className="h-85" style={{ minWidth: frameWidth - BORDER_W }}>
          <DiagramContext.Provider value={context}>
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
          </DiagramContext.Provider>
        </div>
      </figure>

      <div
        aria-live="off"
        className="mx-auto mt-4 max-w-full"
        style={{ width: frameWidth }}
      >
        <div
          className="border-[3px] border-ink/20 px-5 py-4 transition-colors"
          style={{
            borderLeftColor: activeNode
              ? KIND_META[activeNode.kind].color
              : undefined,
          }}
        >
          {activeNode ? (
            <div key={activeNode.id} className="note-in">
              <p
                className="font-mono text-[10px] tracking-[1.08px] uppercase"
                style={{ color: KIND_META[activeNode.kind].color }}
              >
                {KIND_META[activeNode.kind].label}
              </p>
              <p className="mt-1 font-sans text-base font-medium tracking-tight">
                {activeNode.label}
              </p>
              {activeNode.note && (
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/70">
                  {activeNode.note}
                </p>
              )}
            </div>
          ) : (
            <p className="note-in font-mono text-[10px] tracking-[1.08px] text-ink/40 uppercase">
              Click a step to see what it does
            </p>
          )}
        </div>
      </div>
    </div>
  );
}